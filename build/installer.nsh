; Script NSIS custom injecté par electron-builder (nsis.include).
;
; Problème résolu : DofusCodex lance un process natif séparé, DofusCodex.MacroHelper.exe, depuis
; resources/macro-helper/ — donc DANS le dossier d'installation. Si ce helper tourne (macros
; activées) au moment d'une mise à jour, son exe VERROUILLE le dossier d'install → l'installeur
; ne peut pas écraser les fichiers et affiche « DofusCodex ne peut pas être fermé », faisant
; échouer la mise à jour automatique.
;
; La correction DOIT vivre dans l'installeur (pas seulement dans l'app) : un utilisateur qui met
; à jour depuis une ancienne version exécute l'ANCIEN code de l'app — seul le NOUVEL installeur,
; lui, tourne à jour. On tue donc le helper ici, très tôt, avant la vérification « app en cours »
; d'electron-builder et avant toute copie de fichiers.
;
; taskkill est sans effet (silencieux) si le helper n'est pas lancé (cas sans macros) → inoffensif.

!macro killMacroHelper
  nsExec::Exec 'taskkill /F /T /IM "DofusCodex.MacroHelper.exe"'
  Pop $0
!macroend

; preInit = tout début du .onInit, AVANT le check « application en cours d'exécution ».
!macro preInit
  !insertmacro killMacroHelper
!macroend

; customInit = fin du .onInit — deuxième filet de sécurité avant la section d'installation.
!macro customInit
  !insertmacro killMacroHelper
!macroend
