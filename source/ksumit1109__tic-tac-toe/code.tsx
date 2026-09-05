import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);

    const result = calculateWinner(newBoard);
    if (result) {
      setGameOver(true);
    } else if (newBoard.every(cell => cell !== null)) {
      setGameOver(true);
    } else {
      setIsXNext(!isXNext);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
  };

  const result = calculateWinner(board);
  const winner = result?.winner;
  const winningLine = result?.line || [];
  const isDraw = gameOver && !winner;

  const getStatus = () => {
    if (winner) {
      return `Winner: ${winner}`;
    } else if (isDraw) {
      return "Draw!";
    } else {
      return `Next player: ${isXNext ? "X" : "O"}`;
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen bg-background p-4")}>
      <div className="flex flex-col items-center gap-6 max-w-md w-full">
        <h1 className="text-4xl font-bold text-foreground">Tic-Tac-Toe</h1>
        
        <div className={cn(
          "text-2xl font-semibold px-6 py-3 rounded-lg",
          winner ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          {getStatus()}
        </div>

        <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={cn(
                "aspect-square text-5xl font-bold rounded-lg transition-all",
                "border-2 border-border hover:border-primary",
                "bg-card text-card-foreground",
                "disabled:cursor-not-allowed",
                winningLine.includes(index) && "bg-primary/20 border-primary",
                !cell && !gameOver && "hover:bg-accent hover:scale-105 active:scale-95"
              )}
              disabled={!!cell || gameOver}
            >
              <span className={cn(
                cell === "X" ? "text-chart-1" : "text-chart-2"
              )}>
                {cell}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={resetGame}
          className={cn(
            "px-8 py-3 text-lg font-semibold rounded-lg",
            "bg-secondary text-secondary-foreground",
            "hover:bg-secondary/80 transition-colors",
            "active:scale-95"
          )}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};