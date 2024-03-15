# **Minesweeper Design Doc**

## Functional Description

Recreating Minesweeper in React

### **Game Rules**

### Constants

  * M - Width of board
  * N - Height of board
  * b - Number of bombs hidden in Squares
  * M x N - Total number of Squares on board

Grid of M x N Squares

Each Square has 5 states - hidden, Revealed empty, Revealed number, Revealed Bomb (loss condition), Flagged.

  * This can be reduced to 3 states, as each of the revealed options are basically the same state.

There are b Bombs hidden inside Squares.  A player can Reveal a Square by clicking on it. Alternatively, they can Flag a Square by right clicking on it, which prevents the square from being Revealed until unflagged.

When a Bomb Square is Revealed, the player loses.

When a non-Bomb Square is Revealed, it displays a number corresponding to the number of Neighboring (both orthogonal and diagonal) Bombs. If there are no Neighboring Bombs, the Square displays an empty space, and all Neighboring Squares are automatically Revealed (they are guaranteed to not be Bombs and thus safe to Reveal).

If the total number of Revealed Squares is equal to (M x N - b), the player wins. 

Note that the number of Flagged Squares is irrelevant to the win/loss condition. However, we will display the number (b - [# of flags]) as a guide to how many bombs have been flagged by the player -- if it is ever 0 or negative and the player has not won yet, they have mistaken a safe Square for a Bomb.

## **UI Features**

Ability to restart the game with a single button press

Ability to start a new game with different and/or custom board dimensions and starting numbers of bombs

Ability to switch between Flag and Reveal mode with a button press

Ability to see how many Squares have been Flagged

Button is Pressed (different color when mouse click is down) and can move if the cursor moves

## **Classes/Objects/Components**
Built in React
### Square
  * Represented by a square button
  * Field: State
    * Hidden
    * Revealed (Empty, Number, Bomb)
    * Flagged
    * Marked (with question mark)
  * Field: Value
    * Empty
    * Bomb
  * onClick: Reveal
    * If Flagged or Marked, do nothing (or flash an error)
    * If Hidden:
      * If Bomb, set State to Revealed (Bomb), then trigger Loss Condition
      * Else: Count the number of Neighboring Bombs b
      * Set State to Revealed (b)
      * If b == 0: Reveal all Neighboring Squares
  * onRightClick: Flag
    * If Hidden, set State to Flagged
    * If Flagged, set State to Marked
    * If Marked, set State to Hidden

### Board
 * Represented by 2D Array of Squares - consider making this a 1D array instead?
 * Field: Width
   * Integer
 * Field: Height
   * Integer
 * Field: Squares
   * 2D Array of Squares of dimensions Width and Height

### Game
  * Contains a board
  * function generateMines(M, N, b): Randomly generates an M x N board with b Bombs in it
  * function generateMinesAvoidFirstLoss(M, N, b, x, y): Randomly generates an M x N board with b Bombs in it, guaranteeing that there is no Bomb on position x, y
  * function solveStep(board): Finds a single Square that is safe to Reveal on board. If there is none, return unsolvable.
  * function solveBoard(board, n): Repeats solveStep until the board is solved, or it times out, or reaches n steps. Returns unsolvable if it times out or reaches n steps.
  * function hideBoard(board): Converts all Revealed and Flagged Squares on a board to Hidden
  * function generateMinesAvoidRNG(M, N, b, x, y): Randomly generates an M x N board with b Bombs, guaranteeing that there is no Bomb on position x, y, and that it is solvable by the solver within 1000 steps

### Restart Button

### Undo Button

### Flag Toggle Button

### Settings Menu
  * Change board dimensions on next restart
  * Change number of bombs

## Filesystem

### App.js

Main content. Contains all Javascript/react code.

### Styles.css

Contains styling for buttons and webpage

### Index.js

Binds React code to Styles and Url

### node_modules/

Contains dependencies
  
## Goals/Timeline

  * Set up webpage - get a blank page to load, with some default text
  * Build the Square Component, and display a single Square
  * Build the Board Component, and display a board of 10x10 Squares
  * Add game setup - initial load of bombs and squares
  * Add game functions - revealing, flagging, win/loss conditions
  * Build the Game Component, which contains a board and various settings buttons
  * Add customizable settings - board size and number of bombs, restart game
  * Extra features:
    * Leaderboard (with local caching)
    * Auto solve (1 step)
    * Auto solve (infinite steps)
    * Auto solve (infinite steps, displayed every 0.1 seconds)
    * Generate non RNG board
    * Generate biased boards (density clouds)

