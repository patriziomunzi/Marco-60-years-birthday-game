import { useState, useEffect } from "react";

export default function BirthdayGame() {
  const [cakes, setCakes] = useState([]);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(2);
  const [playerPosition, setPlayerPosition] = useState(50);
  const [isShooting, setIsShooting] = useState(false);

  useEffect(() => {
    const gameInterval = setInterval(() => {
      updateCakes();
      increaseDifficulty();
    }, 50);

    return () => clearInterval(gameInterval);
  }, [cakes]);

  const updateCakes = () => {
    setCakes((prevCakes) =>
      prevCakes
        .map((cake) => ({ ...cake, top: cake.top + speed }))
        .filter((cake) => cake.top < 100)
    );

    if (Math.random() < 0.1) {
      spawnCake();
    }
  };

  const spawnCake = () => {
    setCakes((prevCakes) => [...prevCakes, { left: Math.random() * 100, top: 0 }]);
  };

  const shootFork = () => {
    setIsShooting(true);
    setTimeout(() => setIsShooting(false), 500);

    setCakes((prevCakes) =>
      prevCakes.filter(
        (cake) => Math.abs(cake.left - playerPosition) > 5 || cake.top > 50
      )
    );

    setScore((prevScore) => prevScore + 1);
  };

  const increaseDifficulty = () => {
    if (score % 5 === 0 && score > 0) {
      setSpeed((prevSpeed) => prevSpeed + 0.5);
    }
  };

  const movePlayer = (direction) => {
    setPlayerPosition((prev) => Math.max(0, Math.min(100, prev + direction)));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative bg-blue-100">
      <h1 className="text-2xl font-bold mb-4">🎉 Happy Birthday Marco! 🎉</h1>
      <p className="mb-4">Shoot the falling cakes to celebrate Marco’s 60th birthday! 🎂</p>

      <div className="relative w-full h-60 bg-gray-200 border border-gray-400 rounded-lg overflow-hidden">
        {cakes.map((cake, index) => (
          <div
            key={index}
            className="absolute text-2xl"
            style={{
              top: `${cake.top}%`,
              left: `${cake.left}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            🍰
          </div>
        ))}

        <div
          className="absolute bottom-2 w-10 h-10"
          style={{
            left: `${playerPosition}%`,
            transform: "translateX(-50%)",
          }}
        >
          👴
        </div>

        {isShooting && (
          <div
            className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-xl"
            style={{ animation: "shooting-fork 0.5s" }}
          >
            🍴
          </div>
        )}
      </div>

      <div className="mt-4">
        <button onClick={() => movePlayer(-10)} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">⬅️ Move Left</button>
        <button onClick={() => movePlayer(10)} className="bg-gray-500 text-white px-4 py-2 rounded">➡️ Move Right</button>
        <button onClick={shootFork} className="bg-red-500 text-white px-4 py-2 rounded ml-4">🍴 Shoot Fork</button>
      </div>

      <p className="mt-4 text-lg font-bold">Score: {score}</p>

      <footer className="absolute bottom-4 text-center w-full text-gray-600 text-sm">
        <p>Made with ❤️ by Patrizio, Lucia, and Gabriele, with a little help from ChatGPT</p>
      </footer>
    </div>
  );
}
