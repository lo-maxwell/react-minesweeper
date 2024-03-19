# Minesweeper-Blog

## Day 1

### Set up a new app using Next.js + React

### Upload to git

### Build a Square Component

## Day 2

### Build a Board Component, and have it pass data down to the Squares

  * But the board was fixed to 10x10, and would count mines by wrapping around. Need to convert to a 2d board.

## Day 3

### Made Board 2D

  * But the bomb rng is a bit skewed, all the bombs are placed towards the top. Check to make sure it's an even chance.
    * Fixed by changing the boundaries from squares.length (which was originally working but we made it 2d) to width * height
  * Board and bomb placement is now fixed

### Finished Revealing tiles and recursive reveal


### Add Game Component, restart button

## Day 4

### Added win/loss details

### Added flagging and flag mode

### Changed color scheme to better differentiate hidden, revealed, and flagged tiles

  * Uses React.syntheticEvent and e.preventDefault() to get the right click flag to work


## TODO

### Fix Board, maybe make a 2d representation instead of 1d, right now it checks by wrapping around (and only works for 10 units)

### Update CSS using Tailwind to prettyify everything