const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

exports.default = async function beforePack(context) {
  // Le contexte beforePack n'expose pas `projectDir` directement : il est porté par le packager.
  const projectDir = context.packager.projectDir || context.packager.info.projectDir || process.cwd();
  const outDir = path.join(projectDir, "build", "macro-helper", "win");
  fs.mkdirSync(outDir, { recursive: true });

  if (context.electronPlatformName !== "win32") {
    fs.writeFileSync(path.join(outDir, ".keep"), "Windows macro helper is built only for win32 packages.\n");
    return;
  }

  const project = path.join(projectDir, "native", "win-macro-helper", "DofusCodex.MacroHelper.csproj");
  console.log(`[beforePack] build helper Windows : ${project}`);
  execFileSync(
    "dotnet",
    [
      "publish",
      project,
      "-c",
      "Release",
      "-r",
      "win-x64",
      "--self-contained",
      "true",
      "-p:PublishSingleFile=true",
      "-p:IncludeNativeLibrariesForSelfExtract=true",
      "-o",
      outDir,
    ],
    { stdio: "inherit" },
  );
};
