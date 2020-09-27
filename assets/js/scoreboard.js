let scoreBoard = {
  array: [],
  previousScore: undefined,
  currentScore: undefined,
  currentHighScore: undefined,
  hasHitMilestone: false,
  update() {
    if (this.array.includes(this.currentScore) || this.currentScore === 0) {
      return;
    } else {
      this.array.push(this.currentScore);
      //   https://www.javascripttutorial.net/javascript-array-sort/
      this.array.sort((a, b) => b - a);
    }
  },
  getCurrentHighScore() {
    this.currentHighScore = parseInt(localStorage.getItem("highScore"));
    if (this.currentHighScore >= 100) {
      this.hasHitMilestone = true;
    }
  },
  updateHighScore() {
    if (this.currentScore > parseInt(stats.highScore)) {
      localStorage.setItem("highScore", this.currentScore);
      stats.highScore = this.currentScore;
    } else {
      return;
    }
  },
  //   https://stackoverflow.com/questions/22943186/html5-canvas-font-size-based-on-canvas-size
  getFont() {
    let fontSize = canvas.width * fontRatio;
    return (fontSize || 0) + "px Orbitron";
  },
  draw() {
    ctx.fillStyle = scoreBoardTextColor;
    ctx.font = this.getFont();
    ctx.fillText(
      this.currentScore,
      tile,
      (tile / 2) * heightOfScoreBoardInTiles + tile / 2
    );
    ctx.fillText(
      `High score: ${stats.highScore}`,
      canvas.width * 0.45,
      (tile / 2) * heightOfScoreBoardInTiles + tile / 2
    );
  },
  print() {
    //   Score award text
    let scoreAwardText = document.getElementById("scores-award-text");
    scoreAwardText.innerHTML = "";

    let scoreRange = (min, max) => {
      if (this.currentScore >= min && this.currentScore < max + 1) {
        return true;
      }
    };
    let isNewHighScore = () => {
      if (this.currentScore > this.currentHighScore) {
        return true;
      }
    };
    let content = (text, replaceExistingText) => {
        // Determines whether text is written from scratch or added to existing text
      if (replaceExistingText) {
        scoreAwardText.innerHTML = `<p>${text}</p>`;
      } else {
        scoreAwardText.insertAdjacentHTML("beforeend", text);
      }
    };

    if (isNaN(this.currentHighScore) && this.currentScore !== 0) {
      content(`You're off the mark, so to speak. `, true);
    }
    if (isNewHighScore()) {
      content(
        `Signs of improvement. You beat your previous high score by ${
          this.currentScore - this.currentHighScore
        }. `,
        true
      );
    }
    if (this.currentScore === 0) {
      content(`Oof.`, true);
    }
    if (scoreRange(1, 4)) {
      content(`${this.currentScore} is a fantastic score. `, false);
    }
    if (scoreRange(5, 9)) {
      content(
        `Lamentably, the Galactic High Scores feature has yet to be implemented. `,
        false
      );
    }
    if (
      scoreRange(5, 9) &&
      !isNewHighScore() &&
      game.speed === fast &&
      game.wallsEnabled
    ) {
      content(
        `'Fast' and 'Walls' was a brave choice. Know your limits. `,
        true
      );
    }
    if (scoreRange(10, 19) && this.currentScore !== 13) {
      content(`Double digits. Magnificent. `, false);
    }
    if (
      this.currentScore === 13 &&
      this.currentScore <= this.currentHighScore
    ) {
      content(
        `If the cyberophidiophobia doesn't get you, the triskaidekaphobia will. `,
        false
      );
    }
    if (scoreRange(20, 29)) {
      content(`Over-promise, under-deliver. `, false);
    }
    if (scoreRange(20, 29) && stats.gamesPlayedAllTime > 100) {
      content(
        `They say practice makes perfect, and yet... here you are on attempt #${stats.gamesPlayedAllTime}. `,
        true
      );
    }
    if (scoreRange(30, 39) && game.speed === slow) {
      content(`FYI this is Cyber Snake, not Cyber Slow Worm. `, false);
    }
    if (scoreRange(30, 39)) {
      content(
        `Thrifty with the thrills, frugal with the skills. `,
        false
      );
    }
    if (scoreRange(40, 49)) {
      content(
        `It only took you ${convertSecondsToHms(
          stats.gameTimeInSeconds
        )} to disappoint on this occasion. `,
        false
      );
    }
    if (scoreRange(50, 59)) {
      content(`Maybe getting to 50 was good enough for you. `, false);
    }
    if (scoreRange(60, 69)) {
      content(`This is what cybernetic dreams are made of. `, false);
    }
    if (scoreRange(70, 79)) {
      content(
        `"I was distracted by the pretty colors!", you wail. `,
        false
      );
    }
    if (scoreRange(80, 89)) {
      content(`Next time, have a vague strategy. `, false);
    }
    if (scoreRange(90, 99)) {
      content(
        `Did you consider persevering and making it to 100? `,
        false
      );
    }
    if (this.currentScore >= 100 && !this.hasHitMilestone) {
      content(
        `That's quite the milestone you've hit. And it only took you ${stats.gamesPlayedAllTime} attempts! `,
        true
      );
    } else if (scoreRange(100, 124)) {
      content(
        `In total you have smashed ${stats.pointsAllTime} blobs to smithereens. The Nanite Narwhal would be proud. `,
        true
      );
    }
    if (scoreRange(125, 149)) {
      content(
        `Your average score per game is decidedly average: ${(
          stats.pointsAllTime / stats.gamesPlayedAllTime
        ).toFixed(2)}. `,
        false
      );
    }
    if (scoreRange(150, 199)) {
      content(
        `The Digital Mongoose has been informed of your progress. `,
        false
      );
    }
    if (scoreRange(200, 299)) {
      content(
        `If not for your epic score of ${this.previousScore} last time, some might call shenanigans. `,
        false
      );
    }
    if (scoreRange(300, 396)) {
      content(
        `Your commitment is admirable but your time (all ${convertSecondsToHms(
          stats.gameTimeAllTime
        )} of it), irretrievable. `,
        true
      );
    }
    if (this.currentScore == 397) {
      content(
        `Congratulations. You have completed the tutorial of Cyber Snake. In Level 001 the food is invisible. You have 3 lives remaining. Good luck. `,
        true
      );
    }
    if (this.currentScore > 397) {
      content(`Is that even possible? `, true);
    }
    if (this.currentScore === this.previousScore && this.currentScore !== 0) {
      content(`Oops you did it again. `, true);
    }
    if (
      isNewHighScore() &&
      this.currentScore - this.currentHighScore <= 5 &&
      stats.gameTimeInSeconds > 300
    ) {
      content(
        `${convertSecondsToHms(stats.gameTimeInSeconds)} to add a measly ${
          this.currentScore - this.currentHighScore
        } to your PB. Yikes. `,
        true
      );
    }
    if (this.currentScore > this.previousScore && this.previousScore === 0) {
      content(
        `Well, anything was an improvement on last time. `,
        true
      );
    }
    if (this.previousScore - this.currentScore > 50) {
      content(
        `Try to remember what you did on your previous attempt. That was better. `,
        false
      );
    }

    // Scores
    let scoreOl = document.querySelector("ol");
    scoreOl.innerHTML = "";
    for (let i = 0; i < 5; i++) {
      let newScoreLi = document.createElement("li");
      newScoreLi.textContent = this.array[i];
      scoreOl.appendChild(newScoreLi);
    }
    let scoreLi = document.querySelectorAll("li");
    for (let i = 0; i < scoreLi.length; i++) {
      if (
        scoreLi[i].textContent == this.currentScore &&
        this.currentScore != 0
      ) {
        scoreLi[i].classList.add("blinking");
      }
    }
  },
};
