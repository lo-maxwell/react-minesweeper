'use client'
// Allows useState and onClick, which are client side hooks

import React, { useEffect, useState } from 'react';
import { Config } from './Config';
import { SquareType, DEFAULT_BOARD_SIZE, Board } from './Board';
import { InstructionPage } from './InstructionPage';

export default function Game() {
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const [numBombs, setNumBombs] = useState(10);
  const generateSquare = (): SquareType =>  ['Hidden', false, 0];
  const generateRow = (width: number) => ():  Array<SquareType> => Array(width).fill(0).map(generateSquare);
  // const initialSquares = new Array(height).fill(0).map(generateRow(width));
  const [squares, setSquares] = useState<Array<Array<SquareType>>>(new Array(height).fill(0).map(generateRow(width)));
  // const rows = Array.from({length: height}, (_, index) => index);
  // const cols = Array.from({length: width}, (_, index) => index);
  const [gameIsOver, setGameIsOver] = useState(false);
  const [bombRevealed, setBombRevealed] = useState(false);
  const [flagMode, setFlagMode] = useState(false);
  const [gameStatus, setGameStatus] = useState("");
  const [squaresRevealed, setSquaresRevealed] = useState(0);
  const [numFlags, setNumFlags] = useState(0);
  let gameSetup = squaresRevealed===0;
  const [showForm, setShowForm] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  //Config Form
  const [formData, setFormData] = useState({
    rows: String(DEFAULT_BOARD_SIZE), 
    cols: String(DEFAULT_BOARD_SIZE), 
    numBombs: String(DEFAULT_BOARD_SIZE)
  });

  const [originalFormData, setOriginalFormData] = useState({
    rows: String(DEFAULT_BOARD_SIZE), 
    cols: String(DEFAULT_BOARD_SIZE), 
    numBombs: String(DEFAULT_BOARD_SIZE)
  });

  const handleGameConfigFormInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    console.log('Form changed', formData);

    setFormData({
      ...formData,
      [name]: value
    });

  };

  const handleGameConfigFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // console.log('Form submitted', formData);
    const newData = handleGameFormSubmitHelper();
    setFormData(newData);
    setOriginalFormData(newData);
    setShowForm(false);
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
    if (newNumBombs >= newRows * newCols) {
      newNumBombs = Math.max(newRows * newCols - 1, 1);
    }

    newData['rows'] = String(newRows);
    newData['cols'] = String(newCols);
    newData['numBombs'] = String(newNumBombs);

    return newData;
  }

  
  //Game Setup
  function generateBombs(squares: Array<Array<SquareType>>, bombs: number, height: number, width: number, startX: number, startY: number) : Array<Array<SquareType>> {
    const nextSquares = squares.slice();
    let bombsPlaced = 0;
    //plant bombs
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        //skip over the first clicked square
        if(startX === j && startY === i) continue;
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
      //Generate bombs on the first click so that we dont blow up immediately
      if (gameSetup) {
        nextSquares = generateBombs(nextSquares, numBombs, height, width, col, row);
        gameSetup = false;
      }
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
          //Flag as last clicked bomb so we can display it on screen
          nextSquares[row][col][2] = -2;
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

  function revealBombs(currentSquares: Array<Array<SquareType>>, height: number, width: number) {
    let nextSquares = currentSquares.slice();
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        //is hidden, is a bomb, is not most recently clicked bomb -> display as bomb
        if (nextSquares[i][j][0] === "Hidden" && nextSquares[i][j][1] && nextSquares[i][j][2 ]=== -1) {
          nextSquares[i][j][0] = "Revealed";
        }
        //is flagged, is not a bomb -> display as incorrect flag
        if (nextSquares[i][j][0] === "Flagged" && !nextSquares[i][j][1]) {
          nextSquares[i][j][0] = "Wrong Flag";
        }
      }
    }
    return nextSquares;
  }

  function revealFlags(currentSquares: Array<Array<SquareType>>, height: number, width: number) {
    let nextSquares = currentSquares.slice();
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        //is flagged, or is hidden -> Show on game win screen (on game win, all unrevealed squares are bombs)
        if (nextSquares[i][j][0] === "Hidden" || nextSquares[i][j][0] === "Flagged") {
          nextSquares[i][j][0] = "Winning Flag";
        }
      }
    }
    return nextSquares;
  }

  useEffect(() => {
    if (bombRevealed) {
      setGameIsOver(true);
      setGameStatus("You lose!");
      setSquares(revealBombs(squares, height, width));
    } else if (squaresRevealed === width * height - numBombs) {
      setGameIsOver(true);
      setGameStatus("You win!");
      setSquares(revealFlags(squares, height, width));
    } else {
      setGameStatus(getNumBombsRemaining());
    }
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
    setOriginalFormData({ rows: newData['rows'],
                          cols: newData['cols'],
                          numBombs: newData['numBombs']});
    const newHeight = parseInt(newData.rows, 10);
    const newWidth = parseInt(newData.cols, 10);
    const newNumBombs = parseInt(newData.numBombs, 10);
    setHeight(newHeight);
    setWidth(newWidth);
    setNumBombs(newNumBombs);
    // const newInitialSquares = new Array(newHeight).fill(0).map(generateRow(newWidth));
    // const nextSquares = generateBombs(newInitialSquares, newNumBombs, newHeight, newWidth, -1, -1);
    setSquares(new Array(newHeight).fill(0).map(generateRow(newWidth)));
    setGameIsOver(false);
    setBombRevealed(false);
    setGameStatus(getNumBombsRemaining());
    setFlagMode(false);
    setSquaresRevealed(0);
    setNumFlags(0);
  }

  const showConfigForm = () => {
    setShowForm(true);
  }

  const showInstructionsPage = () => {
    setShowInstructions(true);
  }

  const invertFlagMode = () => {
    setFlagMode(!flagMode);
  }

  //Render UI helpers
  function renderFlagModeButton () {
    if (flagMode) {
      return <button onClick={invertFlagMode} className="flag-mode-on px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">Flag Mode</button>;
    } else {
      return <button onClick={invertFlagMode} className="bg-gray-300 px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">Flag Mode</button>;
    }
    
  }

  function renderGameStatus () {
    return <h3>{gameStatus}</h3>
  }

  return (
    <>
    <div className="fixed px-4 inset-0 mx-auto space-y-2 shadow-lg bg-gray-400 h-screen overflow-x-auto overflow-y-auto">
      <div className="text-center space-y-0.5 px-8 pb-4 bg-gray-800 text-white ">
        <div className="flex">
          <span className="flex-1 mr-auto invisible"> . </span>
          <span className="flex-1 text-2xl font-bold justify-center">Minesweeper!</span>
          <span className="flex flex-1 justify-end relative"><button onClick={showInstructionsPage} className="text-4xl absolute top-4 right-0">ℹ️</button></span>
          
        </div>
        {renderGameStatus()}
        <div className="space-x-4">
          <button onClick={restartBoard} className="bg-gray-300 px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">New Game</button>
          {renderFlagModeButton()}
          <button onClick={showConfigForm} className="bg-gray-300 px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">Customize Board</button>
          
        </div>
      </div>
      <div className="flex justify-center w-screen-8">
        <div className="flex justify-left overflow-x-auto flex-wrap">
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
      <div className="flex justify-center">
        <Config 
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleGameConfigFormInputChange}
          handleSubmit={handleGameConfigFormSubmit}
          showForm={showForm}
          setShowForm={setShowForm}
          originalForm={originalFormData}
        />
      </div>
      <div className="">
        <InstructionPage
          showInstructions={showInstructions}
          setShowInstructions={setShowInstructions}
        />
      </div>
    </div>
    </>
  );
}


// Game state, utility function that modify game state -> don't have any react code
// flag bomb
// reveal a square -> recursive bfs
// generate bombs
// restart (reset board and then generates bombs)
// -----
// React UI takes state as a prop and render html 
// button -> calls one of the utilities and says flag bomb at (2,3)
// button -> restarts
// tile/square ui -> flag or reveal