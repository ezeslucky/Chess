import { useEffect, useState } from "react";
import { Chessboard } from "../components/Chessboard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";
import { INIT_GAME, MOVE, GAME_OVER } from "../configs/messages";
import { MoveHistory } from "../components/MoveHistory";

export function Game() {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [playerColor, setPlayerColor] = useState<"white" | "black">("white");
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          const color = message.payload.color;
          setPlayerColor(color);
          console.log("Color", color);
          console.log("Player Color", playerColor);
          setChess(new Chess());

          color === "black"
            ? setBoard(
                chess
                  .board()
                  .map((row) => row.reverse())
                  .reverse()
              )
            : setBoard(chess.board());
          console.log("Game Initialized");
          break;
        case MOVE:
          console.log("player color in move: ", playerColor);
          const move = message.payload;
          chess.move(move);
          playerColor === "black"
            ? setBoard(
                chess
                  .board()
                  .map((row) => row.reverse())
                  .reverse()
              )
            : setBoard(chess.board());
          chess.board();
          console.log("Move", message.payload);
          break;
        case GAME_OVER:
          console.log("Game Over", message.payload);
          break;
        default:
          break;
      }
    };
  }, [socket, playerColor, chess]);

  if (!socket) return <div>Connecting...</div>;

  return (
    <div className="flex justify-center">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4 w-full">
          <div className="col-span-4 w-full flex items-center">
            <Chessboard
              chess={chess}
              socket={socket}
              board={board}
              playerColor={playerColor[0] as "w" | "b"}
            />
          </div>
          <div className="col-span-2 w-full">
            <button
              className="bg-green-500 hover:bg-green-700 transition-all w-full p-2 rounded-md"
              onClick={() => {
                setGameStarted(true);
                socket.send(
                  JSON.stringify({
                    type: INIT_GAME,
                  })
                );

                setChess(new Chess());
              }}
            >
              {gameStarted ? "Leave & Start New Game" : "Start Game"}
            </button>

            {/* Instructions */}
            <div className="mt-4">
              <div className="text-xl font-bold">Instructions</div>
              <ul className="list-disc list-inside">
                <li>Click on a piece to select it</li>
                <li>Click on a valid square to move the piece</li>
                <li>Click on the same piece to deselect it</li>
              </ul>
            </div>

            <hr className="mt-5" />

            {/* Display Game Status */}
            <div className="my-4">
              <div className="text-xl font-bold">Game Status</div>
              <div>
                {chess.isCheckmate()
                  ? `Checkmate: ${
                      chess.turn() === "w" ? "Black" : "White"
                    } Wins!`
                  : chess.isCheck()
                  ? `Check to ${chess.turn() === "w" ? "White" : "Black"}`
                  : chess.isStalemate()
                  ? "Stalemate"
                  : chess.isDraw()
                  ? "Draw"
                  : "In Progress"}
              </div>
            </div>

            <MoveHistory chess={chess} />
          </div>
        </div>
      </div>
    </div>
  );
}
