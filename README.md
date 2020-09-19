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
  - <a href="#testing-bugs">Known bugs</a>
- <a href="#deployment">Deployment</a>
- <a href="#credits">Credits</a>

---

<span id="context"></span>

## Context

Cyber Snake is an homage to the Nokia version of the game, which many of us will remember fondly from the advent of mobile gaming. While Nokia's monochrome version wasn't released until 1998, the Snake game concept dates back to 1976 when [Blockade](<https://en.wikipedia.org/wiki/Blockade_(video_game)>) first appeared in arcades. Since then, there have been hundreds of versions released, and for good reason. It is considered a classic in terms of design and even appears in New York's Museum of Modern Art alongside the likes of Minecraft, Pong and Tetris.

This version offers classic Snake gameplay, a clean interface, satisfying graphical feedback, and the kind of 'personality' typified by games of the 90s. If you feel any pangs of nostalgia then it has achieved its aim!

The game concept is simple:

 - Guide your snake by changing its direction up, down, left or right in order to eat as many food blobs as you can
 - Every time you eat some food you score one point, your snake grows by one segment and a new food spawns in a random location
 - The game ends when your snake's head collides with its body or, if walls are enabled, you hit a wall.

<div align="right"><a style="text-align:right" href="#top">Go to index :arrow_double_up:</a></div>
<span id="ux"></span>

## UX

<span id="ux-overview"></span>

### Overview

The game has been designed wih a motbile-first philosophy, with no 'fluff' to distract players from having some fun. All design decisions have been made with the following goals in mind:

- Mobile-first
- Simplicity
- Easy navigation
- Crisp controls
- Satisfying feedback
- Replayability

<span id="ux-stories"></span>

### User stories

<!-- For ease of reference, the means by which a user's expectations have been met are summarised in the tables below:

| As a **site owner** I want                                   | How this is achieved                                                                                                    |
| :----------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| To be able to customise the look and feel of the game easily | Core variables can be manipulated easily to change both look and feel, e.g. colors, particle physics, speed, board size |

| As a **user** I want                                                          | How this is achieved                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :---------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| To know how well I am doing                                                   | During play, the only information available is the current score and the all-time high score for the device/browser. The session scoreboard shows the five most recent scores since the browser was opened, while the all-time high score is saved to local storage. Assuming cookies are not deleted, players can return to try to beat their previous high-score. On the gameover/scores screen a message is displayed based on the most recent (and even previous) performance, offering words of 'encouragement'. |
| To have some gameplay options                                                 | Players can choose from three speed settings (slow, medium, fast) for very different playing experiences. Additionally, enabling walls provides a more classic style of gameplay and doubles up as a 'hard mode'.                                                                                                                                                                                                                                                                                                     |
| Satisfying visual feedback                                                    | A simple particle effect system showers the game board with multi-coloured sparks each time food is eaten. As more food is eaten, the number and velocity of sparks increases until the screen is awash with colour. This serves as both a reward for good play and in the later stages a pleasant distraction from the job at hand.                                                                                                                                                                                  |
| To have a reason to keep playing                                              | Beyond beating highscores (which are saved to local storage), there are increasing particle effects for scoring higher and a catty 'commentary' at gameover, with a number of possible outcomes.                                                                                                                                                                                                                                                                                                                      |
| To be able to play on any device with simple controls                         | Hammer js touch controls allow for responsive play on mobile, equal to (and perhaps even surpassing) the desktop control system. Both mobile and desktop can be controlled using only one hand, and the game can be paused.                                                                                                                                                                                                                                                                                           |
| A clean, uncluttered interface with all aspects of the game within easy reach | The design approach is very simple, with four possible screens: instructions, options, score and the play state. Each menu screen is just one click away from the others, however only the options screen can be accessed directly from the play state (using space bar or two-finger tap). The only options available are to toggle audio, in-game walls and game speed. Walls and game speed cannot be changed from the pause menu to prevent confusion or 'cheating'.                                              | -->

#### As a site owner I want:

- To be able to customise the look and feel of the game easily

#### As a player I want:

- To be able to jump straight into the game without needing further instructions
- A clean, uncluttered interface with all elements of the game within easy reach
- To be able to play on any device with simple, responsive controls
- To have options for both casual or more challenging gameplay
- To know how well I am doing
- Satisfying audio and visual feedback
- To have a reason to keep playing

Several individuals contributed to testing the game and provided feedback on its gameplay, responsiveness and aesthetics at various points in development.

<span id="ux-wireframes"></span>

### Wireframes

The full suite of wireframes for **desktop**, **tablet** and **mobile** devices, plus a **sitemap**, can be accessed [here](wireframes/).

Overall the wireframes were successfully converted into a functioning application, however there were some deviations from the plan. These were:

1. Statistics menu - this was intended to live on a separate menu screen but was moved entirely to the scores menu. Rather that being able to pull up a screen showing, for example, the average score per game, this information is instead provided in comments such as "Your average score per game is X" or "You have been playing for X minutes in total"

2. Advanced image manipulation - the initial idea was to have a more flashy landing screen which would respond to user mouse movements, and to have other visuals passing behind the game area during play, either using the HTML canvas or CSS animations. This feature was outside the scope of the project and would have ultimately been an unnecessary distraction if not handled elegantly

<span id="ux-design"></span>

### Design choices

Retro
Cyber
Neon

#### Colours

![#001437](https://via.placeholder.com/40/001437/000000?Text=+) #001437 (Very dark blue)


#### Fonts

<div align="right"><a style="text-align:right" href="#top">Go to index :arrow_double_up:</a></div>

<span id="features"></span>

## Features

<span id="features-current"></span>

### Current

**1. Responsive HTML canvas**

- The core game (including the current score and high score) exists entirely in an HTML canvas element and could appear as a standalone element in another environment
- Whatever the display size or screen orientation, the canvas adapts instantly to fill the maximum possible screen area while preserving its resolution and aspect ratio. This extends not just to the size of the snake and food, but to the font-size of the scoreboard and to the size, velocity and gravity of particle effects

**2. Responsive input**

- The game can be controlled with either a keyboard (and mouse) or touch-screen swipe gestures
- Player input responses are crisp and reliable at any game speed, thanks to direction changes being passed through a validator
- On mobile, swipe gestures are recognised across the entire screen to prevent missed gestures
- Thanks to panning gesture recognition, sharp turns can be achieved with ease, even on mobile
- The game can be paused by either hitting spacebar or tapping the screen with two fingers simultaneously
- On desktop a new game can intuitively be started from the scores menu by pressing spacebar 

**3. Menu screens**

- **Main**: shows controls for both desktop and mobile, and briefly explains how to play. There is also a hint of the game's 'personality', which is realised more fully on the scores screen
- **Options**: sound toggle, walls toggle and choice of slow, medium or fast game speed
   - The options menu is also displayed while the game is paused but only game sound can be changed. The remaining options are still visible but appear disabled. This allows players to mute the game if they wish, but prevents them from changing other settings mid-game and from possibly becoming confused by an 'extra' menu
- **Scores**: shows the five top scores of the session plus some light-hearted encouragement based on the most recent score. If the last score was in the top five then a subtle animation effect indicates where the score ranks

**4. Game personality**

- In order to inject some personality in keeping with games from the 90s, text feedback is given to the player based on how well the game deems they have performed. This is a collection of around 30 comments (which appear in various combinations on the scores menu) intended to amuse, encourage and ridicule players as they attempt to beat their high score
- This approach was adopted rather than relying on dramatic music/audio or flashy visuals, with the aim of keeping players intruiged by what the game might say on reaching the next score milestone. The intended effect is that the game is judging the player's performance, giving them an incentive to prove it wrong

**5. Playstyles**

- A good mobile game caters to both casual and more engaged playstyles. The various game speeds should cater to all types of players, with the option to turn on walls providing an additional challenge and a more traditional Snake experience

**6. Local high score save**

- The high score is saved to the device's local storage and will remain between game sessions, providing cookies are not deleted

**7. Accessible layout**

- In portrait mode the canvas is pushed to the top of the screen so that players do not obscure the view of the game with their fingers, while in landscape mode the canvas is centred to allow for a two-thumbed control style either side of the canvas
- The game has been designed to always fit within a single screen, no matter its size or the menu content, to give it the feeling of a standalone application. There should never be an occasion where the player has to scroll or zoom, and for this reason these features have been disabled


<span id="features-future"></span>

### Future

- Improved score-keeping system

   - Recording walls on/off and game speed alongside scores. After all, 200 points on slow with no walls is less of an achievement than 200 on fast with walls enabled

- Online leaderboard

   - A global/regional leaderboard to give a true sense of competition

- Gameplay modes/customisation

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
- [GitPod](https://gitpod.io/) - IDE used to code the site

### Style and theme

- [Autoprefixer](https://autoprefixer.github.io/) - Post CSS plugin which parses CSS and adds vendor prefixes
- [Color Scheme Designer](https://colorschemedesigner.com/csd-3.5/) - Complimentary color scheme for the site
- [Google Fonts](https://fonts.google.com/) - Orbitron

### Online resources

- [Title](https://#)

<div align="right"><a style="text-align:right" href="#top">Go to index :arrow_double_up:</a></div>

<span id="testing"></span>

## Testing

<span id="testing-auto"></span>

### Automated testing

- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools) - ran an audit for both desktop and mobile.

Summary:

- Performance = **Average**

  - Details

- Accessibility = **Good**
  - Details
- Best Practices = **Good**
  - Details
- SEO = **Good**
  - Details

Mobile scores:

- [JS Hint](https://jshint.com/) - Summary - **PASS**
- [CSS Lint](http://csslint.net/) - 0 errors, 0 warnings - **PASS**
  - Details
- [W3C - HTML](https://validator.w3.org/) - Summary - **PASS**
  - Details
- [W3C - CSS](https://jigsaw.w3.org/css-validator/) - Summary - **PASS**
  - Details
- [Unicorn revealer - overflow](https://chrome.google.com/webstore/detail/unicorn-revealer/lmlkphhdlngaicolpmaakfmhplagoaln/related) - tested all pages and no evidence of overflow - **PASS**

<span id="testing-manual"></span>

### Manual testing

**Summary**:

Text

The following scenarios were tested to ensure that the site is functioning as expected:

**1. Element 1**

- From each page
  - check zxy - **PASS**

**2. Element 2**

- From each page
  - check zxy - **PASS**

<span id="testing-responsive"></span>

### Responsiveness

The following issues arose and have each been addressed:

| Issue | Solution |
| :---- | :------- |
| Text  | Text     |

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

- **Issue**

  - Resolution

<span id="testing-unresolved"></span>

#### Unresolved

- **Issue**

  - Resolution

<span id="testing-bugs"></span>

### Known bugs

- None at present

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

Code was modified from the following sources:

- [Title](https://#)

### Content

All text within the game is original content.

The Deployment section was based on Richard Wells' README.md ([Source](https://github.com/D0nni387/Luxury-Door-Solutions/blob/master/README.md)).

### Acknowledgements

- Jonathan Munz (Code Institute Mentor) - for his sage advice, prompts to find solutions, and calm reassurances during the project

- The Code Institute Slack Community - for many tips and tricks discovered while browsing

### Disclaimer

This game was developed for educational purposes.

<div align="right"><a style="text-align:right" href="#top">Go to index :arrow_double_up:</a></div>



<!-- Drawing canvas:
https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Create_the_Canvas_and_draw_on_it

Detecting keypresses:
https://stackoverflow.com/questions/5597060/detecting-arrow-key-presses-in-javascript

BUG: rapid pressing of direction keys results in snake eating itself
tried: setInterval on event listener
setTimeout
storing keypresses in queue
measuring time since last keypress
RESOLVED: moved keydownHandler into event listener and added if statement to check time since last keypress
https://stackoverflow.com/questions/14667010/limit-how-many-times-an-event-listener-can-trigger-every-second

Sound function:
https://www.w3schools.com/graphics/game_sound.asp

Free sounds:
https://freesound.org/home/

Canvas tutorial:
https://www.youtube.com/watch?v=EO6OkltgudE&list=PLpPnRKq7eNW3We9VdCfx9fprhqXHwTPXL&index=1

Color wheel:
https://color.adobe.com/create/color-wheel

Sorting scores:
https://www.javascripttutorial.net/javascript-array-sort/

Guidance on how to handle game loops:
https://developer.mozilla.org/en-US/docs/Games/Anatomy

Preventing setInterval repeating on game restart:
https://stackoverflow.com/questions/29836686/code-in-setinterval-executing-more-than-once

Random int (min, max):
https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript

Dynamic canvas font size:
https://stackoverflow.com/questions/22943186/html5-canvas-font-size-based-on-canvas-size

Prevent scrolling on mobile:
https://stackoverflow.com/questions/10592411/disable-scrolling-in-all-mobile-devices#:~:text=document.-,body.,behaviour%20prevented%20should%20be%20scrolling.

Hammer.js:
https://hammerjs.github.io/

Glowing text:
https://www.w3schools.com/howto/howto_css_glowing_text.asp

Seconds to HMS converor:
https://stackoverflow.com/questions/37096367/how-to-convert-seconds-to-minutes-and-hours-in-javascript/37096923

Arrow functions and this:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#No_separate_this

Checkbox restyling:
https://dev.to/proticm/styling-html-checkboxes-is-super-easy-302o

Avoid clicks:
https://css-tricks.com/almanac/properties/p/pointer-events/ -->