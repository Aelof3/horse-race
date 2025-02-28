import { useState, useEffect } from 'react'
import './App.css'
import horseImage from './assets/horse.png'
import racetrackImage from './assets/racetrack.jpg'

// Game states
type GameState = 'menu' | 'game' | 'paused' | 'winner';

// Horse colors
const HORSE_COLORS = [
  '#FF5733', // Red
  '#33FF57', // Green
  '#3357FF', // Blue
  '#F3FF33', // Yellow
  '#FF33F3', // Pink
  '#33FFF3'  // Cyan
];

// Bet amounts
const BET_AMOUNTS = [10, 50, 100];

function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedHorse, setSelectedHorse] = useState<number | null>(null);
  const [winnerHorse, setWinnerHorse] = useState<number | null>(null);
  const [horses, setHorses] = useState<number[]>([0, 0, 0, 0, 0, 0]); // Position of each horse (0-100%)
  const [raceInterval, setRaceInterval] = useState<number | null>(null);
  const [balance, setBalance] = useState<number>(100); // Player's coin balance
  const [betAmount, setBetAmount] = useState<number>(10); // Default bet amount
  const [winnings, setWinnings] = useState<number | null>(null); // Amount won in the current race

  // Load balance from localStorage on initial render
  useEffect(() => {
    const savedBalance = localStorage.getItem('horseRaceBalance');
    if (savedBalance) {
      setBalance(parseInt(savedBalance));
    }
  }, []);

  // Save balance to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('horseRaceBalance', balance.toString());
  }, [balance]);

  // Start the race
  const startRace = () => {
    if (selectedHorse === null) return;
    
    // Deduct bet amount from balance
    setBalance(prevBalance => prevBalance - betAmount);
    
    setGameState('game');
    setHorses([0, 0, 0, 0, 0, 0]);
    setWinnerHorse(null);
    setWinnings(null);
    
    // Clear any existing interval
    if (raceInterval) {
      clearInterval(raceInterval);
    }
    
    // Set up the race interval
    const interval = setInterval(() => {
      setHorses(prevHorses => {
        const newHorses = [...prevHorses];
        let hasWinner = false;
        
        // Move each horse by a random amount
        for (let i = 0; i < newHorses.length; i++) {
          // Random speed between 0.5 and 2
          const speed = 0.5 + Math.random() * 1.5;
          newHorses[i] += speed;
          
          // Check if this horse has won
          if (newHorses[i] >= 100 && !hasWinner) {
            hasWinner = true;
            setWinnerHorse(i);
            setGameState('winner');
            clearInterval(interval);
            
            // Calculate winnings if the player's horse won (1/5 odds)
            if (i === selectedHorse) {
              const winAmount = betAmount * 6; // 5x profit + original bet
              setWinnings(winAmount);
              setBalance(prevBalance => prevBalance + winAmount);
            }
          }
        }
        
        return newHorses;
      });
    }, 50);
    
    setRaceInterval(interval as unknown as number);
  };

  // Pause the game
  const pauseGame = () => {
    if (gameState === 'game') {
      setGameState('paused');
      if (raceInterval) {
        clearInterval(raceInterval);
        setRaceInterval(null);
      }
    }
  };

  // Resume the game
  const resumeGame = () => {
    if (gameState === 'paused') {
      setGameState('game');
      startRace();
    }
  };

  // Return to menu
  const returnToMenu = () => {
    if (raceInterval) {
      clearInterval(raceInterval);
      setRaceInterval(null);
    }
    setGameState('menu');
    setSelectedHorse(null);
  };

  // Reset balance to 100
  const resetBalance = () => {
    setBalance(100);
  };

  // Change bet amount
  const changeBetAmount = (amount: number) => {
    if (amount <= balance) {
      setBetAmount(amount);
    }
  };

  // Render different screens based on game state
  const renderScreen = () => {
    switch (gameState) {
      case 'menu':
        return (
          <div className="menu-screen">
            <h1>Horse Racing Game</h1>
            <div className="balance-display">
              <h2>Your Balance: {balance} coins</h2>
              <button className="reset-button" onClick={resetBalance}>Reset Balance</button>
            </div>
            <div className="horse-selection">
              <h2>Select your horse:</h2>
              <div className="horses-grid">
                {HORSE_COLORS.map((color, index) => (
                  <div 
                    key={index}
                    className={`horse-option ${selectedHorse === index ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedHorse(index)}
                  >
                    <img src={horseImage} alt={`Horse ${index + 1}`} />
                    <span>Horse {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="betting-section">
              <h3>Place your bet:</h3>
              <div className="bet-amounts">
                {BET_AMOUNTS.map(amount => (
                  <button 
                    key={amount}
                    className={`bet-button ${betAmount === amount ? 'selected' : ''}`}
                    onClick={() => changeBetAmount(amount)}
                    disabled={amount > balance}
                  >
                    {amount} coins
                  </button>
                ))}
              </div>
              <p className="odds-info">Odds: 5 to 1 (Win 6x your bet)</p>
            </div>
            <button 
              className="start-button" 
              onClick={startRace}
              disabled={selectedHorse === null || balance < betAmount}
            >
              Start Race
            </button>
            {balance < 10 && (
              <p className="warning-message">Not enough coins to bet! Reset your balance.</p>
            )}
          </div>
        );
      
      case 'game':
        return (
          <div className="game-screen">
            <div className="race-track" style={{ backgroundImage: `url(${racetrackImage})` }}>
              {horses.map((position, index) => (
                <div 
                  key={index}
                  className="horse"
                  style={{ 
                    backgroundColor: HORSE_COLORS[index],
                    left: `${position}%`,
                    top: `${10 + index * 15}%`
                  }}
                >
                  <img src={horseImage} alt={`Horse ${index + 1}`} />
                </div>
              ))}
            </div>
            <div className="game-info">
              <div className="balance-display">
                <span>Balance: {balance} coins</span>
                <span>Bet: {betAmount} coins on Horse {selectedHorse !== null ? selectedHorse + 1 : ''}</span>
              </div>
              <button className="pause-button" onClick={pauseGame}>Pause</button>
            </div>
          </div>
        );
      
      case 'paused':
        return (
          <div className="pause-screen">
            <div className="pause-menu">
              <h2>Game Paused</h2>
              <div className="balance-display">
                <p>Balance: {balance} coins</p>
                <p>Bet: {betAmount} coins on Horse {selectedHorse !== null ? selectedHorse + 1 : ''}</p>
              </div>
              <button onClick={resumeGame}>Resume</button>
              <button onClick={returnToMenu}>Exit to Menu</button>
            </div>
            <div className="race-track blurred" style={{ backgroundImage: `url(${racetrackImage})` }}>
              {horses.map((position, index) => (
                <div 
                  key={index}
                  className="horse"
                  style={{ 
                    backgroundColor: HORSE_COLORS[index],
                    left: `${position}%`,
                    top: `${10 + index * 15}%`
                  }}
                >
                  <img src={horseImage} alt={`Horse ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'winner':
        return (
          <div className="winner-screen">
            <h1>Winner!</h1>
            {winnerHorse !== null && (
              <div className="winner-horse" style={{ backgroundColor: HORSE_COLORS[winnerHorse] }}>
                <img src={horseImage} alt={`Horse ${winnerHorse + 1}`} />
                <h2>Horse {winnerHorse + 1}</h2>
              </div>
            )}
            {selectedHorse !== null && winnerHorse !== null && (
              <div className="result-message">
                <h3>
                  {selectedHorse === winnerHorse 
                    ? `Congratulations! Your horse won! You won ${winnings} coins!` 
                    : `Better luck next time! You lost ${betAmount} coins.`}
                </h3>
                <div className="balance-display">
                  <h3>Your Balance: {balance} coins</h3>
                </div>
              </div>
            )}
            <button onClick={returnToMenu}>Return to Menu</button>
          </div>
        );
    }
  };

  return (
    <div className="app">
      {renderScreen()}
    </div>
  );
}

export default App
