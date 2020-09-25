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
    let scoreAwardText = document.getElementById("scores-award-text"); // the DOM wrapper
    let text; // the text used in scoreAwardText
    let shouldReplace; // if true, rewrites all HTML in scoreAwardText rather than adding to end
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

    if (isNaN(this.currentHighScore) && this.currentScore !== 0) {
      shouldReplace = true;
      text = `<p>You're off the mark, so to speak.</p>`;
    }
    if (isNewHighScore()) {
      shouldReplace = true;
      text = `<p>Signs of improvement. You beat your previous high score by ${
        this.currentScore - this.currentHighScore
      }.</p>`;
    }
    if (this.currentScore === 0) {
      shouldReplace = true;
      text = `<p>Oof.</p>`;
    }
    if (scoreRange(1, 4)) {
      shouldReplace = false;
      text = `${this.currentScore} is a fantastic score. `;
    }
    if (scoreRange(5, 9)) {
      shouldReplace = false;
      text = `Lamentably, the Galactic High Scores feature has yet to be implemented. `;
    }
    if (
      scoreRange(5, 9) &&
      !isNewHighScore() &&
      game.speed === fast &&
      game.wallsEnabled
    ) {
      shouldReplace = true;
      text = `<p>'Fast' and 'Walls' was a brave choice. Know your limits.</p>`;
    }
    if (scoreRange(10, 19) && this.currentScore !== 13) {
      shouldReplace = false;
      text = `Double digits. Magnificent. `;
    }
    if (
      this.currentScore === 13 &&
      this.currentScore <= this.currentHighScore
    ) {
      shouldReplace = false;
      text = `If the cyberophidiophobia doesn't get you, the triskaidekaphobia will. `;
    }
    if (scoreRange(20, 29)) {
      shouldReplace = false;
      text = `Over-promise, under-deliver. `;
    }
    if (scoreRange(20, 29) && stats.gamesPlayedAllTime > 100) {
      shouldReplace = true;
      text = `<p>They say practice makes perfect, and yet... here you are on attempt #${stats.gamesPlayedAllTime}.`;
    }
    if (scoreRange(30, 39) && game.speed === slow) {
      shouldReplace = false;
      text = `FYI this is Cyber Snake, not Cyber Slow Worm. `;
    }
    if (scoreRange(30, 39)) {
      shouldReplace = false;
      text = `Thrifty with the thrills, frugal with the skills. `;
    }
    if (scoreRange(40, 49)) {
      shouldReplace = false;
      text = `It only took you ${convertSecondsToHms(
        stats.gameTimeInSeconds
      )} to disappoint on this occasion. `;
    }
    if (scoreRange(50, 59)) {
      shouldReplace = false;
      text = `Maybe getting to 50 was good enough for you. `;
    }
    if (scoreRange(60, 69)) {
      shouldReplace = false;
      text = `This is what cybernetic dreams are made of. `;
    }
    if (scoreRange(70, 79)) {
      shouldReplace = false;
      text = `"I was distracted by the pretty colors!", you wail. `;
    }
    if (scoreRange(80, 89)) {
      shouldReplace = false;
      text = `Next time, have a vague strategy. `;
    }
    if (scoreRange(90, 99)) {
      shouldReplace = false;
      text = `Did you consider persevering and making it to 100? `;
    }
    if (this.currentScore > 100 && !this.hasHitMilestone) {
      shouldReplace = true;
      text = `<p>That's quite the milestone you've hit.</p><p>And it only took you ${stats.gamesPlayedAllTime} attempts!</p>`;
    } else if (scoreRange(100, 124)) {
      shouldReplace = false;
      text = `In total you have smashed ${stats.pointsAllTime} blobs to smithereens. The Nanite Narwhal would be proud. `;
    }
    if (scoreRange(125, 149)) {
      shouldReplace = false;
      text = `Your average score per game is decidedly average: ${(
        stats.pointsAllTime / stats.gamesPlayedAllTime
      ).toFixed(2)}. `;
    }
    if (scoreRange(150, 199)) {
      shouldReplace = false;
      text = `The Digital Mongoose has been informed of your progress. `;
    }
    if (scoreRange(200, 299)) {
      shouldReplace = false;
      text = `<p>If not for your epic score of ${this.previousScore} last time, some might call shenanigans.</p>`;
    }
    if (scoreRange(300, 396)) {
      shouldReplace = true;
      text = `<p>Your commitment is admirable but your time (all ${convertSecondsToHms(
        stats.gameTimeAllTime
      )} of it), irretrievable.</p>`;
    }
    if (this.currentScore == 397) {
      shouldReplace = true;
      text = `<p>Congratulations. You have completed the tutorial of Cyber Snake.</p><p>In Level 001 the food is invisible. You have 3 lives remaining.</p><p>Good luck.</p>`;
    }
    if (this.currentScore > 397) {
      shouldReplace = true;
      text = `Is that even possible? `;
    }
    if (this.currentScore === this.previousScore && this.currentScore !== 0) {
      shouldReplace = true;
      text = `Oops you did it again. `;
    }
    if (
      isNewHighScore() &&
      this.currentScore - this.currentHighScore <= 5 &&
      stats.gameTimeInSeconds > 300
    ) {
      shouldReplace = true;
      text = `<p>${convertSecondsToHms(
        stats.gameTimeInSeconds
      )} to add a measly ${
        this.currentScore - this.currentHighScore
      } to your PB.</p><p>Yikes.</p>`;
    }
    if (this.currentScore > this.previousScore && this.previousScore === 0) {
      shouldReplace = true;
      text = `<p>Well, anything was an improvement on last time. </p>`;
    }
    if (this.previousScore - this.currentScore > 50) {
      shouldReplace = false;
      text = `<p>Try to remember what you did on your previous attempt. That was better.</p>`;
    }

    // This puts together the results of conditionals above - either rewriting HTML or adding to what's already there
    if (shouldReplace) {
      scoreAwardText.innerHTML = text;
    } else {
      scoreAwardText.insertAdjacentHTML("beforeend", text);
    }

    // Scores underneath award text
    let scoreOl = document.querySelector("ol");
    scoreOl.innerHTML = ""; // start with a clean slate
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
