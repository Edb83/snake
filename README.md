# Cyber Snake

![alt text](responsive.jpg "Responsive sample")

**[Live demo](https://edb83.github.io/snake/)**

---

<span id="top"></span>

## Index

- <a href="#context">Context</a>
- <a href="#ux">UX</a>
  - <a href="#ux-overview">Overview</a>
  - <a href="#ux-stories">User stories</a>
  - <a href="#ux-wireframes">Wireframes</a>
  - <a href="#ux-design">Design</a>
- <a href="#features">Features</a>
  - <a href="#features-current">Current</a>
  - <a href="#features-future">Future</a>
- <a href="#technologies">Technologies Used</a>
- <a href="#testing">Testing</a>
  - <a href="#testing-auto">Automated</a>
  - <a href="#testing-manual">Manual</a>
  - <a href="#testing-responsive">Responsiveness</a>
  - <a href="#testing-resolved">Resolved issues</a>
  - <a href="#testing-unresolved">Unresolved issues</a>
- <a href="#deployment">Deployment</a>
- <a href="#credits">Credits</a>

---

<span id="context"></span>

## Context

Cyber Snake is an homage to the Nokia version of the game, which many of us will remember fondly from the advent of mobile gaming. While Nokia's monochrome version of Snake wasn't released until 1998, the game concept dates back to 1976 when [Blockade](<https://en.wikipedia.org/wiki/Blockade_(video_game)>) first appeared in arcades. Since then, there have been hundreds of versions released, and for good reason. It is considered a classic in terms of design and even appears in New York's Museum of Modern Art alongside the likes of Minecraft, Pong and Tetris.

The game concept is simple:

- Guide your snake by changing its direction up, down, left or right in order to eat as many food blobs as you can
- Every time you eat some food you score one point, your snake grows by one segment and a new food spawns in a random location
- The game ends when your snake's head collides with its body or, if walls are enabled, you hit a wall

This version offers classic Snake gameplay, a clean interface, satisfying graphical feedback, and the kind of 'personality' typified by games of the 90s. If you feel any pangs of nostalgia then it has achieved its aim!

<div align="right"><a style="text-align:right" href="#top">Go to index :arrow_double_up:</a></div>
<span id="ux"></span>

## UX

<span id="ux-overview"></span>

### Overview

The game has been designed with no 'fluff' to distract players from having some fun. All design decisions have been made with the following goals in mind:

- Mobile-first
- Customisable code
- Simplicity
- Intuitive navigation
- Crisp controls
- Satisfying feedback
- Replayability

<span id="ux-stories"></span>

### User stories

#### As a player I want:

- To be able to jump straight into the game without needing further instructions
- A clean, uncluttered interface with all elements of the game within easy reach
- To be able to play on any device with simple, responsive controls
- To have options for both casual or more challenging gameplay
- To know how well I am doing
- Satisfying audio and visual feedback
- To have a reason to keep playing

#### As a developer/site owner I want:

- To be able to customise the look and feel of the game easily

Several individuals contributed to testing the game and provided feedback on its gameplay, responsiveness and aesthetics at various points in development. A snippet of their feedback:

> Very smooth. Love the retro stuff. This game was as good as it got when I started gaming as a kid. Swipe controls amazingly responsive on my iPhone X, very playable and very enjoyable. Nice bit of wit at the end about how disappointing my performance was :laughing:

<span id="ux-wireframes"></span>

### Wireframes

Wireframes for **mobile** and **desktop** can be accessed [here](wireframes/).

Overall the wireframes were successfully followed when creating Cyber Snake, however there were some noteworthy deviations from the plan. These were:

1. Statistics menu

This was intended to live on a separate menu screen but was moved entirely to the scores menu. Rather that being able to pull up a screen showing, for example, the average score per game, this information is instead provided in comments such as "Your average score per game is X" or "You have been playing for Y minutes in total".

2. Advanced image manipulation

The initial idea was to have a more flashy landing screen which would respond to user mouse movements, and to have other visuals passing behind the game area during play, either using the HTML canvas or CSS animations. These features were outside the scope of the project and would have ultimately been a distraction if not handled elegantly.

3. Mobile control pad

HammerJS offers a much better solution to mobile control. Prior to discovering it, a directional pad/virtual joystick seemed like the most viable means of controlling the game on mobile.

<span id="ux-design"></span>

### Design choices

#### Colours

The theme of the game is a blend of retro, cyber and neon, with the colour palatte intended to elicit thoughts of a futuristic cityscape at dusk. The background dominates most of the screen and is punctuated by fluorescent embers. Web-safe colours have been chosen for the core elements of the game (as far as possible), while more leeway has been given to the supporting colours.

##### Core

The colours used for the core game aspects are easy on the eyes when concentrating but give sufficient contrast for easily identifying the game pieces. The snake (Phlox) on the background (Cetacean Blue) is the most frequent combination and is highly evocative of the overall futuristic/neon theme. The pure white text is bright but not overpowering, and is further broken up by sparing use of Neon Carrot and Screamin' Green (used also in the sparks' palette) to differentiate desktop and mobile controls. The enigmatic "the messier things become" in Phlox matches the colour of the snake.

The border of the game area is Deep Carmine Pink if walls are enabled, or Wageningen Green if they are not. These colours intuitively suggests green for safe and red for danger. Without this distinction it would be difficult to immediately convey whether or not walls were enabled, so the colours are as close to primary as possible.

- ![#001440](https://via.placeholder.com/15/001440/000000?text=+) #001440 (Cetacean Blue)
- ![#ffffff](https://via.placeholder.com/15/ffffff/000000?text=+) #ffffff (White)
- ![#DF00FE](https://via.placeholder.com/15/DF00FE/000000?text=+) #df00fe (Phlox)
- ![#FF3333](https://via.placeholder.com/15/FF3333/000000?text=+) #ff3333 (Deep Carmine Pink)
- ![#339933](https://via.placeholder.com/15/339933/000000?text=+) #339933 (Wageningen Green)

##### Food & Sparks

In keeping with the neon/cyber theme, a fluorescent colour palette has been used, which lends itself well to the glow effect on food and spark objects. A large number of colours has been used to amplify the spark effects, which can be quite dramatic in higher-scoring games. The temptation to include pink and purple hues (which are especially prominent in neon colour palettes) was resisted, so as to distinguish the neon purple snake.

- ![#ff355e](https://via.placeholder.com/15/ff355e/000000?text=+) #ff355e (Radical Red)
- ![#fd5b78](https://via.placeholder.com/15/fd5b78/000000?text=+) #fd5b78 (Wild Watermelon)
- ![#ff6037](https://via.placeholder.com/15/ff6037/000000?text=+) #ff6037 (Outrageous Orange)
- ![#ff9966](https://via.placeholder.com/15/ff9966/000000?text=+) #ff9966 (Atomic Tangerine)
- ![#ff9933](https://via.placeholder.com/15/ff9933/000000?text=+) #ff9933 (Neon Carrot)
- ![#ffcc33](https://via.placeholder.com/15/ffcc33/000000?text=+) #ffcc33 (Sunglow)
- ![#ffff66](https://via.placeholder.com/15/ffff66/000000?text=+) #ffff66 (Laser Lemon)
- ![#ccff00](https://via.placeholder.com/15/ccff00/000000?text=+) #ccff00 (Electric Lime)
- ![#66ff66](https://via.placeholder.com/15/66ff66/000000?text=+) #66ff66 (Screamin' Green)
- ![#aaf0d1](https://via.placeholder.com/15/aaf0d1/000000?text=+) #aaf0d1 (Magic Mint)
- ![#50bfe6](https://via.placeholder.com/15/50bfe6/000000?text=+) #50bfe6 (Blizzard Blue)

##### Headings

For the glowing headings, a combination of brighter neon pink/purple is used to cement the feeling of a futuristic cyberscape.

- ![#e60073](https://via.placeholder.com/15/e60073/000000?text=+) #e60073 (Red-Purple)
- ![#ff4da6](https://via.placeholder.com/15/ff4da6/000000?text=+) #ff4da6 (Brilliant Rose)

#### Fonts

[Orbitron](https://fonts.google.com/specimen/Orbitron#about)

For consistency and simplicity this is the only font used. The blend of robotic straight lines and biologic curves is decidedly sci-fi and particularly fitting for Cyber Snake. This was chosen over more hard-edged retro typefaces because it hints at something more organic and less robotic, just as the snake's hard edges are juxtaposed with the round food globs.

#### Audio

The balance between adding ambience and the possibility of irritating players is a fine one, so only three sound used in the game: menu change, eat food and game over. If the player is not won over then the game can easily be muted.

- Menu change: a subtle mechanical click gives a touch of physicality even when out of the game
- Eat food: an retro pop/burst to bring about a positive response in the player for scoring points, with a suggestion of biological origins
- Game over: a shuddering halt/mechanical glitch in keeping with the futuristic theme

<div align="right"><a style="text-align:right" href="#top">Go to index :arrow_double_up:</a></div>

<span id="features"></span>

## Features

<span id="features-current"></span>

### Current

**1. Menu screens**

| Menu    | Description                                                                                                                                                                                                         |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Main    | Shows controls for both desktop and mobile, and briefly explains how to play                                                                                                                                        |
| Options | Sound toggle, walls toggle and choice of slow, medium or fast game speed                                                                                                                                            |
| Scores  | Shows the five top scores of the session plus some light-hearted encouragement based on the most recent score. If the last score was in the top five then a subtle animation effect indicates where the score ranks |

**2. Accessible layout**

- In portrait mode the canvas is pushed to the top of the screen so that players do not obscure the view of the game with their fingers, while in landscape mode the canvas is centred to allow for a two-thumbed control style either side of the canvas
- The game has been designed to always fit within a single screen, no matter its size or the menu content, to give the feeling of a standalone application. There should never be an occasion where the player has to scroll or zoom, and for this reason these features have been disabled
- The menu buttons allow any menu to be accessed with just one click/tap. They always appear in the same position to give a physicality to the menu, and to prevent the player from having to reposition their cursor/finger

**3. Responsive HTML canvas**

- The core game (including the current score and high score) exists entirely in an HTML canvas element and could appear as a standalone element in another environment
- Whatever the display size or screen orientation, the canvas adapts instantly to fill the maximum possible screen area while preserving its resolution and aspect ratio. This extends not just to the size of the snake and food, but to the font-size of the scoreboard and to the size, velocity and gravity of particle effects

**4. Responsive/intuitive input**

- The game can be controlled with either a keyboard (and mouse) or touch-screen swipe gestures, using just one hand
- Player input responses are crisp and reliable at any game speed, thanks to directional changes being passed through a validator
- On mobile, panning gestures (via HammerJS) are recognised across the entire screen to prevent missed gestures
- Thanks to panning gesture recognition, sharp turns can be achieved with ease, even on mobile
- The game can be paused by either hitting spacebar or tapping the screen with two fingers simultaneously. The options menu is displayed while the game is paused but only game sound can be changed. The remaining options are still visible but appear disabled. This allows players to mute the game if they wish, but prevents them from 'cheating' by changing other settings mid-game and from possibly becoming confused by an 'extra' menu
- On desktop a new game can intuitively be started from the scores menu by pressing spacebar
- When the game loses focus (e.g. when the player clicks on another browsing tab or switches apps), it pauses to prevent a frustrating end to the game

**5. Playstyles**

A good mobile game caters to both casual and more engaged playstyles. The three game speeds should cater to all types of players, with the option to turn on walls providing an additional challenge and a more traditional Snake experience

**6. Game personality**

- In order to inject some personality in keeping with games from the 90s, text feedback is given to the player based on how well the game deems they have performed. This is a collection of around 30 comments (which appear in various combinations on the scores menu) intended to amuse, encourage and ridicule players as they attempt to beat their high score
- This approach was adopted rather than relying on dramatic music/audio or flashy visuals, with the aim of keeping players intruiged by what the game might say on reaching the next score milestone. The intended effect is that the game is judging the player's performance, giving them an incentive to prove it wrong

**7. Visual effects**

This is what the phrase "and the messier things become", refers to on the main menu screen. A simple physics particle effect showers the game board with multi-coloured sparks each time food is eaten. As more food is eaten, the number and velocity of sparks increases until the screen is awash with colour. This serves as both a reward for good play and, in the later stages, a pleasant distraction from the job at hand. The colour of the sparks matches that of the food eaten, which helps to suggest that the food has been destroyed ('gibbed', if you will).

**8. Audio**

The Web Audio API (via HowlerJS) provides reliable, lag-free sound effects on all devices.

**9. Statistics saved to local storage**

High scores (and other stats such as games played, total play time, total points scored) are saved to the device's local storage and will remain between game sessions, providing cookies are not deleted. This is a fundamental feature for giving players a reason to return.

**10. Object Oriented Programming**

To improve the syntax of the code, Object Oriented Programming has been used as far as possible. The game is built with the following objects:

| Object     | Role                                                                                                                        |
| :--------- | :-------------------------------------------------------------------------------------------------------------------------- |
| Gameboard  | Handles the canvas and its resizing                                                                                         |
| Snake      | Constructor to handle the snake's location, trajectory and size                                                             |
| Food       | Constructor to handle the food's location                                                                                   |
| Spark      | Constructor to handle spark generation and randomisation (separate functions handle the spark array population and updates) |
| Game       | Handles game state changes, DOM element styling, game settings, collision detection, move validity and updates              |
| Stopwatch  | Handles game time played (used only for stats updates)                                                                      |
| Stats      | Handles local storage of statistics                                                                                         |
| Scoreboard | Handles session scores and the score award text passed to the DOM                                                           |

**11. Customisation**

Rather than being hard-coded, visual and gameplay variables have been extracted to facilitate tweaks to the look and feel of the game. This enables much easier customisation on the developer's part.

<span id="features-future"></span>

### Future

**Improved score-keeping system**

- Recording walls on/off and game speed alongside scores. After all, 200 points on slow with no walls is less of an achievement than 200 on fast with walls enabled

**Online leaderboard**

- A global/regional leaderboard to give a true sense of competition

**Gameplay modes/customisation**

- Special food changing playstyle - e.g. speed, points multiplier, extra food objects, altering size of snake body
- Different game modes - e.g. obstacles within the play area, a maze
- Graphical options - e.g. choice of snake colour, themes, particle effects

<div align="right"><a style="text-align:right" href="#top">Go to index :arrow_double_up:</a></div>

<span id="technologies"></span>

## Technologies Used

### Languages

- HTML
- CSS
- Javascript
  - [HammerJS](https://hammerjs.github.io/) - mobile gesture recognition for responsive controls
  - [HowlerJS](https://howlerjs.com/) - handling of audio elements using Web Audio API

### Project management

- [Balsamiq](https://balsamiq.com/wireframes/) - Wireframe creation tool
- [GitHub](https://github.com/) - Version control and deployment
- [GitPod](https://gitpod.io/) - IDE used to code the game

### Style and theme

- [Autoprefixer](https://autoprefixer.github.io/) - a PostCSS plugin which parses CSS and adds vendor prefixes
- [Favicon & App Icon Generator](https://www.favicon-generator.org/) - to generate the game's favicons for a variety of devices
- [Google Fonts](https://fonts.google.com/) - Orbitron
- [Colorswall](https://colorswall.com/palette/360/) - Crayola fluorescent color palette

### Online resources

- [FreeConvert](https://www.freeconvert.com/) - to convert audio file types
- [Am I Responsive?](http://ami.responsivedesign.is/) - to produce the README showcase image

<div align="right"><a style="text-align:right" href="#top">Go to index :arrow_double_up:</a></div>

<span id="testing"></span>

## Testing

<span id="testing-auto"></span>

### Automated testing

[Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools) - audit summary for both desktop and mobile:

- Performance: **96-99%**
- Accessibility: **100%**
- Best Practices: **100%**
- SEO: **100%**

[W3C - HTML](https://validator.w3.org/) - 0 errors, 0 warnings - **PASS**

[W3C - CSS](https://jigsaw.w3.org/css-validator/) - 0 errors, 62 warnings - **PASS**

- Unknown vendor prefixes
- Use of `pointer-events: auto`

[CSS Lint](http://csslint.net/) - 0 errors, 29 warnings - **PASS**

- Use of `box-sizing`
- Use of IDs in selectors
- Use of `!important` (to ensure `display: none` applied on DOM elements)
- Use of `place-content`
- Too many `font-size` declarations (mostly media queries)


[Unicorn revealer - overflow](https://chrome.google.com/webstore/detail/unicorn-revealer/lmlkphhdlngaicolpmaakfmhplagoaln/related) - no evidence of overflow - **PASS**

[JS Hint](https://jshint.com/) - 0 errors, 8 warnings - **PASS**

- `use strict` outside of a function
- `Hammer` not defined
- `Howl` not defined

<span id="testing-manual"></span>

### Manual testing

**Summary**:

Countless hours were spent testing Cyber Snake throughout its development, which is either a testament to the quality of the game or the bloody-mindedness of its creator. Over several thousand games, the following scenarios were successfully tested:

**1. Snake behaviour**

- The snake moves in the expected direction, staying the same size if it has not eaten any food
- On eating food the snake grows by one segment

**2. Food behaviour**

- Food always spawns within the game board boundaries at a random location and with a random colour from the `colorArray`
- Food will respawn if it appears within the body of the snake

**3. Spark behaviour**

- Sparks spawn where food is eaten and travel in the direction that the snake is moving when it hits
- Sparks spawn with the colour of the food the snake eats
- Spawned sparks will not exceed the maximum number allowed (150) per `sparkArray` repopulation
- Sparks bounce off the left, right and bottom border and do not clip into borders
- Each spark spawns with a random size, direction, velocity and gravity (within set ranges)
- As a spark falls, its gravity (and therefore speed) increases
- When a spark collides with the left, right or bottom border, its speed decreases as friction is applied
- After colliding with a border, each spark's time to live decreases, along with its opacity until it disappears (and is removed from the `sparkArray`)

**4. Collision detection**

- The game ends when the snake collides with itself or a wall (if enabled)
- Food respawns and points increase when eaten
- Whatever the viewport (and therefore canvas) dimensions are, collision detection remains accurate and the snake never passes through food without eating it

**5. Move validation**

It is impossible for the snake to 'go back on itself' or to 'eat its own neck' by rapidly attempting to change direction, no matter how slow the game speed is set. For example, if moving left and changing direction to up, the direction cannot be changed to right before the snake has first moved one tile upwards.

**6. Score & score board**

- Each time food is eaten, the score increments by the correct amount (1) and is displayed on the canvas score area
- The locally stored high score is successfully updated in real time and when the current score exceeds the previous high score, both the current score and high score increase incrementally
- On gameover the score is added to the score board if it is in the top five scores for the session, and has the blink css style added to it

**7. Stats system and Score awards text**

Exhaustive testing was carried out to ensure that this system was robust. This involved wiping local storage and checking the various conditionals were working:

- The stats collected and saved to local storage (games this session, games all time, last game length, total game length, points all time) are accurate and successfully passed into the score awards text
- On game over, conditional clauses correctly rewrite HTML or append text based on numerous eventualities (score range, new high score, game length, games played, milestone previously hit, walls enabled, game speed, previous score, difference between scores)

**8. Gameplay options**

- When walls are disabled, the game border is the correct colour (green) and the snake can pass through each wall (top, bottom, left, right) to reappear on the opposite side of the board without the game ending
- When walls are enabled, the game border is the correct colour (red) and the game ends when the snake hits any wall
- The three game speed options (slow, medium, fast) each alter the speed of the game as expected

**9. Options choices**

- Each option (sound toggle, walls toggle, game speed) has the expected effect on the game from the relevant state (gameover, pause)
- The options disabled during the pause state (toggle walls, game speed) cannot be changed

**10. Event listeners**

- Keyboard handler: each key (arrow keys, spacebar) performs the correct action (up, down, left, right, pause, resume, new game) from the relevant game states (play, pause, gameover)
- Hammer manager: each gesture (pan, two-finger tap) performs the correct action (up, down, left, right, pause, resume) from the relevant game states (play, pause)
- Resize / orientation change: both events correctly resize the game board and assets
- Window loses focus: on switching windows or applications during a game, the game pauses and can be resumed by clicking the resume button
- Menu selection: each button element (play, resume, main menu, options menu, scores menu) shows and hides the correct modal elements (heading, menu-content, buttons) when clicked
- Menu sound: button elements play the correct sound when clicked (play has no audio attached to it)

<span id="testing-responsive"></span>

### Responsiveness

The aim was to make a game which felt like a standalone app, but which would display in the browser and not force a particular orientation on the player. It was a challenge to achieve this without using some practices which are frowned upon in mobile web development, however they were necessary to achieve said goals.

To overcome the limitations of the mobile browser, a feature of HammerJS has been exploited via `prevent_default: true, touchAction: "none"` and used on `body` so that scrolling or clicking on DOM elements is not possible. Additionally, `pointer-events: none` is used on `game-container` to prevent accidental zooming in on elements when playing on mobile, which happens very frequently on iOS Safari.

`em` units have been used throughout the style sheet (apart from in the `glow` heading class), and incremented in media queries.

There may be some devices which cannot fit the content on screen and as a result push the menu buttons too close to the bottom, however no examples came up in real-world or dev-tools testing.

#### Browsers

Tested on:

- Chrome
- Edge
- Firefox
- Safari (iOS)

#### Screen sizes

Tested with Chrome DevTools using profiles for:

- Moto G4
- Galaxy S5
- Pixel 2
- Pixel 2 XL
- iPhone 5 SE
- iPhone 6/7/8
- iPhone 6/7/8 Plus
- iPhone X
- iPad
- iPad Pro

... and also using the responsive profiles of:

- Mobile S (320px)
- Mobile M (375px)
- Mobile L (425px)
- Tablet (768px)
- Laptop (1024px)
- Laptop L (1440px)

Real world testing on:

- iPhone 6S
- iPhone 11 Pro
- Asus ZenBook
- Dell XPS 7590

### Issues and resolutions

<span id="testing-resolved"></span>

#### Resolved

**Multiple key presses cause the game to end**

- This was due to rapid directional changes allowing the snake to 'bite its own neck', its head colliding with `snake.array[1]` e.g. when moving left and the direction changed to up and then right before the game had completed the up move. Simply preventing a change to the opposite direction was not sufficient
- The initial solution was to implement a 'safe delay' which prevented the keyboard event handler from firing more quickly than the game refresh rate. While this was an improvement, the issue would still appear too frequently unless the safe delay was so long that it detrimental to the input responsiveness, and furthermore made the game speed option nearly impossible to implement
- This issue was resolved by adding direction change validation at each refresh interval. To do this relatively succinctly, each direction has been given a numerical value so that it can be easily negated during the check, and then the last direction moved must be calculated. The last move is calculated by comparing the `snake.array.x` or `snake.array.y` of the head and first segment of the snake. A move is valid when the last move is NOT equal to the negated new direction e.g. if the last snake move was left (-1), and the requested direction is down (+2), the move will be valid, however if the requested direction is right (+1) then the move is invalid and the event handler will not fire
- While in the middle of the board the difference between `snake.array[0]` and `snake.array[1]` will always be `+/-tile`, however further calculations are necessary to ensure the last move is calculated properly while the snake crosses a border

**Canvas resizing causes collision detection issues**

- To make the game as responsive as possible the canvas needs to be resized depending on the screen space available. If using a set canvas size and relying on CSS to fill the space there are issues with the image resolution when it is much different from the set canvas size
- Game collisions between snake, food and walls are detected when their coordinates are _equal_ to one another. If these coordinates are multiplied up/down then it is very unlikely a collision will ever be detected as the coordinates will mostly be floating numbers
- To solve this the `gameBoard` object has four key functions:
  - `checkOrientation`
  - `setCanvasSize` checks that the canvas height is divisible by the total number of tiles along the y axis and, if not, reduces the canvas height until it is and sets the canvas width accordingly
  - `setTileSize` uses the canvas width and set number of tiles to calculate
  - `recalculateAssets` uses the former sizes and coordinates of game pieces and multiplies them up by the new tile size calculated using the three other key functions
- As a result, the `gameBoard` object can control the coordinates of the various game pieces and ensure they are within safe ranges for the `game` object to detect collisions

**Spark gravity and velocity not scaling to canvas size**

- With all game objects now responsive to the available viewport, a new issue arose whereby sparks would fall very quickly on a small screen and very slowly on a large screen. This was due to using static gravity and velocity variables
- To resolve this, the `dynamicOutput` function was written to adjust both spark gravity and velocity by multiplying the dynamic tile size (from `setTileSize`) by a set ratio (`tileToSparkGravityRatio` or `initialTileToSparkDRatio`)
- To add a sense of progression/achievement for the player, the `tileToSparkDRatio` increases by `tileToSparkDRatioIncrement` every time food is eaten
- To add some randomness to spark behaviour, `dynmicSparkGravityMultiplier` and `dynamicOutputMultiplier` increase the upper ranges of these random calculations

**Game time played not taking pause into account**

- Discovered after leaving a game paused for several hours and returning to see a surprising message on game over, it was clear that using `Date.now()` on start and end of game was not the best way of recording each game's length
- This was resolved by adding the `stopWatch` object and starting its timer on `game.play()`, stopping on `game.stop()` and resetting on `newGame()`

**Audio not working on iOS**

- Initially used `<audio>` HTML element to play game audio, which worked fine on desktop but had lots of issues on iOS Safari - most noticably a lag in the sounds being played
- The HowlerJS library was used to handle Web Audio API and allowed sounds to be played perfectly on iOS
- The iOS 14 update introduced a new issue with sound on iOS Safari causing a play error. This was resolved by changing the audio file types from wav to webm, with mp3 used as a fallback. This appears to have again resolved the issue and greatly reduced the file size of the game

<span id="testing-unresolved"></span>

#### Unresolved

- **Square viewports**

On displays where the ratio between viewport width and height is 1.0 - 1.1, the `canvas` will exceed the viewable area and a scroll bar will appear.

- **Loss of sound**

When the game is minimised on iOS Safari, sound effects may no longer play when focus is regained.

<div align="right"><a style="text-align:right" href="#top">Go to index :arrow_double_up:</a></div>

<span id="deployment"></span>

## Deployment

There is just one branch of this project (master) and the deployed version of this site is the most current version in the repository.

### How to deploy

To deploy this page to GitHub Pages from its [GitHub repository](https://github.com/Edb83/snake), the following steps were taken:

1. From the menu items near the top of the page, select **Settings**
2. Scroll down to the **GitHub Pages** section
3. Under **Source** click the drop-down menu labelled **None** and select **Master Branch**
4. On selecting Master Branch the page will be automatically refreshed and the website is now deployed
5. Scroll back down to the **GitHub Pages** section in **Settings** to retrieve the link to the deployed website. It may take a short time to go live, but typically less than 60 seconds

### How to run locally

To clone this project from GitHub:

1. Under the repository name, click **Clone or download**
2. In the **Clone with HTTPs** section, copy the clone URL for the repository
3. In your local IDE open Git Bash
4. Change the current working directory to the location where you want the cloned directory to be made
5. Type `git clone`, and then paste the URL you copied in Step 2

```console
git clone https://github.com/Edb83/snake.git
```

6. Press Enter. Your local clone will be created

Further reading and troubleshooting on cloning a repository from GitHub can be found [here](https://help.github.com/en/articles/cloning-a-repository).

<div align="right"><a style="text-align:right" href="#top">Go to index :arrow_double_up:</a></div>

<span id="credits"></span>

## Credits

#### Tutorials and inspiration

- [Youtube: Code The Snake Game Using JavaScript and HTML5](https://youtu.be/9TcU2C1AACw)
- [Chris Courses: Canvas for beginners](https://chriscourses.com/courses/canvas-for-beginners/resizing) - really excellent canvas and OOP tutorials
- [Mozilla: Canvas and game tutorial](https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Create_the_Canvas_and_draw_on_it)
- [Mozilla: Handling game loops](https://developer.mozilla.org/en-US/docs/Games/Anatomy)
- [Mozilla: Arrow functions and 'this'](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#No_separate_this)
- [W3 Schools: Canvas game tutorial](https://www.w3schools.com/graphics/game_canvas.asp)
- [CSS Tricks: Centering CCS Complete Guide](https://css-tricks.com/centering-css-complete-guide/)
- [W3C: Attribute selectors](https://drafts.csswg.org/selectors-3/#attribute-selectors)

#### Code used/modified from other sources

(also referenced within code files)

- [Random number between (min, max)](https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript)
- [Seconds to hours/minutes/seconds convertor](https://stackoverflow.com/questions/37096367/how-to-convert-seconds-to-minutes-and-hours-in-javascript/37096923)
- [Sorting arrays](https://www.javascripttutorial.net/javascript-array-sort/)
- [Dynamic canvas font size](https://stackoverflow.com/questions/22943186/html5-canvas-font-size-based-on-canvas-size)
- [Simple stopwatch](https://code-boxx.com/simple-javascript-stopwatch/)
- [Glowing text](https://www.w3schools.com/howto/howto_css_glowing_text.asp)
- [Checkbox restyling](https://dev.to/proticm/styling-html-checkboxes-is-super-easy-302o)
- [Pointer events](https://css-tricks.com/almanac/properties/p/pointer-events/)

### Content

- All text within the game is original content
- The Deployment section was based on Richard Wells' README.md ([Source](https://github.com/D0nni387/Luxury-Door-Solutions/blob/master/README.md))
- Audio files sourced from [Freesound.org](https://freesound.org/home/):
  - Menu click [tahutoa](https://freesound.org/people/tahutoa/)
  - Eat sound [jalastram](https://freesound.org/people/jalastram/)
  - Gameover [jalastram](https://freesound.org/people/jalastram/)

### Acknowledgements

- Jonathan Munz (Code Institute Mentor) - for his reassurance, support and invaluable suggestions

- Bim Williams (Code Institute Alumnus) - for taking the time to help on Slack

- Robin Zigmond (Code Institute Alumnus) - specifically for pointers on arrow functions and `this`

### Disclaimer

This game was developed for educational purposes.

<div align="right"><a style="text-align:right" href="#top">Go to index :arrow_double_up:</a></div>
