Here is a list of next changes to be made:
[x] Don't record 0 scores in the leaderboard.
[x] Get the leaderboard to display all the past scores (max 100). Remove the "show more" button. Use scrolling within the scores container if needed.
[x] Make the leaderboard rank by score. The index displayed next to each score should represent the rank of the score regarding the other scores. Handle tied scores with same rank (e.g., two players with 500 points both show "#1"). Add special visual treatment for top 3 positions (gold/silver/bronze medals). 
[x] Add a "choose player" screen before the home screen. The choose player screen enables to choose between "player one" or "player two" with up and down arrow keys. Validation of the selected player is done when pressing enter key. Make the design feel like a 1990 nintendo game (pixel 8bit) - NES-style blue background, pixel borders, retro font. Player selection saved between sessions. This is an additional step before home screen.
[ ] 
[ ] Display the last game score above the leaderboard as a distinct part. Show score, correct answers, total questions, and accuracy percentage. Use gold/yellow colors with nice framing. Softly fading blink animation for 5 seconds after returning from a game, then stops. Section disappears if no game played yet in session.
[ ] Add positive and negative feedback sounds when good or bad answer are given. Find simple 8-bit style sound effects, store in /public/audio/sfx/ folder, use reasonable default volume (20%).
