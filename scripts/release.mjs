// Publication en une commande : monte la version, build le renderer, et publie l'app
// (installeurs + manifeste de maj) sur le repo GitHub des releases via electron-builder.
//
//   npm run ship           → bump "patch"  (0.1.0 → 0.1.1)
//   npm run ship minor     → bump "minor"  (0.1.0 → 0.2.0)
//   npm run ship major     → bump "major"  (0.1.0 → 1.0.0)
//
// Le token GitHub (PAT, scope "repo") est lu depuis la variable d'env GH_TOKEN, ou depuis
// un fichier .env à la racine :  GH_TOKEN=ghp_xxxxx   (le .env est gitignoré, jamais publié).
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

function readEnv(name) {
  if (process.env[name]) return process.env[name].trim();
  if (existsSync(".env")) {
    const re = new RegExp(`^\\s*${name}\\s*=\\s*(.+)\\s*$`, "m");
    const m = readFileSync(".env", "utf8").match(re);
    if (m) return m[1].trim();
  }
  return null;
}

const token = readEnv("GH_TOKEN");
const virusTotalKey = readEnv("VIRUSTOTAL_API_KEY");
if (!token) {
  console.error(
    "\n❌ GH_TOKEN manquant.\n" +
      "   Crée un fichier .env à la racine avec :  GH_TOKEN=ton_token_github\n" +
      "   (token : github.com → Settings → Developer settings → token classique, scope « repo »)\n",
  );
  process.exit(1);
}
if (!virusTotalKey) {
  console.warn(
    "\n⚠️ VIRUSTOTAL_API_KEY manquant. Le scan VirusTotal sera ignoré.\n" +
      "   Ajoute le secret GitHub si tu veux activer le scan automatique.\n",
  );
}

const bump = (process.argv[2] || "patch").toLowerCase();
if (!["patch", "minor", "major"].includes(bump)) {
  console.error(`❌ Type de version invalide : "${bump}" (attendu : patch | minor | major)`);
  process.exit(1);
}

// Monte la version dans package.json.
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const [maj, min, pat] = pkg.version.split(".").map((n) => parseInt(n, 10) || 0);
pkg.version =
  bump === "major" ? `${maj + 1}.0.0` : bump === "minor" ? `${maj}.${min + 1}.0` : `${maj}.${min}.${pat + 1}`;
writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
console.log(`\n📦 Version → ${pkg.version}\n`);

const run = (cmd) =>
  execSync(cmd, {
    stdio: "inherit",
    env: {
      ...process.env,
      GH_TOKEN: token,
      CSC_IDENTITY_AUTO_DISCOVERY: "false",
      ...(virusTotalKey ? { VIRUSTOTAL_API_KEY: virusTotalKey } : {}),
    },
  });

// Build du renderer puis paquetage, scan VirusTotal, et publication.
run("npx vite build");
run("npx electron-builder --publish never");
run("node scripts/virustotal-scan.mjs");
run("npx electron-builder --publish always");

console.log(
  `\n✅ Version ${pkg.version} compilée, scannée, et envoyée.\n` +
    "   → Sur GitHub (repo des releases), ouvre la release en brouillon et clique « Publish »\n" +
    "     pour déclencher la mise à jour chez les utilisateurs.\n",
);
