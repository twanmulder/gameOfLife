# Game of Lift NFT's

A super simple website generating a "Game of Life" based on a provided seed

## IMPORTANT: Changes to make to the code when generating an NFT

- In `./index.html`, canvas with and height needs to set to 1000 in HTML Tag & CSS
- In `./main.js`, the initSetup needs to have a gridsize of 800
- In `./main.js`, inside the gameLoop function, instead of `setup.delay`, the timeout needs to be set to a HIGH number (something like 10000)
- In `./main.js`, in the final onload function, the `a.click()` can be commented out so the image of the canvas will be saved to your device

## Formatting of NFT Name

Game of Life #"SEED"

Examples:

- Game of Life #17571
- Game of Life #CALLUM
- Game of LIfe #kenneth.eth
