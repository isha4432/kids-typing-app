import { useState, useEffect, useRef } from "react";

const levelWords = {
  1: ["cat", "dog", "sun", "hat",'manoj'],
  2: ["apple", "tiger", "rocket", "flower"],
  3: ["elephant", "superhero", "butterfly"]

};

export default function App() {
  const [screen, setScreen] = useState("levels");
  const [level, setLevel] = useState(1);

  if (screen === "levels")
    return (
      <LevelScreen
        onSelect={(lvl) => {
          setLevel(lvl);
          setScreen("game");
        }}
      />
    );

  if (screen === "game")
    return (
      <GameScreen
        words={levelWords[level]}
        onHome={() => setScreen("levels")}
      />
    );
}

/* 🎮 LEVEL SCREEN */
function LevelScreen({ onSelect }) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-400 via-yellow-300 to-blue-400 flex flex-col items-center justify-center text-center p-6">

      <h1 className="text-5xl font-bold mb-10 text-white">
        🎮 Choose Level
      </h1>

      <div className="flex gap-6 flex-wrap justify-center">

        <button onClick={() => onSelect(1)}
          className="bg-green-500 text-white px-10 py-6 rounded-3xl text-2xl font-bold shadow-xl hover:scale-110 transition">
          🟢 Easy
        </button>

        <button onClick={() => onSelect(2)}
          className="bg-yellow-500 text-white px-10 py-6 rounded-3xl text-2xl font-bold shadow-xl hover:scale-110 transition">
          🟡 Medium
        </button>

        <button onClick={() => onSelect(3)}
          className="bg-red-500 text-white px-10 py-6 rounded-3xl text-2xl font-bold shadow-xl hover:scale-110 transition">
          🔴 Hard
        </button>

      </div>
    </div>
  );
}

/* ⌨️ GAME SCREEN */

function GameScreen({ words, onHome }) {
  const correctSound = useRef(new Audio("/sounds/ding.mp3"));
  const wrongSound = useRef(new Audio("/sounds/wrong.mp3"));
  const gameOverSound = useRef(new Audio("/sounds/gameover.mp3"));

  const [currentWord, setCurrentWord] = useState(words[0]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  /* ⏱️ TIMER */
  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver]);
  useEffect(() => {
  if (gameOver) {
    gameOverSound.current.play();
  }
}, [gameOver]);

  function nextWord() {
    return words[Math.floor(Math.random() * words.length)];
  }

function handleChange(e) {
  if (gameOver) return;

  const value = e.target.value;
  setInput(value);

  // ⭐ Correct word
  if (value === currentWord) {
    correctSound.current.play();

    setScore((s) => s + 1);
    setCurrentWord(nextWord());
    setInput("");
  }

  // ❌ Wrong full word
  else if (value.length >= currentWord.length) {

    wrongSound.current.play();

    setLives((l) => {
      const newLives = l - 1;
      if (newLives <= 0) setGameOver(true);
      return newLives;
    });

    setInput("");
    setCurrentWord(nextWord());
  }
}


  function handleSubmit() {
    if (input !== currentWord) {
      setLives((l) => {
        const newLives = l - 1;
        if (newLives <= 0) setGameOver(true);
        return newLives;
      });
      setInput("");
      setCurrentWord(nextWord());
    }
  }

  /* 💀 GAME OVER SCREEN */
  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-500 to-blue-600 flex flex-col items-center justify-center text-white text-center p-6">

        <h1 className="text-5xl font-bold mb-6">💀 Game Over</h1>
        <h2 className="text-3xl mb-6">⭐ Score: {score}</h2>

        <div className="flex gap-6">

          <button
            onClick={() => window.location.reload()}
            className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold"
          >
            🔄 Play Again
          </button>

          <button
            onClick={onHome}
            className="bg-white text-black px-6 py-3 rounded-xl font-bold"
          >
            🏠 Home
          </button>

        </div>
      </div>
    );
  }

  /* 🎯 GAME UI */
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-purple-500 flex flex-col items-center justify-center text-white text-center p-6">

      {/* TOP BAR */}
      <div className="absolute top-5 left-5 text-xl">⏱️ {time}</div>
      <div className="absolute top-5 right-5 text-xl">❤️ {lives}</div>

      <button
        onClick={onHome}
        className="absolute top-5 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-xl font-bold"
      >
        🏠 Home
      </button>

      <h1 className="text-4xl mb-4">⌨️ Type the Word</h1>
      <img
      src="/images/hero.png"
      alt="hero"
      className="w-40 mb-4"
     />


      <h2 className="text-6xl font-bold mb-6 text-yellow-300">
        {currentWord}
      </h2>

      <input
        value={input}
        onChange={handleChange}
        className="text-2xl p-4 rounded-xl text-black text-center"
        autoFocus
      />

      <button
        onClick={handleSubmit}
        className="mt-4 bg-green-400 text-black px-6 py-2 rounded-xl font-bold"
      >
        Submit
      </button>

      <h3 className="text-2xl mt-6">⭐ Score: {score}</h3>
    </div>
  );
}
