; Script NSIS custom (electron-builder l'inclut automatiquement via build/installer.nsh).
;
; Problème résolu : lors d'une mise à jour lancée en mode NON-silencieux, l'installeur oneClick
; tente une fermeture « propre » de l'app et, s'il n'y arrive pas, affiche « DofusCodex ne peut
; pas être fermé » puis échoue. On force donc la fermeture de l'app (et de son helper de macros
; natif) TRÈS TÔT, avant la vérification « application en cours » et avant la copie de fichiers.
;
; Pourquoi ici et pas seulement dans l'app : une mise à jour DEPUIS une ancienne version exécute
; l'ANCIEN code de l'app (qui, sur les builds 0.1.65/0.1.66, lance l'installeur en non-silencieux).
; Seul le NOUVEL installeur est à jour → c'est lui qui doit forcer la fermeture. Ça débloque donc
; les machines coincées par les versions cassées.
;
; taskkill est silencieux et sans effet si le process n'existe pas (install neuve, app déjà fermée)
; → totalement inoffensif. Pas de /T sur l'app : l'installeur est détaché, mais on évite tout
; risque de le tuer avec l'arbre ; le helper est ciblé séparément par son propre nom d'image.

!macro killDofusCodex
  nsExec::Exec 'taskkill /F /IM "DofusCodex.exe"'
  Pop $0
  nsExec::Exec 'taskkill /F /IM "DofusCodex.MacroHelper.exe"'
  Pop $0
!macroend

; preInit = tout début du .onInit, AVANT le check « application en cours d'exécution ».
!macro preInit
  !insertmacro killDofusCodex
!macroend

; customInit = fin du .onInit — deuxième filet avant la section d'installation.
!macro customInit
  !insertmacro killDofusCodex
!macroend
