import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { Piece, PieceProps } from "@chessire/pieces";
import { useState } from "react";
import { MOVE } from "../configs/messages";

export function Chessboard({
  chess,
  board,
  playerColor,
  socket,
}: {
  chess: Chess;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  playerColor: Color;
  socket: WebSocket;
}) {
  const [from, setFrom] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);

  const handleSquareClick = (square: Square) => {
    if (chess.turn() !== playerColor[0]) return;

    if (!from) {
      console.log("inside if");
      setFrom(square);
      const moves = chess.moves({
        square: square,
        verbose: true,
      });
      setPossibleMoves(moves.map((move) => move.to as Square));
      console.log("From", square);
    } else {
      // setTo(square?.square ?? null);
      console.log("To", square);
      const payload = JSON.stringify({
        type: MOVE,
        move: {
          from: from,
          to: square,
        },
      });
      console.log("Payload", payload);
      socket.send(
        JSON.stringify({
          type: MOVE,
          move: {
            from: from,
            to: square,
          },
        })
      );

      setFrom(null);
      setPossibleMoves([]);
    }
  };

  return (
    <div>
      {board.map((row, i) => {
        return (
          <div key={i} className="flex">
            {row.map((square, j) => {
              const squareRepresentation = // TODO: Check this ASAP!
                playerColor === "w"
                  ? ((String.fromCharCode(97 + (j % 8)) +
                      String(8 - i)) as Square)
                  : ((String.fromCharCode(97 + (7 - (j % 8))) +
                      String(i + 1)) as Square);

              const isPossibleMove =
                possibleMoves.includes(squareRepresentation);
              return (
                <div
                  key={j}
                  className={`w-20 h-20 ${
                    (i + j) % 2 ? "bg-green-800" : "bg-green-200"
                  }`}
                >
                  {playerColor === "w" && (
                    <div
                      className={`text-s font-bold pl-[0.5px] absolute ${
                        i % 2 === 0 ? "text-green-800" : "text-green-200"
                      }`}
                    >
                      {j === 0 ? 8 - i : ""}
                    </div>
                  )}

                  {playerColor === "b" && (
                    <div
                      className={`text-s font-bold pl-[0.5px] absolute ${
                        i % 2 === 0 ? "text-green-800" : "text-green-200"
                      }`}
                    >
                      {j === 0 ? i + 1 : ""}
                    </div>
                  )}
                  <div
                    className="flex justify-center items-center h-20"
                    onClick={() => handleSquareClick(squareRepresentation)}
                  >
                    {square ? (
                      // @ts-ignore
                      <Piece
                        color={square.color === "w" ? "white" : "black"}
                        piece={square.type.toUpperCase() as PieceProps["piece"]}
                        width={72}
                      />
                    ) : isPossibleMove === true ? (
                      <div className="w-4 h-4 bg-black rounded-full opacity-30" />
                    ) : (
                      ""
                    )}
                  </div>
                  {playerColor === "w" && (
                    <div className="text-s font-bold pl-1">
                      {i === 7 ? String.fromCharCode(97 + j) : ""}
                    </div>
                  )}

                  {playerColor === "b" && (
                    <div className="text-s font-bold pl-1">
                      {i === 7 ? String.fromCharCode(104 - j) : ""}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
