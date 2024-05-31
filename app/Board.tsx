import React from 'react'

export type SquareType = [string, boolean, number]
type OnSquareClickHandler = () => void;
type OnSquareRightClickHandler = (e: React.SyntheticEvent) => void;

export const DEFAULT_BOARD_SIZE = 9;
export const DEFAULT_NUM_BOMBS = 10;

function Square({ state, isBomb, value, onSquareLeftClick, onSquareRightClick}: {state: string, isBomb: boolean, value: number, onSquareLeftClick: OnSquareClickHandler, onSquareRightClick: OnSquareRightClickHandler}) {
  if (state === "Hidden") {
    return (<button className="square unrevealed" onClick={onSquareLeftClick} onContextMenu={onSquareRightClick}></button>);
  } else if (state === "Flagged") {
    return (<button className="square flag" onClick={onSquareLeftClick} onContextMenu={onSquareRightClick}>🚩</button>);
  } else if (state === "Wrong Flag") {
	return (<button className="square lost-flag" onClick={onSquareLeftClick} onContextMenu={onSquareRightClick}>
			<div className="icon-container">
			<span className="bomb">💣</span>
			<span className="overlay">❌</span>
			</div>
			</button>);
  } else if (state === "Winning Flag") {
	return (<button className="square won-flag" onClick={onSquareLeftClick} onContextMenu={onSquareRightClick}>😊</button>);
  }
  //else state === "Revealed"
  if (isBomb) {
	//Most recent clicked bomb
	if (value === -2) {
		return (<button className="square bomb"> 💥 </button>);
	}
    return (<button className="square bomb"> 💣 </button>);
  } else {
    if (value === 0) {
      return (<button className="square revealed"></button>);
    } else {
      return (<button className="square revealed"> {value} </button>);
    }
  }
}

export function Board({width, height, numBombs, squares, handleLeftClick, handleRightClick}: {width: number, height: number, numBombs: number, squares: Array<Array<SquareType>>, handleLeftClick: Function, handleRightClick: Function}) {
  const rows = Array.from({length: height}, (_, index) => index);
  const cols = Array.from({length: width}, (_, index) => index);

  function renderBoard() {
    return (
      <>
      {rows.map((row) => (
        <div className="board-row flex overflow-hidden" key={row}>
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
    <div className="items-center">
      {renderBoard()}
    </div>
    </>
  );
}