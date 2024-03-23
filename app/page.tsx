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

type inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;  
type submitHandler = (e: React.FormEvent<HTMLFormElement>) => void; 

function GameConfigForm({formData, handleInputChange, handleSubmit}: {formData: {rows: string, cols: string, numBombs: string}, handleInputChange: inputChangeHandler, handleSubmit: submitHandler}) {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="rows">Rows:</label>
        <input
          type="text"
          id="rows"
          name="rows"
          value={String(formData.rows)}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="cols">Columns:</label>
        <input
          type="text"
          id="cols"
          name="cols"
          value={String(formData.cols)}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="numBombs">Bombs:</label>
        <input
          type="numBombs"
          id="numBombs"
          name="numBombs"
          value={String(formData.numBombs)}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );

}


export default function Game() {
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const [numBombs, setNumBombs] = useState(10);
  const generateSquare = (): SquareType =>  ['', false, -2];
  // const initialSquares = new Array(width * height).fill(0).map(e => ['', false, 0] as SquareType)
  const generateRow = (width: number) => ():  Array<SquareType> => Array(width).fill(0).map(generateSquare);
  const initialSquares = new Array(height).fill(0).map(generateRow(width));
  const [squares, setSquares] = useState<Array<Array<SquareType>>>(generateBombs(initialSquares, numBombs, height, width));
  const rows = Array.from({length: height}, (_, index) => index);
  const cols = Array.from({length: width}, (_, index) => index);
  const [gameIsOver, setGameIsOver] = useState(false);
  const [bombRevealed, setBombRevealed] = useState(false);
  const [flagMode, setFlagMode] = useState(false);
  const [gameStatus, setGameStatus] = useState("");
  const [squaresRevealed, setSquaresRevealed] = useState(0);
  const [numFlags, setNumFlags] = useState(0);

  //Config Form
  const [formData, setFormData] = useState({
    rows: String(DEFAULT_BOARD_SIZE), 
    cols: String(DEFAULT_BOARD_SIZE), 
    numBombs: String(DEFAULT_BOARD_SIZE)
  });

  const handleGameConfigFormInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };

  const handleGameConfigFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form submitted', formData);
    const newData = handleGameFormSubmitHelper();
    setFormData(newData);
  };

  function handleGameFormSubmitHelper() {
    const newData = {rows: formData['rows'], cols: formData['cols'], numBombs: formData['numBombs']}

    let newRows = parseInt(formData['rows'], 10) || DEFAULT_BOARD_SIZE;
    let newCols = parseInt(formData['cols'], 10) || DEFAULT_BOARD_SIZE;
    let newNumBombs = parseInt(formData['numBombs'], 10) || DEFAULT_BOARD_SIZE;

    if (newRows <= 0) {
      newRows = 1;
    }
    if (newRows > 100) {
      newRows = 100;
    }
    if (newCols <= 0) {
      newCols = 1;
    }
    if (newCols > 100) {
      newCols = 100;
    }
    if (newNumBombs <= 0) {
      newNumBombs = 1;
    }
    if (newNumBombs > newRows * newCols) {
      newNumBombs = Math.max(newRows * newCols - 1, 1);
    }

    newData['rows'] = String(newRows);
    newData['cols'] = String(newCols);
    newData['numBombs'] = String(newNumBombs);

    return newData;
  }

  
  //Game Setup
  function generateBombs(squares: Array<Array<SquareType>>, bombs: number, height: number, width: number) : Array<Array<SquareType>> {
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

  //Game handlers
  function clickSquare (currentSquares: Array<Array<SquareType>>, row: number, col: number, clickType: string) {
    let nextSquares = currentSquares.slice();
    const isFlag = clickType==="LEFT" && flagMode || clickType==="RIGHT" && !flagMode;
    if (isFlag) {
      if (nextSquares[row][col][0] === "Hidden") {
        nextSquares[row][col][0] = "Flagged";
        setNumFlags(numFlags => numFlags + 1);
      } else if (nextSquares[row][col][0] === "Flagged") {
        nextSquares[row][col][0] = "Hidden";
        setNumFlags(numFlags => numFlags - 1);
      }
    } else {
      if (nextSquares[row][col][0] === "Hidden") {
        nextSquares[row][col][0] = "Revealed";
        setSquaresRevealed(squaresRevealed => squaresRevealed + 1);
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
          setBombRevealed(true);
        }
      }
    }
    return nextSquares;
  }

  const handleClick = (row: number, col: number, clickType: string) => {
    if (!gameIsOver) {
      const nextSquares = clickSquare(squares.slice(), row, col, clickType);
      setSquares(nextSquares);
    }
  }

  useEffect(() => {
    if (bombRevealed) {
      setGameIsOver(true);
      setGameStatus("You lose!");
    } else if (squaresRevealed === width * height - numBombs) {
      setGameIsOver(true);
      setGameStatus("You win!");
    } else {
      setGameStatus(getNumBombsRemaining());
    }
    // setSquaresRevealed(squaresRevealed);
    // setBombRevealed(bombRevealed);
  }, [squaresRevealed, bombRevealed, numFlags]);


  const handleLeftClick = (row: number, col: number) => {
    handleClick(row, col, "LEFT");
  }

  const handleRightClick = (e: React.SyntheticEvent, row: number, col: number) => {
    e.preventDefault();
    handleClick(row, col, "RIGHT");
  }

  function getNumBombsRemaining () {
    const numBombsRemaining = numBombs - numFlags;
    return "Bombs remaining: " + numBombsRemaining;
  }

  const restartBoard = () => {
    const newData = handleGameFormSubmitHelper();
    setFormData(newData);
    const newHeight = parseInt(newData.rows, 10);
    const newWidth = parseInt(newData.cols, 10);
    const newNumBombs = parseInt(newData.numBombs, 10);
    setHeight(newHeight);
    setWidth(newWidth);
    setNumBombs(newNumBombs);
    const newInitialSquares = new Array(newHeight).fill(0).map(generateRow(newWidth));
    const nextSquares = generateBombs(newInitialSquares, newNumBombs, newHeight, newWidth);
    setSquares(nextSquares);
    setGameIsOver(false);
    setBombRevealed(false);
    setGameStatus(getNumBombsRemaining());
    setFlagMode(false);
    setSquaresRevealed(0);
    setNumFlags(0);
  }

  const invertFlagMode = () => {
    setFlagMode(!flagMode);
  }

  //Render UI helpers
  function renderFlagModeButton () {
    if (flagMode) {
      return <button onClick={invertFlagMode} className="flag-mode-on">Flag Mode</button>;
    } else {
      return <button onClick={invertFlagMode} className="flag-mode-off">Flag Mode</button>;
    }
    
  }

  function renderGameStatus () {
    return <h3>{gameStatus}</h3>
  }

  // const gameState = checkGameState();

  // function checkGameState() {
  //   if (gameIsOver) {
  //     if (squaresRevealed === width * height - numBombs) {
  //       return "You win!";
  //     } else {
  //       return "You lose!";
  //     }
  //   } else {
  //     return getNumBombsRemaining();
  //   }
  // }

  return (
    <>
    <div className="game">
      <div className="title">
        <h3>Minesweeper!</h3>
        {/* <h3>{gameState}</h3> */}
        {renderGameStatus()}
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
      <div className="config">
        <button>Edit Game Parameters</button>
        <GameConfigForm 
        formData={formData}
        handleInputChange={handleGameConfigFormInputChange}
        handleSubmit={handleGameConfigFormSubmit}
        />
      </div>
    </div>
    </>
  );
}

// export default function GamePage() {



//   return <Game/>;
// }