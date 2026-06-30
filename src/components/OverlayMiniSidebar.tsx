import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import clsx from "clsx";
import DofusIcon, { type DofusIconName } from "./DofusIcon";
import { openGlobalSearch } from "./GlobalSearch";
import { useStore } from "../store/store";
import { NAV_GROUPS } from "../lib/navItems";

type MiniItem = {
  to: string;
  label: string;
  icon: DofusIconName;
};

const MINI_GROUPS: MiniItem[][] = NAV_GROUPS.map((group) =>
  group.items.map((item) => ({ to: item.to, label: item.label, icon: item.dofus })),
);

export default function OverlayMiniSidebar() {
  const lastGuide = useStore((s) => s.recentGuides[0]);

  return (
    <aside className="relative z-20 flex w-[48px] shrink-0 flex-col border-r border-white/10 bg-void-900/70 backdrop-blur-md">
      <div className="flex justify-center border-b border-white/5 p-1.5">
        <button
          onClick={openGlobalSearch}
          title="Rechercher"
          className="no-drag grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.07] transition hover:border-glow-purple/40 hover:bg-white/[0.1]"
        >
          <DofusIcon name="search" size={17} tint="#c4b5fd" />
        </button>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden px-1.5 py-2">
        {MINI_GROUPS.map((group, gi) => (
          <div key={gi} className="flex flex-col gap-1">
            {gi > 0 && <div className="mx-auto my-1 h-px w-5 bg-white/10" />}
            {group.map((item) => {
              const to = item.to === "/guides" && lastGuide ? `/guides/${lastGuide}` : item.to;
              return <MiniLink key={item.to} item={item} to={to} />;
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

function MiniLink({ item, to }: { item: MiniItem; to: string }) {
  const location = useLocation();
  const active = item.to === "/" ? location.pathname === "/" : location.pathname === item.to || location.pathname.startsWith(item.to + "/");
  return (
    <NavLink
      to={to}
      title={item.label}
      end={item.to === "/"}
      className={() =>
        clsx(
          "no-drag group relative grid h-8 w-8 place-items-center rounded-lg bg-white/[0.045] transition hover:bg-white/[0.1]",
          active && "bg-glow-cyan/10",
        )
      }
    >
      {() => (
        <>
          {active && (
            <motion.span
              layoutId="overlay-mini-active"
              className="absolute inset-0 rounded-lg border border-glow-cyan/35 bg-glow-cyan/15 shadow-[0_0_16px_rgb(var(--c-cyan)/0.18)]"
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            />
          )}
          <DofusIcon
            name={item.icon}
            size={18}
            tint={active ? "#67e8f9" : "#cbd5e1"}
            className={clsx("relative transition", active ? "opacity-100" : "opacity-85 group-hover:opacity-100")}
          />
        </>
      )}
    </NavLink>
  );
}
