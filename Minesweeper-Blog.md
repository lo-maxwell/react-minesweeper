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


## Day 5

### Added "number of bombs remaining" message to the top

  * Had a 1-behind error due to using setState, so moved it into a function to recalculate the message every render
    * Moved to useEffect() - this takes in a dependency and runs a function each time it is changed. Used this to manually update the game status each time we modify win/loss/bombs remaining


## Day 6

### Added form to customize the number of rows/columns/bombs

  * Convert to useEffect?

## Day 7

### Added emojis as square symbols

### Updated css layout

### Flags all bombs on won screen, shows bombs on loss screen

## Day 8

### Bombs now generate on first reveal, making sure that the user never clicks a bomb on their first try

### Updated UI using tailwind

## Day 9

### Updated UI again

### Added instructions page


## TODO

- Don't expose apis
-- Instead, just call the server actions -- see api/leaderboard/viewEntriess/route.ts
-- But if you use an external database like planetscale then you need the apis open

- Split the client and server side code
-- Server side should call server actions, fetch db data, and pass it down to the client

- Don't need app/ and pages/, stick to 1

- Look into vercel postgres

- Write external script to init database