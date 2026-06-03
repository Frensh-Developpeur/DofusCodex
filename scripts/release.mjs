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

function readToken() {
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN.trim();
  if (existsSync(".env")) {
    const m = readFileSync(".env", "utf8").match(/^\s*GH_TOKEN\s*=\s*(.+)\s*$/m);
    if (m) return m[1].trim();
  }
  return null;
}

const token = readToken();
if (!token) {
  console.error(
    "\n❌ GH_TOKEN manquant.\n" +
      "   Crée un fichier .env à la racine avec :  GH_TOKEN=ton_token_github\n" +
      "   (token : github.com → Settings → Developer settings → token classique, scope « repo »)\n",
  );
  process.exit(1);
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
    env: { ...process.env, GH_TOKEN: token, CSC_IDENTITY_AUTO_DISCOVERY: "false" },
  });

// Build du renderer puis build + publication de l'app (cible = l'OS courant).
run("npx vite build");
run("npx electron-builder --publish always");

console.log(
  `\n✅ Version ${pkg.version} compilée et envoyée.\n` +
    "   → Sur GitHub (repo des releases), ouvre la release en brouillon et clique « Publish »\n" +
    "     pour déclencher la mise à jour chez les utilisateurs.\n",
);
