import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { fileFromSync } from 'node:stream/web';

const apiKey = process.env.VIRUSTOTAL_API_KEY;
if (!apiKey) {
  console.error('❌ VIRUSTOTAL_API_KEY manquant. Ajoute ce secret dans GitHub Actions.');
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const releaseDir = path.resolve(__dirname, '..', 'release');
const allowedExtensions = ['.exe', '.msi', '.dmg', '.zip', '.nsis'];

async function computeSha256(filePath) {
  const data = await fs.readFile(filePath);
  return crypto.createHash('sha256').update(data).digest('hex');
}

async function waitForAnalysis(id) {
  const url = `https://www.virustotal.com/api/v3/analyses/${id}`;
  for (let attempt = 1; attempt <= 8; attempt++) {
    const response = await fetch(url, {
      headers: { 'x-apikey': apiKey },
    });
    const result = await response.json();
    const status = result.data?.attributes?.status;
    if (status === 'completed') {
      return result;
    }
    const delay = attempt * 2000;
    console.log(`  Attente analyse VirusTotal (${attempt}/8) : ${delay} ms`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error('Timeout : l’analyse VirusTotal n’a pas terminé à temps.');
}

async function scanFile(fileName) {
  const filePath = path.join(releaseDir, fileName);
  const sha256 = await computeSha256(filePath);
  console.log(`\n🔎 Scan VirusTotal: ${fileName}`);
  console.log(`   Hash SHA-256: ${sha256}`);

  const form = new FormData();
  form.set('file', fileFromSync(filePath));

  const response = await fetch('https://www.virustotal.com/api/v3/files', {
    method: 'POST',
    headers: { 'x-apikey': apiKey },
    body: form,
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(`VirusTotal upload failed for ${fileName}: ${json.error?.message || response.statusText}`);
  }

  const analysisId = json.data?.id;
  if (!analysisId) {
    throw new Error(`Impossible de récupérer l’ID d’analyse VirusTotal pour ${fileName}.`);
  }

  console.log(`   Rapport public : https://www.virustotal.com/gui/file/${sha256}/detection`);
  console.log('   Attente de l’analyse…');

  const analysis = await waitForAnalysis(analysisId);
  const stats = analysis.data?.attributes?.stats;
  if (!stats) {
    throw new Error(`Analyse VirusTotal incomplète pour ${fileName}.`);
  }

  console.log(`   Résultat : ${stats.malicious} malveillant, ${stats.suspicious} suspect, ${stats.harmless} propres, ${stats.undetected} non détectés`);

  if (stats.malicious > 0 || stats.suspicious > 0) {
    throw new Error(`VirusTotal a trouvé un problème sur ${fileName} (${stats.malicious} malveillant, ${stats.suspicious} suspect).`);
  }
}

async function main() {
  const entries = await fs.readdir(releaseDir, { withFileTypes: true });
  const artifacts = entries
    .filter((entry) => entry.isFile() && allowedExtensions.includes(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name);

  if (artifacts.length === 0) {
    console.error('❌ Aucun installeur trouvé dans le dossier release/.');
    process.exit(1);
  }

  for (const artifact of artifacts) {
    await scanFile(artifact);
  }

  console.log('\n✅ Tous les installeurs ont passé le scan VirusTotal.');
}

main().catch((err) => {
  console.error('\n❌ Erreur de scan VirusTotal :', err.message || err);
  process.exit(1);
});
