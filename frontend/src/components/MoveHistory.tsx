import { Chess } from "chess.js";
import { useEffect, useRef, useState } from "react";

export function MoveHistory({ chess }: { chess: Chess }) {
  const [moves, setMoves] = useState<string[]>(chess.history());
  const scrollRef = useRef<HTMLDivElement>(null);
  const updateMoves = () => setMoves(chess.history());

  useEffect(() => {
    updateMoves();
  }, [chess.history().length]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [moves]);

  if (moves.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-bold mb-2">Move History</h2>
        <div>No moves</div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-lg font-bold mb-2 col-span-3">Move History</div>
      <div className="max-h-96 overflow-y-auto" ref={scrollRef}>
        {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, i) => (
          <div key={i} className="grid grid-cols-6 text-s">
            <div className="col-span-1">{i + 1}.</div>
            <div className="col-span-2">{moves[i * 2] || ""}</div>
            <div className="col-span-2">{moves[i * 2 + 1] || ""}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
