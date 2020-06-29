

Drawing canvas:
https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Create_the_Canvas_and_draw_on_it

Detecting keypresses:
https://stackoverflow.com/questions/5597060/detecting-arrow-key-presses-in-javascript

BUG: rapid pressing of direction keys results in snake eating itself
    tried:  setInterval on event listener
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

Layered canvases (could use this):
https://html5.litten.com/using-multiple-html5-canvases-as-layers/


Sorting scores:
https://www.javascripttutorial.net/javascript-array-sort/

Guidance on how to handle game loops:
https://developer.mozilla.org/en-US/docs/Games/Anatomy

Preventing setInterval repeating on game restart:
https://stackoverflow.com/questions/29836686/code-in-setinterval-executing-more-than-once

Random int (min, max):
https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript

