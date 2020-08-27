let scoreBoard = {
    array: [],
    previousScore: undefined,
    currentScore: undefined,
    currentHighScore: undefined,
    highScore: parseInt(localStorage.getItem("highScore")) || 0,
    update() {
        if (this.array.includes(this.currentScore) || this.currentScore === 0) {
            return;
        }
        else {
            this.array.push(this.currentScore);
            this.array.sort((a, b) => b - a);
        }
    },
    getCurrentHighScore() {
        this.currentHighScore = parseInt(localStorage.getItem("highScore"));
    },
    updateHighScore() {
        if (this.currentScore > parseInt(this.highScore)) {
            localStorage.setItem("highScore", this.currentScore);
            this.highScore = this.currentScore;
        }
        else {
            return;
        }
    },
    resetArray() {
        this.array.length = 0;
        this.currentScore = 0;
        this.score = 0;
        this.print();
    },
    resetHighScore() {
        localStorage.removeItem("highScore");
        this.highScore = 0;
        if (stats.gamesPlayedThisSession > 0) {
            animateLoop();
        }
    },
    getFont() {
        let fontSize = canvas.width * fontRatio;
        return (fontSize || 0) + "px Orbitron";
    },
    draw() {
        ctx.fillStyle = "#fff";
        ctx.font = this.getFont();
        ctx.fillText(this.currentScore, tile, tile * 2);
        ctx.fillText(`High score: ${this.highScore}`, canvas.width * 0.45, // convert to global variable?
            tile * 2);
    },
    print() {
        let scoreAwardText = document.getElementById("score-award-text");
        scoreAwardText.innerHTML = "";
        // arrow function needed to prevent invalid reference to this.currentScore (thanks to robinz_alumni for tip)
        let scoreRange = (min, max) => {
            if (this.currentScore >= min && this.currentScore < max + 1) {
                return true;
            }
        };
        if (isNaN(this.currentHighScore) && this.currentScore !== 0) {
            scoreAwardText.innerHTML = `You're off the mark, so to speak. `;
        }
        if (this.currentScore > this.currentHighScore) {
            scoreAwardText.innerHTML = `Signs of improvement. You beat your previous high score by ${this.currentScore - this.currentHighScore}.</br>`;
        }
        if (this.currentScore === 0) {
            scoreAwardText.innerHTML = `Oof.`;
        }
        if (scoreRange(1, 4) && this.currentScore < this.currentHighScore) {
            scoreAwardText.insertAdjacentHTML("beforeend", `${this.currentScore} is a fantastic score. `);
        }
        if (scoreRange(5, 9)) {
            scoreAwardText.insertAdjacentHTML("beforeend", `Lamentably, the Galactic High Scores feature has yet to be implemented. `);
        }
        if (scoreRange(10, 19) && this.currentScore !== 13) {
            scoreAwardText.insertAdjacentHTML("beforeend", `Double digits. Mission accomplished. `);
        }
        if (this.currentScore === 13 &&
            this.currentScore <= this.currentHighScore) {
            scoreAwardText.insertAdjacentHTML("beforeend", `Unlucky for some. And you. `);
        }
        if (scoreRange(20, 29)) {
            scoreAwardText.insertAdjacentHTML("beforeend", `Attempt #${stats.gamesPlayedAllTime} and you got ${this.currentScore}. Speaks for itself. `);
        }
        if (scoreRange(30, 39)) {
            scoreAwardText.insertAdjacentHTML("beforeend", `FYI this is Cyber <em>Snake</em>, not Cyber Slow Worm. `);
        }
        if (scoreRange(40, 49)) {
            scoreAwardText.insertAdjacentHTML("beforeend", `It only took you ${convertSecondsToHms(stats.gameTimeInSeconds)} to disappoint me this time. `);
        }
        if (scoreRange(50, 59)) {
            scoreAwardText.insertAdjacentHTML("beforeend", `Maybe getting to 50 was good enough for you. `);
        }
        if (scoreRange(60, 69)) {
            scoreAwardText.insertAdjacentHTML("beforeend", `${convertSecondsToHms(stats.gameTimeInSeconds)} to score ${this.currentScore}? What a triumph. `);
        }
        if (scoreRange(70, 79)) {
            scoreAwardText.insertAdjacentHTML("beforeend", `"I was distracted by the pretty colors!", I hear you wail. `);
        }
        if (scoreRange(80, 89)) {
            scoreAwardText.insertAdjacentHTML("beforeend", `Next time, have a vague strategy. `);
        }
        if (scoreRange(90, 99)) {
            scoreAwardText.insertAdjacentHTML("beforeend", `Did you consider persevering and making it to 100? `);
        }
        if (this.currentScore >= 100 &&
            this.currentScore < 125 &&
            (this.currentHighScore < 100 || isNaN(this.currentHighScore))) {
            scoreAwardText.insertAdjacentHTML("beforeend", `That's quite the milestone you've hit.<br>And it only took you ${stats.gamesPlayedAllTime} attempts! `);
        }
        else if (scoreRange(100, 124)) {
            scoreAwardText.insertAdjacentHTML("beforeend", `Overall you have smashed ${stats.pointsAllTime} blobs to smithereens. The Nanite Narwhal would be proud. `);
        }
        if (scoreRange(125, 149)) {
            scoreAwardText.insertAdjacentHTML("beforeend", `After ${convertSecondsToHms(stats.gameTimeAllTime)} of total play time, things have clicked. `);
        }
        if (scoreRange(150, 199)) {
            scoreAwardText.insertAdjacentHTML("beforeend", `The Digital Mongoose has been informed of your progress. `);
        }
        if (scoreRange(200, 299)) {
            scoreAwardText.insertAdjacentHTML("beforeend", `Definitely cheating. `);
        }
        if (scoreRange(300, 396)) {
            scoreAwardText.insertAdjacentHTML("beforeend", `Assuming you're not cheating, I'm impressed by your commitment and sorry that you have wasted your time. `);
        }
        if (this.currentScore == 397) {
            scoreAwardText.insertAdjacentHTML("beforeend", `Congratulations.<br>You have completed the tutorial of Cyber Snake.<br>In Level 001 the food is invisible. You have 3 lives remaining.<br>Good luck. `);
        }
        if (this.currentScore > 397) {
            scoreAwardText.insertAdjacentHTML("beforeend", `Is that even possible? `);
        }
        if (this.currentScore === this.previousScore && this.currentScore !== 0) {
            scoreAwardText.innerHTML = `Oops you did it again. `;
        }
        if (this.currentScore > this.currentHighScore &&
            this.currentScore - this.currentHighScore <= 5 &&
            stats.gameTimeInSeconds > 300) {
            scoreAwardText.innerHTML = `${convertSecondsToHms(stats.gameTimeInSeconds)} to add a measly ${this.currentScore - this.currentHighScore} to your PB.<br> Yikes.`;
        }
        if (this.currentScore > this.previousScore && this.previousScore === 0) {
            scoreAwardText.innerHTML = `Well, anything was an improvement on last time. Extra credit for testing the walls out though. `;
        }
        if (this.previousScore - this.currentScore > 50) {
            scoreAwardText.insertAdjacentHTML("beforeend", `Try to remember what you did on your previous attempt. That was better. `);
        }
        let scoreOl = document.querySelector("ol");
        scoreOl.innerHTML = "";
        for (let i = 0; i < 5; i++) {
            let newScoreLi = document.createElement("li");
            newScoreLi.textContent = this.array[i];
            scoreOl.appendChild(newScoreLi);
        }
        let scoreLi = document.querySelectorAll("li");
        for (let i = 0; i < scoreLi.length; i++) {
            if (scoreLi[i].textContent == this.currentScore &&
                this.currentScore != 0) {
                scoreLi[i].classList.add("special-menu-text");
            }
        }
    },
};