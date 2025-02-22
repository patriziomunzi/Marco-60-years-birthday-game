import { useState, useEffect } from "react";
import Head from "next/head";

export default function BirthdayGame() {
  const [cakes, setCakes] = useState([]);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(0.5);
  const [playerPosition, setPlayerPosition] = useState(3);
  const [forks, setForks] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!gameOver) {
      initializeCakes();
    }
  }, [gameOver]);

  useEffect(() => {
    if (!gameOver) {
      const gameInterval = setInterval(() => {
        setCakes((prevCakes) =>
          prevCakes.map((cake) => ({ ...cake, top: cake.top + speed }))
        );
        setForks((prevForks) =>
          prevForks.map((fork) => ({ ...fork, top: fork.top - 10 })).filter((fork) => fork.top > 0)
        );
        checkCollisions();
        checkGameOver();
      }, 100);
      return () => clearInterval(gameInterval);
    }
  }, [gameOver, cakes, forks]);

  const initializeCakes = () => {
    let newCakes = [];
    let rows = 3;
    let cols = 6;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        newCakes.push({ left: col * 16 + 8, top: row * 12, id: `${row}-${col}` });
      }
    }
    setCakes(newCakes);
  };

  const shootFork = () => {
    setForks((prevForks) => [...prevForks, { left: playerPosition * 16 + 8, top: 85, id: Date.now() }]);
  };

  const checkCollisions = () => {
    setCakes((prevCakes) => {
      let remainingCakes = prevCakes.filter((cake) => {
        let hitIndex = forks.findIndex(
          (fork) => Math.abs(cake.left - fork.left) < 8 && Math.abs(cake.top - fork.top) < 8
        );
        if (hitIndex !== -1) {
          setForks((prevForks) => prevForks.filter((_, i) => i !== hitIndex));
          setScore((prevScore) => prevScore + 1);
          return false;
        }
        return true;
      });
      if (remainingCakes.length === 0) {
        initializeCakes();
        setSpeed((prevSpeed) => prevSpeed + 0.2);
      }
      return remainingCakes;
    });
  };

  const checkGameOver = () => {
    if (cakes.some((cake) => cake.top > 95)) {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    setSpeed(0.5);
    initializeCakes();
    setForks([]);
  };

  const movePlayer = (direction) => {
    setPlayerPosition((prev) => Math.max(0, Math.min(5, prev + direction)));
  };

  return (
    <Head>
      <link rel="icon" href="/cake-favicon.png" type="image/png" />
    </Head>

    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black text-white relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1520034475321-cbe63696469a?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <h1 className="text-2xl font-bold mb-4 text-center">🎉 Happy Birthday Marco! 🎉</h1>
      <p className="mb-4 text-lg text-center">Shoot the falling cakes like a star shooter! 🎂</p>

      <div className="relative w-80 h-80 border border-white rounded-lg overflow-hidden">
        {cakes.map((cake) => (
          <div
            key={cake.id}
            className="absolute text-2xl transition-all duration-200"
            style={{
              top: `${cake.top}%`,
              left: `${cake.left}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            🍰
          </div>
        ))}

        {forks.map((fork) => (
          <div
            key={fork.id}
            className="absolute text-xl transition-all duration-200"
            style={{
              top: `${fork.top}%`,
              left: `${fork.left}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            🍴
          </div>
        ))}

        <div
          className="absolute bottom-2 text-3xl"
          style={{
            left: `${playerPosition * 16 + 8}%`,
            transform: "translateX(-50%)",
          }}
        >
          👴
        </div>
      </div>

      {!gameOver ? (
        <div className="mt-4 flex gap-4">
          <button onClick={() => movePlayer(-1)} className="bg-gray-700 text-white px-3 py-1 rounded-lg">⬅️ Left</button>
          <button onClick={() => movePlayer(1)} className="bg-gray-700 text-white px-3 py-1 rounded-lg">➡️ Right</button>
          <button onClick={shootFork} className="bg-red-500 text-white px-3 py-1 rounded-lg">🍴 Shoot</button>
        </div>
      ) : (
        <div className="mt-4 text-center">
          <h2 className="text-2xl text-red-500">Burp! 🎂</h2>
          <button onClick={restartGame} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg text-lg">Restart</button>
        </div>
      )}

      <p className="mt-4 text-xl font-bold">Score: {score}</p>

      <footer className="mt-6 text-gray-400 text-center">Made with ❤️ by Patrizio, Lucia, and Gabriele, with a little help from ChatGPT.</footer>
    </div>
  );
}
