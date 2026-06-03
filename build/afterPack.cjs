const { execSync } = require("node:child_process");
const path = require("node:path");

// Signature ad-hoc de l'app macOS (gratuite). Sans signature, Apple Silicon refuse l'app en
// affichant « DofusCodex est endommagé et ne peut pas être ouvert ». La signature ad-hoc lève
// ce blocage : l'utilisateur fera juste un clic-droit → Ouvrir la première fois (développeur
// non identifié). Elle n'active PAS l'auto-update mac (qui exige une vraie signature Apple).
exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== "darwin") return;
  const appPath = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`);
  console.log(`[afterPack] signature ad-hoc : ${appPath}`);
  try {
    execSync(`codesign --deep --force --sign - "${appPath}"`, { stdio: "inherit" });
  } catch (e) {
    console.warn("[afterPack] échec signature ad-hoc :", e?.message);
  }
};
