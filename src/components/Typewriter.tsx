import { useEffect, useState } from "react";

export function Typewriter({
  words,
  speed = 90,
  pause = 1400,
}: {
  words: string[];
  speed?: number;
  pause?: number;
}) {
  const [i, setI] = useState(0);
  const [sub, setSub] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    const word = words[i % words.length];
    if (!del && sub === word) {
      const t = setTimeout(() => setDel(true), pause);
      return () => clearTimeout(t);
    }
    if (del && sub === "") {
      setDel(false);
      setI((v) => v + 1);
      return;
    }
    const t = setTimeout(
      () => {
        setSub((s) => (del ? word.slice(0, s.length - 1) : word.slice(0, s.length + 1)));
      },
      del ? speed / 2 : speed,
    );
    return () => clearTimeout(t);
  }, [sub, del, i, words, speed, pause]);

  return (
    <span className="font-mono">
      <span className="text-gradient">{sub}</span>
      <span className="inline-block w-[2px] h-[1em] align-[-2px] ml-1 bg-[oklch(0.85_0.18_195)] animate-blink" />
    </span>
  );
}
