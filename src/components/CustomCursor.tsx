import { useEffect, useState } from "react";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [ring, setRing] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    let rx = 0,
      ry = 0;
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const t = e.target as HTMLElement;
      setHover(!!t?.closest("a,button,[data-cursor='hover']"));
    };
    const loop = () => {
      setRing((r) => {
        rx = r.x + (pos.x - r.x) * 0.18;
        ry = r.y + (pos.y - r.y) * 0.18;
        return { x: rx, y: ry };
      });
      raf = requestAnimationFrame(loop);
    };
    let raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, [pos.x, pos.y]);

  return (
    <>
      <div
        className="cursor-dot hidden md:block"
        style={{
          transform: `translate(${pos.x - 3}px, ${pos.y - 3}px)`,
          width: 6,
          height: 6,
          borderRadius: 999,
          background: "white",
        }}
      />
      <div
        className="cursor-ring hidden md:block transition-[width,height,border-color] duration-200"
        style={{
          transform: `translate(${ring.x - (hover ? 24 : 16)}px, ${ring.y - (hover ? 24 : 16)}px)`,
          width: hover ? 48 : 32,
          height: hover ? 48 : 32,
          borderRadius: 999,
          border: "1px solid white",
          opacity: 0.9,
        }}
      />
    </>
  );
}
