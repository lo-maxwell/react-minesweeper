'use client'
// Allows useState and onClick, which are client side hooks

import React, { useEffect, useState } from 'react';

type SquareType = [string, boolean, number]
type OnSquareClickHandler = () => void;
type OnSquareRightClickHandler = (e: React.SyntheticEvent) => void;

const DEFAULT_BOARD_SIZE = 10;

function Square({ state, isBomb, value, onSquareLeftClick, onSquareRightClick}: {state: string, isBomb: boolean, value: number, onSquareLeftClick: OnSquareClickHandler, onSquareRightClick: OnSquareRightClickHandler}) {
  if (state === "Hidden") {
    return (<button className="square-hidden" onClick={onSquareLeftClick} onContextMenu={onSquareRightClick}></button>);
  } else if (state === "Flagged") {
    return (<button className="square-flag" onClick={onSquareLeftClick} onContextMenu={onSquareRightClick}>Flag</button>);
  }
  if (isBomb) {
    return (<button className="square-bomb"> Boom </button>);
  } else {
    if (value === 0) {
      return (<button className="square-revealed"></button>);
    } else {
      return (<button className="square-revealed"> {value} </button>);
    }
  }
}

function Board({width, height, numBombs, squares, handleLeftClick, handleRightClick}: {width: number, height: number, numBombs: number, squares: Array<Array<SquareType>>, handleLeftClick: Function, handleRightClick: Function}) {
  // const [width, setWidth] = useState(10);
  // const [height, setHeight] = useState(10);
  // const [numBombs, setNumBombs] = useState(20);

  
  
  // console.log(initialSquares)
  // const [squares, setSquares] = useState<Array<Array<SquareType>>>(generateBombs(initialSquares, numBombs));

  // useEffect(() => {
  //   setSquares(generateBombs(initialSquares, numBombs));
  // }, []);

  const rows = Array.from({length: height}, (_, index) => index);
  const cols = Array.from({length: width}, (_, index) => index);

  function renderBoard() {
    return (
      <>
      {rows.map((row) => (
        <div className="board-row" key={row}>
          {cols.map((col) => {
            const index = row * width + col;
            return (<Square 
              key = {index}
              state={squares[row][col][0]} 
              isBomb={squares[row][col][1]}
              value={squares[row][col][2]}
              onSquareLeftClick={() => handleLeftClick(row, col)}
              onSquareRightClick={(e) => handleRightClick(e, row, col)}
              />);
        })}
        </div>
      ))}
      </>
    )
  }
   

  return (
    <>
    {renderBoard()}
    </>
  );
}

export default function Game() {
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const [numBombs, setNumBombs] = useState(5);
  const generateSquare = (): SquareType =>  ['', false, -2];
  // const initialSquares = new Array(width * height).fill(0).map(e => ['', false, 0] as SquareType)
  const generateRow = (): Array<SquareType> => Array(width).fill(0).map(generateSquare);
  const initialSquares = new Array(height).fill(0).map(generateRow);
  const [squares, setSquares] = useState<Array<Array<SquareType>>>(generateBombs(initialSquares, numBombs));
  const rows = Array.from({length: height}, (_, index) => index);
  const cols = Array.from({length: width}, (_, index) => index);
  const [gameIsOver, setGameIsOver] = useState(false);
  const [flagMode, setFlagMode] = useState(false);
  const [gameStatus, setGameStatus] = useState("");
  const [squaresRevealed, setSquaresRevealed] = useState(0);
  let squaresRevealedCounter = 0;

  function generateBombs(squares: Array<Array<SquareType>>, bombs: number) : Array<Array<SquareType>> {
    const nextSquares = squares.slice();
    let bombsPlaced = 0;
    //plant bombs
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        nextSquares[i][j][0] = "Hidden";
        let bombRNG = false;
        if (bombsPlaced === bombs)
          bombRNG = false;
        else
          bombRNG = Math.random() <= (bombs - bombsPlaced) / (width * height - (i*width + j));
        // console.log(bombRNG);
        if (bombRNG) {
          nextSquares[i][j][1] = true;
          nextSquares[i][j][2] = -1;
          bombsPlaced += 1;
        } else {
          nextSquares[i][j][1] = false;
          nextSquares[i][j][2] = 0;
        }
      }
    }
    
    // console.log(nextSquares);

    // console.log("updating hints");
    //update hints
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        //is a bomb, update neighbors
        if (nextSquares[i][j][1]) {
          for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
              if (i + x >= 0 && i + x < height && j + y >= 0 && j + y < width) {
                if (!nextSquares[i+x][j+y][1]) {
                  nextSquares[i+x][j+y][2]++;
                }
              }
            }
          }
        }
      }
    }

    // console.log(nextSquares);
    
    return nextSquares;
  }

  function clickSquare (currentSquares: Array<Array<SquareType>>, row: number, col: number, clickType: string) {
    
    let nextSquares = currentSquares.slice();
    const isFlag = clickType==="LEFT" && flagMode || clickType==="RIGHT" && !flagMode;
    if (isFlag) {
      if (nextSquares[row][col][0] === "Hidden") {
        nextSquares[row][col][0] = "Flagged";
      } else if (nextSquares[row][col][0] === "Flagged") {
        nextSquares[row][col][0] = "Hidden";
      }
    } else {
      if (nextSquares[row][col][0] === "Hidden") {
        squaresRevealedCounter++;
        nextSquares[row][col][0] = "Revealed";
        setSquaresRevealed(squaresRevealed + 1);
        if (nextSquares[row][col][2] === 0) {
          for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
              if (row + x >= 0 && row + x < height && col + y >= 0 && col + y < width && nextSquares[row+x][col+y][0] === "Hidden") {
                nextSquares = clickSquare(nextSquares, row + x, col + y, clickType);
              }
            }
          }
        }
        if (nextSquares[row][col][1]) {
          setGameIsOver(true);
          setGameStatus("You lose!");
        }
      }
    }
    return nextSquares;
  }

  const handleClick = (row: number, col: number, clickType: string) => {
    if (!gameIsOver) {
      squaresRevealedCounter = 0;
      const nextSquares = clickSquare(squares.slice(), row, col, clickType);
      setSquares(nextSquares);
      if (squaresRevealed + squaresRevealedCounter === width * height - numBombs) {
        setGameIsOver(true);
        setGameStatus("You win!");
      }
      setSquaresRevealed(squaresRevealed + squaresRevealedCounter);
    }
  }

  const handleLeftClick = (row: number, col: number) => {
    handleClick(row, col, "LEFT");
  }

  const handleRightClick = (e: React.SyntheticEvent, row: number, col: number) => {
    e.preventDefault();
    handleClick(row, col, "RIGHT");
  }

  const restartBoard = () => {
    const nextSquares = generateBombs(initialSquares, numBombs);
    setSquares(nextSquares);
    setGameIsOver(false);
    setGameStatus("");
    setFlagMode(false);
    setSquaresRevealed(0);
  }

  const invertFlagMode = () => {
    setFlagMode(!flagMode);
  }

  function renderFlagModeButton () {
    if (flagMode) {
      return <button onClick={invertFlagMode} className="flag-mode-on">Flag Mode</button>;
    } else {
      return <button onClick={invertFlagMode} className="flag-mode-off">Flag Mode</button>;
    }
    
  }

  return (
    <>
    <div className="game">
      <div className="title">
        <h3>Minesweeper!</h3>
        <h3>{gameStatus}</h3>
        <button onClick={restartBoard}>Restart</button>
        {renderFlagModeButton()}
      </div>
      <div className="game-board">
        <Board
        width={width}
        height={height}
        numBombs={numBombs}
        squares={squares}
        handleLeftClick={handleLeftClick}
        handleRightClick={handleRightClick}
        />
      </div>
    </div>
    </>
  );
}

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
//         <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
//           Get started by editing&nbsp;
//           <code className="font-mono font-bold">app/page.tsx</code>
//         </p>
//         <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
//           <a
//             className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
//             href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             By{" "}
//             <Image
//               src="/vercel.svg"
//               alt="Vercel Logo"
//               className="dark:invert"
//               width={100}
//               height={24}
//               priority
//             />
//           </a>
//         </div>
//       </div>

//       <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
//         <Image
//           className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
//           src="/next.svg"
//           alt="Next.js Logo"
//           width={180}
//           height={37}
//           priority
//         />
//       </div>

//       <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
//         <a
//           href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Docs{" "}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//             Find in-depth information about Next.js features and API.
//           </p>
//         </a>

//         <a
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Learn{" "}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//             Learn about Next.js in an interactive course with&nbsp;quizzes!
//           </p>
//         </a>

//         <a
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Templates{" "}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//             Explore starter templates for Next.js.
//           </p>
//         </a>

//         <a
//           href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Deploy{" "}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
//             Instantly deploy your Next.js site to a shareable URL with Vercel.
//           </p>
//         </a>
//       </div>
//     </main>
//   );
// }
