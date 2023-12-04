import React, { useState, useEffect, useRef } from 'react';

const TrexGame = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [position, setPosition] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState([{ id: 1, position: 500 }]);
  const [obstacles1, setObstacles1] = useState([{ id: 2, position: 800 }]);
  const [gameOver, setGameOver] = useState(false);
  const trexRef = useRef(null);

  useEffect(() => {
    if (isRunning && !gameOver) {
      const gameInterval = setInterval(() => {
        moveObstacles();
        checkCollision();
      }, 30);

      return () => {
        clearInterval(gameInterval);
      };
    }
  }, [isRunning, gameOver]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        if (!isJumping && !gameOver) {
          setIsJumping(true);
          jump();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isJumping, gameOver]);

  const jump = () => {
    let count = 0;
    const jumpInterval = setInterval(() => {
      const gravity = 0.5;
      const jumpStrength = 10;

      let position = (jumpStrength * count) - (0.5 * gravity * count * count);

      if (position < 0) {
        position = 0;
        setIsJumping(false);
        clearInterval(jumpInterval);
      }

      setPosition(position);
      count++;
    }, 30);
  };

  const moveObstacles = () => {
    if (!gameOver) {
      setObstacles((prevObstacles) => {
        const updatedObstacles = prevObstacles.map((obstacle) => {
          let newPosition = obstacle.position - 5;
          if (newPosition < -50) {
            newPosition = 500;
          }
          return { ...obstacle, position: newPosition };
        });
        return updatedObstacles;
      });

      setObstacles1((prevObstacles1) => {
        const updatedObstacles1 = prevObstacles1.map((obstacle1) => {
          let newPosition1 = obstacle1.position - 5;
          if (newPosition1 < -80) {
            newPosition1 = 800;
          }
          return { ...obstacle1, position: newPosition1 };
        });
        return updatedObstacles1;
      });
    }
  };

  const checkCollision = () => {
    const trex = trexRef.current.getBoundingClientRect();
    obstacles.forEach((obstacle) => {
      const obstacleRect = document.getElementById(`obstacle_${obstacle.id}`).getBoundingClientRect();

      if (
        trex.bottom >= obstacleRect.top &&
        trex.right >= obstacleRect.left &&
        trex.left <= obstacleRect.right
      ) {
        setGameOver(true);
      }
    });

    obstacles1.forEach((obstacle1) => {
      const obstacleRect = document.getElementById(`obstacle_${obstacle1.id}`).getBoundingClientRect();

      if (
        trex.bottom >= obstacleRect.top &&
        trex.right >= obstacleRect.left &&
        trex.left <= obstacleRect.right &&
        trex.top <= obstacleRect.bottom // Menambahkan kondisi ini
      ) {
        setGameOver(true);
      }
    });
  };

  const startGame = () => {
    setIsRunning(true);
  };

  return (
    <div className='bungkus'>
      <h1>T-Rex Game</h1>
      {!isRunning ? (
        <button onClick={startGame}>Start Game</button>
      ) : (
        <div style={{ position: 'relative', width: '500px', height: '150px', border: '1px solid black', overflow: 'hidden' }}>
          <div
            ref={trexRef}
            style={{
              position: 'absolute',
              width: '50px',
              height: '50px',
            //   backgroundColor: 'green',
              bottom: `${position}px`,
            }}
          >
            <img src="./trex.png" alt="T-Rex" style={{ width: '100%', height: '100%' }} />
          </div>
          {obstacles.map((obstacle) => (
            <div
              key={obstacle.id}
              id={`obstacle_${obstacle.id}`}
              style={{
                position: 'absolute',
                width: '20px',
                height: '40px',
                // backgroundColor: 'red',
                bottom: '0px',
                left: `${obstacle.position}px`,
              }}
            >
                <img src="./kkts.png" alt="T-Rex" style={{ width: '100%', height: '100%' }} />
            </div>
          ))}
          {obstacles1.map((obstacle) => (
            <div
              key={obstacle.id}
              id={`obstacle_${obstacle.id}`}
              style={{
                position: 'absolute',
                width: '20px',
                height: '30px',
                // backgroundColor: 'red',
                top: '0px',
                left: `${obstacle.position}px`,
              }}
            >
                <img src="./brng.png" alt="T-Rex" style={{ width: '100%', height: '100%' }} />
            </div>
          ))}
        </div>
      )}
      {gameOver && <p>Game Over!</p>}
    </div>
  );
};

export default TrexGame;
