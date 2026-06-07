import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const apiKey = process.env.VIRUSTOTAL_API_KEY;
if (!apiKey) {
  console.warn('⚠️ VIRUSTOTAL_API_KEY manquant. Scan VirusTotal ignoré.');
  process.exit(0);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const releaseDir = path.resolve(__dirname, '..', 'release');
const allowedExtensions = ['.exe', '.msi', '.dmg', '.zip', '.nsis'];

async function computeSha256(filePath) {
  const data = await fsPromises.readFile(filePath);
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

const MAX_VT_UPLOAD_SIZE = 32 * 1024 * 1024;

async function fetchJson(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: { message: `VirusTotal returned invalid JSON (${response.status})`, details: text.slice(0, 400) } };
  }
}

async function getExistingAnalysis(sha256) {
  const response = await fetch(`https://www.virustotal.com/api/v3/files/${sha256}`, {
    method: 'GET',
    headers: { 'x-apikey': apiKey },
  });
  if (response.status === 404) {
    return null;
  }
  const json = await fetchJson(response);
  if (!response.ok) {
    throw new Error(`VirusTotal hash lookup failed for ${sha256}: ${json.error?.message || response.statusText}`);
  }
  return json;
}

async function uploadAndScan(fileName, filePath, sha256) {
  const fileData = await fsPromises.readFile(filePath);
  const form = new FormData();
  form.append('file', new Blob([fileData]), fileName);

  const response = await fetch('https://www.virustotal.com/api/v3/files', {
    method: 'POST',
    headers: { 'x-apikey': apiKey },
    body: form,
  });

  if (response.status === 413) {
    return null;
  }

  const json = await fetchJson(response);
  if (!response.ok) {
    throw new Error(`VirusTotal upload failed for ${fileName}: ${json.error?.message || response.statusText}`);
  }

  return json.data?.id || null;
}

async function scanFile(fileName) {
  const filePath = path.join(releaseDir, fileName);
  const sha256 = await computeSha256(filePath);
  const stats = await fsPromises.stat(filePath);

  console.log(`\n🔎 Scan VirusTotal: ${fileName}`);
  console.log(`   Hash SHA-256: ${sha256}`);
  console.log(`   Taille : ${(stats.size / 1024 / 1024).toFixed(1)} Mo`);

  if (stats.size > MAX_VT_UPLOAD_SIZE) {
    console.warn('⚠️ Fichier trop volumineux pour upload direct sur VirusTotal. Recherche par hash...');
    const existing = await getExistingAnalysis(sha256);
    if (!existing) {
      console.warn('⚠️ Aucun rapport VirusTotal existant pour ce hash. Scan ignoré.');
      return;
    }
    const existingStats = existing.data?.attributes?.last_analysis_stats;
    if (!existingStats) {
      throw new Error(`Analyse VirusTotal incomplète pour ${fileName}.`);
    }

    console.log(`   Rapport public : https://www.virustotal.com/gui/file/${sha256}/detection`);
    console.log(`   Résultat : ${existingStats.malicious} malveillant, ${existingStats.suspicious} suspect, ${existingStats.harmless} propres, ${existingStats.undetected} non détectés`);
    if (existingStats.malicious > 0 || existingStats.suspicious > 0) {
      throw new Error(`VirusTotal a trouvé un problème sur ${fileName} (${existingStats.malicious} malveillant, ${existingStats.suspicious} suspect).`);
    }
    return;
  }

  const analysisId = await uploadAndScan(fileName, filePath, sha256);
  if (!analysisId) {
    console.warn('⚠️ VirusTotal a refusé l’upload ou le fichier est trop volumineux. Scan ignoré.');
    return;
  }

  console.log(`   Rapport public : https://www.virustotal.com/gui/file/${sha256}/detection`);
  console.log('   Attente de l’analyse…');

  const analysis = await waitForAnalysis(analysisId);
  const analysisStats = analysis.data?.attributes?.stats;
  if (!analysisStats) {
    throw new Error(`Analyse VirusTotal incomplète pour ${fileName}.`);
  }

  console.log(`   Résultat : ${analysisStats.malicious} malveillant, ${analysisStats.suspicious} suspect, ${analysisStats.harmless} propres, ${analysisStats.undetected} non détectés`);

  if (analysisStats.malicious > 0 || analysisStats.suspicious > 0) {
    throw new Error(`VirusTotal a trouvé un problème sur ${fileName} (${analysisStats.malicious} malveillant, ${analysisStats.suspicious} suspect).`);
  }
}

async function main() {
  const entries = await fsPromises.readdir(releaseDir, { withFileTypes: true });
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
  console.error('\n❌ Erreur de scan VirusTotal :', err);
  if (err && err.stack) {
    console.error(err.stack);
  }
  process.exit(1);
});
