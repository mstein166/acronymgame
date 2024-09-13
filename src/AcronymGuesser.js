import React, { useState, useEffect } from 'react';
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert"

const AcronymGuesser = () => {
  const [acronym, setAcronym] = useState('');
  const [answer, setAnswer] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');

  const acronyms = [
    { acronym: 'NASA', words: ['National', 'Aeronautics', 'and', 'Space', 'Administration'] },
    { acronym: 'ASAP', words: ['As', 'Soon', 'As', 'Possible'] },
    { acronym: 'LASER', words: ['Light', 'Amplification', 'by', 'Stimulated', 'Emission', 'of', 'Radiation'] },
    // ... (add all other acronyms here)
  ];

  useEffect(() => {
    newGame();
  }, []);

  const newGame = () => {
    const randomAcronym = acronyms[Math.floor(Math.random() * acronyms.length)];
    setAcronym(randomAcronym.acronym);
    setAnswer(randomAcronym.words);
    setGuesses([]);
    setFeedback([]);
    setGameOver(false);
    setMessage('');
  };

  const handleGuess = () => {
    if (guesses.length >= 5 || gameOver) return;

    const guessWords = currentGuess.split(' ');
    const newFeedback = guessWords.map((word, index) => {
      if (word.toLowerCase() === answer[index]?.toLowerCase()) {
        return 'correct';
      } else if (answer.some(answerWord => answerWord.toLowerCase() === word.toLowerCase())) {
        return 'wrong-position';
      } else {
        return 'incorrect';
      }
    });

    setGuesses([...guesses, currentGuess]);
    setFeedback([...feedback, newFeedback]);
    setCurrentGuess('');

    if (newFeedback.every(fb => fb === 'correct')) {
      setGameOver(true);
      setMessage('Congratulations! You guessed the acronym correctly!');
    } else if (guesses.length === 4) {
      setGameOver(true);
      setMessage(`Game over! The correct answer was: ${answer.join(' ')}`);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Acronym Guesser</h1>
      <p className="mb-2">Guess the meaning of: <strong>{acronym}</strong></p>
      <p className="mb-4">You have 5 guesses total. Good luck!</p>
      
      {guesses.map((guess, index) => (
        <div key={index} className="mb-2">
          <p className="font-bold">Guess {index + 1}:</p>
          <p>
            {guess.split(' ').map((word, wordIndex) => (
              <span key={wordIndex} className={
                feedback[index][wordIndex] === 'correct' ? 'text-green-500 font-bold' :
                feedback[index][wordIndex] === 'wrong-position' ? 'text-yellow-500 font-bold' :
                ''
              }>
                {word}{' '}
              </span>
            ))}
          </p>
        </div>
      ))}

      {!gameOver && (
        <div className="mb-4">
          <Input
            type="text"
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value)}
            placeholder={`Enter guess ${guesses.length + 1} of 5`}
            className="mb-2"
          />
          <Button onClick={handleGuess} disabled={!currentGuess}>Submit Guess</Button>
        </div>
      )}

      {message && (
        <Alert className="mb-4">
          <AlertTitle>Game Result</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Button onClick={newGame}>New Game</Button>
    </div>
  );
};

export default AcronymGuesser;
