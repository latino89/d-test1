
import React, { useState, useEffect, useCallback, useRef } from 'react';

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 20;

const TETROMINOS = {
  I: { shape: [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]], color: '#FF007F' },
  J: { shape: [[1,0,0], [1,1,1], [0,0,0]], color: '#7B2CBF' },
  L: { shape: [[0,0,1], [1,1,1], [0,0,0]], color: '#C9184A' },
  O: { shape: [[1,1], [1,1]], color: '#FF70A6' },
  S: { shape: [[0,1,1], [1,1,0], [0,0,0]], color: '#9D4EDD' },
  T: { shape: [[0,1,0], [1,1,1], [0,0,0]], color: '#5A189A' },
  Z: { shape: [[1,1,0], [0,1,1], [0,0,0]], color: '#3C096C' },
};

const Tetris: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>(Array.from({ length: ROWS }, () => Array(COLS).fill('')));
  const [activePiece, setActivePiece] = useState({ pos: { x: 3, y: 0 }, shape: TETROMINOS.I.shape, color: TETROMINOS.I.color });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef<number>();

  const resetGame = () => {
    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill('')));
    setScore(0);
    setGameOver(false);
    spawnPiece();
  };

  const spawnPiece = useCallback(() => {
    const keys = Object.keys(TETROMINOS);
    const type = keys[Math.floor(Math.random() * keys.length)] as keyof typeof TETROMINOS;
    const piece = TETROMINOS[type];
    setActivePiece({ pos: { x: 3, y: 0 }, shape: piece.shape, color: piece.color });
  }, []);

  const collide = (x: number, y: number, shape: number[][]) => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const newX = x + c;
          const newY = y + r;
          if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && grid[newY][newX])) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const rotate = (matrix: number[][]) => {
    const rotated = matrix[0].map((_, index) => matrix.map(col => col[index]).reverse());
    return rotated;
  };

  const handleRotate = () => {
    const rotated = rotate(activePiece.shape);
    if (!collide(activePiece.pos.x, activePiece.pos.y, rotated)) {
      setActivePiece(prev => ({ ...prev, shape: rotated }));
    }
  };

  const move = (dx: number, dy: number) => {
    if (!collide(activePiece.pos.x + dx, activePiece.pos.y + dy, activePiece.shape)) {
      setActivePiece(prev => ({ ...prev, pos: { x: prev.pos.x + dx, y: prev.pos.y + dy } }));
      return true;
    }
    return false;
  };

  const lockPiece = useCallback(() => {
    const newGrid = [...grid.map(row => [...row])];
    activePiece.shape.forEach((row, r) => {
      row.forEach((value, c) => {
        if (value) {
          const y = activePiece.pos.y + r;
          const x = activePiece.pos.x + c;
          if (y >= 0) newGrid[y][x] = activePiece.color;
        }
      });
    });

    // Clear lines
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (newGrid[r].every(cell => cell !== '')) {
        newGrid.splice(r, 1);
        newGrid.unshift(Array(COLS).fill(''));
        cleared++;
        r++; // Check the new row at the same index
      }
    }

    if (cleared > 0) setScore(s => s + cleared * 100);
    setGrid(newGrid);
    
    if (activePiece.pos.y <= 0) {
      setGameOver(true);
    } else {
      spawnPiece();
    }
  }, [activePiece, grid, spawnPiece]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === 'ArrowLeft') move(-1, 0);
      if (e.key === 'ArrowRight') move(1, 0);
      if (e.key === 'ArrowDown') move(0, 1);
      if (e.key === 'ArrowUp') handleRotate();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePiece, gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      if (!move(0, 1)) {
        lockPiece();
      }
    }, 800);
    return () => clearInterval(interval);
  }, [activePiece, gameOver, lockPiece]);

  return (
    <div className="flex flex-col items-center bg-slate-900 p-4 rounded-xl border border-pink-500/30">
      <h3 className="text-xl font-bold mb-4 text-pink-500">ServiceTetris</h3>
      <div 
        className="relative bg-black border-2 border-slate-700"
        style={{ width: COLS * BLOCK_SIZE, height: ROWS * BLOCK_SIZE }}
      >
        {grid.map((row, r) => row.map((cell, c) => (
          cell && <div key={`${r}-${c}`} className="absolute border border-black/20" style={{ 
            width: BLOCK_SIZE, height: BLOCK_SIZE, 
            backgroundColor: cell, left: c * BLOCK_SIZE, top: r * BLOCK_SIZE 
          }} />
        )))}
        {activePiece.shape.map((row, r) => row.map((value, c) => (
          value && <div key={`active-${r}-${c}`} className="absolute border border-black/20" style={{ 
            width: BLOCK_SIZE, height: BLOCK_SIZE, 
            backgroundColor: activePiece.color, 
            left: (activePiece.pos.x + c) * BLOCK_SIZE, 
            top: (activePiece.pos.y + r) * BLOCK_SIZE 
          }} />
        )))}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
            <p className="text-white font-bold text-xl">Game Over</p>
            <button onClick={resetGame} className="mt-2 bg-pink-600 px-4 py-2 rounded text-sm">Prøv igjen</button>
          </div>
        )}
      </div>
      <div className="mt-4 text-center">
        <p className="text-slate-400">Score: <span className="text-pink-400 font-bold">{score}</span></p>
        <div className="grid grid-cols-2 gap-2 mt-4 md:hidden">
           <button onClick={() => move(-1,0)} className="bg-slate-800 p-4 rounded">⬅️</button>
           <button onClick={() => move(1,0)} className="bg-slate-800 p-4 rounded">➡️</button>
           <button onClick={() => move(0,1)} className="bg-slate-800 p-4 rounded">⬇️</button>
           <button onClick={handleRotate} className="bg-slate-800 p-4 rounded">🔄</button>
        </div>
      </div>
    </div>
  );
};

export default Tetris;
