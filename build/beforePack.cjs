const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

exports.default = async function beforePack(context) {
  const outDir = path.join(context.projectDir, "build", "macro-helper", "win");
  fs.mkdirSync(outDir, { recursive: true });

  if (context.electronPlatformName !== "win32") {
    fs.writeFileSync(path.join(outDir, ".keep"), "Windows macro helper is built only for win32 packages.\n");
    return;
  }

  const project = path.join(context.projectDir, "native", "win-macro-helper", "DofusCodex.MacroHelper.csproj");
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
