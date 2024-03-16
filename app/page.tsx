'use client'
// Allows useState and onClick, which are client side hooks

import { useState } from 'react';

type SquareType = [string, boolean, number]

const DEFAULT_BOARD_SIZE = 10;

function Square({ state, isBomb, value }: {state: string, isBomb: boolean, value: number}) {
  return (<button className="square"> {value} </button>);
}

export default function Board() {
  const [width, setWidth] = useState(DEFAULT_BOARD_SIZE);
  const [height, setHeight] = useState(DEFAULT_BOARD_SIZE);
  const [numBombs, setNumBombs] = useState(DEFAULT_BOARD_SIZE);

  const generateSquare = (): SquareType =>  ['', false, 0]
  // const initialSquares = new Array(width * height).fill(0).map(e => ['', false, 0] as SquareType)
  const initialSquares = new Array(width * height).fill(0).map(generateSquare)
  
  console.log(initialSquares)
  const [squares, setSquares] = useState<Array<SquareType>>(generateBombs(initialSquares, 50));

  const rows = Array.from({length: height}, (_, index) => index);
  const cols = Array.from({length: width}, (_, index) => index);

  function generateBombs(squares: Array<SquareType>, bombs: number) : Array<SquareType> {
    const nextSquares = squares.slice();
    
    let bombsPlaced = 0;
    //plant bombs
    for (let i = 0; i < squares.length; i++) {
      nextSquares[i][0] = "Hidden";
      let bombRNG = false;
      if (bombsPlaced === bombs)
        bombRNG = false;
      else
        bombRNG = Math.random() <= (bombs - bombsPlaced) / (squares.length - i);
      console.log(bombRNG);
      if (bombRNG) {
        nextSquares[i][1] = true;
        nextSquares[i][2] = -1;
        bombsPlaced += 1;
      } else {
        nextSquares[i][1] = false;
        nextSquares[i][2] = 0;
      }
    }
    console.log(nextSquares);

    console.log("updating hints");
    //update hints
    for (let i = 0; i < squares.length; i++) {
      //is a bomb
      if (nextSquares[i][1]) {
        //top left corner
        if (i - 11 >= 0 && i - 11 < nextSquares.length && !nextSquares[i-11][1]) {
          nextSquares[i-11][2] += 1;
        }
        //top middle
        if (i - 10 >= 0 && i - 10 < nextSquares.length && !nextSquares[i-10][1]) {
          nextSquares[i-10][2] += 1;
        }
        //top right corner
        if (i - 9 >= 0 && i - 9 < nextSquares.length && !nextSquares[i-9][1]) {
          nextSquares[i-9][2] += 1;
        }
        //left
        if (i - 1 >= 0 && i - 1 < nextSquares.length && !nextSquares[i-1][1]) {
          nextSquares[i-1][2] += 1;
        }
        //right
        if (i + 1 >= 0 && i + 1 < nextSquares.length && !nextSquares[i+1][1]) {
          nextSquares[i+1][2] += 1;
        }
        //bottom left
        if (i + 9 >= 0 && i + 9 < nextSquares.length && !nextSquares[i+9][1]) {
          nextSquares[i+9][2] += 1;
        }
        //bottom middle
        if (i + 10 >= 0 && i + 10 < nextSquares.length && !nextSquares[i+10][1]) {
          nextSquares[i+10][2] += 1;
        }
        //bottom right corner
        if (i + 11 >= 0 && i + 11 < nextSquares.length && !nextSquares[i+11][1]) {
          nextSquares[i+11][2] += 1;
        }
      }
    }

    console.log(nextSquares);
    
    return nextSquares;
  }
  

  function renderBoard() {
    return (
      <>
      {rows.map((row) => (
        <div className="board-row">
          {cols.map((col) => {
            const index = row * width + col;
            return (<Square 
              state={squares[index][0]} 
              isBomb={squares[index][1]}
              value={squares[index][2]}
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
