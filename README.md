# SWE_681
A client-server arithmetic guessing and solving game.
## Quick Summary
- Two Player game
- Both select a number and try and guess what arithmetic operation is happening against a specified random value for the game.
- If the outcome of the operation between the player's number and the random value is greater than the outcome of the opponent, you win the match. The losing player also loses their last number selection, limiting the moves they can make their next turn.
- If either opponent has only one selection left, they lose the game.

## Objective: 
- Select an input value that will produce a higher output value, than your opponent, after an unknown mathematical operator is used to perform an operation with your selected value and the given game value.
- Possible outcomes per round: Win | Tie | Loss
- Possible outcomes per game: Win | Loss
## Game Rules:
- Each user must select a value from the seven given per round:
  - 200, 150, 100, 75, 50, 25, 10
- The player with the higher outcome will win the round.
- After each round, the winning player retains their inputs. The losing player loses the input he used in that round. If a tie happens, no player loses a turn
- When a player reaches only one value left, the game is over and a new game is set to start.
- Any bets made within a game are awarded to the winner of the game, and the players earning can keep accruing throughout the gaming session between the two opponents.
- You can only pause a game for 30 seconds. If you pause a game for longer you lose the game and are booted from the game. The game is then ended for both players after a warning is sent to the player that didn’t initiate the pause.
- Any instances where a value, that is not in the allowed bounds of the game, is somehow passed in as a turn will result in automatic ejection from the game and the game will shortly after be terminated.
- Only wins and losses will be recorded for this game. The authors do not believe in tie games as a result. As such the game cannot end in a tie.


