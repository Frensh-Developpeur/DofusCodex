import type React from "react";

// Poignée de redimensionnement coin bas-droit pour la fenêtre overlay. Nécessaire car une fenêtre
// transparente sans cadre n'est pas redimensionnable nativement (notamment sous Windows). On suit
// le déplacement de la souris et on demande à Electron de retailler la fenêtre (setSize).
export default function OverlayResizeHandle() {
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.screenX;
    const startY = e.screenY;
    const startW = window.innerWidth;
    const startH = window.innerHeight;

    const onMove = (ev: MouseEvent) => {
      const width = startW + (ev.screenX - startX);
      const height = startH + (ev.screenY - startY);
      window.dofusCodex?.overlayResize?.({ width, height });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      onMouseDown={onMouseDown}
      title="Redimensionner"
      className="no-drag fixed bottom-0 right-0 z-[80] h-4 w-4 cursor-nwse-resize"
      style={{
        // petit chevron en coin
        background:
          "linear-gradient(135deg, transparent 0 50%, rgba(255,255,255,0.35) 50% 60%, transparent 60% 70%, rgba(255,255,255,0.35) 70% 80%, transparent 80%)",
      }}
    />
  );
}
