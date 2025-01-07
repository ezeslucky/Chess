import { useNavigate } from "react-router-dom";

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen bg-gradient-to-bl from-slate-900 to-black text-white">
      <div className="flex justify-center items-center h-full">
        <div className="flex justify-around items-center gap-28">
          <img src="/chessboard.png" alt="Chess Board" className="h-[90vh]" />
          <div className="flex flex-col items-center justify-center gap-5 h-full">
            <div className="text-4xl">Hello, Welcome to AnonChess</div>
            <button
              className="bg-green-700 p-2 rounded-md"
              onClick={() => navigate("/game")}
            >
              Play Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
