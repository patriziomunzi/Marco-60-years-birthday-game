import { useState, useEffect } from "react";

export default function BirthdayGame() {
  const [cakes, setCakes] = useState([]);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(0.2);
  const [playerPosition, setPlayerPosition] = useState(2);
  const [forks, setForks] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!gameOver) {
      initializeCakes();
      const gameInterval = setInterval(() => {
        moveCakes();
        moveForks();
        checkCollisions();
      }, 50);
      return () => clearInterval(gameInterval);
    }
  }, [cakes, forks, gameOver]);

  const initializeCakes = () => {
    if (cakes.length === 0) {
      let newCakes = [];
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 3; j++) {
          newCakes.push({ left: i * 20, top: j * 10 });
        }
      }
      setCakes(newCakes);
    }
  };

  const moveCakes = () => {
    setCakes((prevCakes) =>
      prevCakes.map((cake) => ({ ...cake, top: cake.top + speed }))
    );
    checkGameOver();
  };

  const moveForks = () => {
    setForks((prevForks) =>
      prevForks
        .map((fork) => ({ ...fork, top: fork.top - 8 })) // Faster forks
        .filter((fork) => fork.top > 0)
    );
  };

  const shootFork = () => {
    setForks((prevForks) => [...prevForks, { left: playerPosition * 20, top: 85 }]);
  };

  const checkCollisions = () => {
    setCakes((prevCakes) => {
      let hitCakes = 0;
      const remainingCakes = prevCakes.filter((cake) => {
        const isHit = forks.some(
          (fork) => cake.left === fork.left && Math.abs(cake.top - fork.top) < 5
        );
        if (isHit) hitCakes++;
        return !isHit;
      });
      if (hitCakes > 0) {
        setScore((prevScore) => prevScore + hitCakes);
      }
      return remainingCakes;
    });
  };

  const checkGameOver = () => {
    if (cakes.some((cake) => cake.top > 85)) {
      setGameOver(true);
    }
  };

  const movePlayer = (direction) => {
    setPlayerPosition((prev) => Math.max(0, Math.min(4, prev + direction)));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4 text-center">🎉 Happy Birthday Marco! 🎉</h1>
      <p className="mb-4 text-lg text-center">Shoot the falling cakes like a star shooter! 🎂</p>

      {/* Game Area */}
      <div className="relative w-80 h-80 bg-gray-800 border border-gray-600 rounded-lg overflow-hidden">
        {cakes.map((cake, index) => (
          <div
            key={index}
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

        {forks.map((fork, index) => (
          <div
            key={index}
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

        {/* Player (60-year-old man) */}
        <div
          className="absolute bottom-2 text-3xl"
          style={{
            left: `${playerPosition * 20}%`,
            transform: "translateX(-50%)",
          }}
        >
          👴
        </div>
      </div>

      {/* Controls */}
      {!gameOver ? (
        <div className="mt-4 flex gap-4">
          <button
            onClick={() => movePlayer(-1)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg text-lg"
          >
            ⬅️ Move Left
          </button>
          <button
            onClick={() => movePlayer(1)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg text-lg"
          >
            ➡️ Move Right
          </button>
          <button
            onClick={shootFork}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-lg"
          >
            🍴 Shoot Fork
          </button>
        </div>
      ) : (
        <h2 className="mt-4 text-2xl text-red-500">Game Over! 🎂</h2>
      )}

      {/* Score */}
      <p className="mt-4 text-xl font-bold">Score: {score}</p>

      {/* Footer */}
      <footer className="mt-6 text-gray-400 text-lg">
        Made with ❤️ by Patrizio, Lucia, and Gabriele, with a little help from ChatGPT.
      </footer>
    </div>
  );
}
