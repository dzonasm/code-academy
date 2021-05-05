const wrongGuessDiv = document.querySelector(".wrong-guesses");
const correctGuessDiv = document.querySelector(".correct-guesses");
const guessBtn = document.querySelector(".guess-button");
const letterInput = document.querySelector("#letter");
const setupDiv = document.querySelector(".setup");
const guessStatusDiv = document.querySelector(".guess-status");
const wrongGuessCountSpan = document.querySelector(".wrong-guess-count");
const head = document.querySelector("#head");
const body = document.querySelector("#body");
const armL = document.querySelector("#armL");
const armR = document.querySelector("#armR");
const legR = document.querySelector("#legR");
const legL = document.querySelector("#legL");
const hangman = [head, body, armL, armR, legL, legR];
const restartBtn = document.querySelector(".restart-button");

let appState = {
  jokeSetup: "",
  jokePuchline: "",
  currentGuessStatus: null,
  guessedLetters: [],
  wrongGuesses: 0,
  history: [],
};

//html elements to render
const letterSpanTag = (letter, wrong) => {
  const span = document.createElement("span");
  wrong && span.classList.add("wrong");
  span.className = "letter";
  span.innerHTML = letter;
  return span;
};

//helper funcions
const indexes = (arr, elToFind) =>
  arr.reduce((reducer, currentEl, i) => {
    currentEl === elToFind && reducer.push(i);
    return reducer;
  }, []);

//fetch the joke
const jokeFetch = async () => {
  const res = await fetch("https://dad-jokes.p.rapidapi.com/random/joke", {
    method: "GET",
    headers: {
      "x-rapidapi-key": "3cac52842emsh85de1cb08bbf9c4p1c6273jsn049dae6fcc81",
      "x-rapidapi-host": "dad-jokes.p.rapidapi.com",
    },
  });
  const data = await res.json();
  appState.setup = data.body[0].setup;
  appState.punchline = data.body[0].punchline.toLowerCase();
  loadJoke();

  console.log(data.body);
};

const loadJoke = () => {
  //fetch joke
  let { punchline, setup } = appState;
  appState.jokePuchline = hidePunchline(punchline);
  appState.currentGuessStatus = hidePunchline(punchline);
  const setupElement = document.createElement("p");
  setupElement.innerText = setup;
  setupDiv.appendChild(setupElement);
  appState.jokePuchline.forEach((e) => {
    const span = letterSpanTag(e);
    guessStatusDiv.appendChild(span);
  });
};

//hide punchline
const hidePunchline = () => {
  let { punchline } = appState;
  const splittedPunchline = punchline.split("");
  const hidden = [];
  const letters = /^[a-zA-Z]+$/;
  splittedPunchline.forEach((letter) => {
    //chech if letter is a blank space or a letter and push it to the hidden array
    letter === " "
      ? hidden.push(` `)
      : letter.match(letters) && hidden.push("-");
  });
  return hidden;
};

//render wrong guess count
const renderWrongGuessCount = () => {
  wrongGuessCountSpan.innerText = "";
  wrongGuessCountSpan.innerText = `Number of wrong guesses: ${appState.wrongGuesses}`;
};

//wrong guess
const wrongGuess = (letter) => {
  el = letterSpanTag(letter, true);
  wrongGuessDiv.appendChild(el);
  appState.wrongGuesses++;
  appState.guessedLetters.push(letter);
  letterInput.value = "";
  renderWrongGuessCount();
  revealHangman();
  checkForLoss();
};

//correct guess
const correctGuess = (splittedAnswer, letter, currentGuessStatus) => {
  const letterIndexes = indexes(splittedAnswer, letter);
  letterIndexes.forEach((e) => (currentGuessStatus[e] = letter));
  letterInput.value = "";
  return (appState.currentGuessStatus = currentGuessStatus);
};

//render guess status
const renderGuessStatus = () => {
  guessStatusDiv.innerHTML = "";
  appState.currentGuessStatus.forEach((e) => {
    const span = letterSpanTag(e);
    guessStatusDiv.appendChild(span);
  });
};

//check for win

const checkForWin = () => {
  appState.currentGuessStatus.includes("-") ? null : alert("you win!");
};

//check for loss
const checkForLoss = () =>
  appState.wrongGuesses === 6
    ? alert(`the correct answer was: ${appState.punchline}`)
    : null;

//make guess
const guessLetter = (letter, correctAnswer, currentGuessStatus) => {
  //check if already guessed
  correctAnswer.toLowerCase();
  if (
    currentGuessStatus.includes(letter) ||
    appState.guessedLetters.includes(letter)
  )
    return;

  //check if the answer includes letter
  const splittedAnswer = correctAnswer.split("");
  if (splittedAnswer.includes(letter) === false) return wrongGuess(letter);

  correctGuess(splittedAnswer, letter, currentGuessStatus);
  renderGuessStatus();
  checkForWin();
};

const hideHangman = () => {
  hangman.forEach((el) => el.classList.add("hidden"));
};

const revealHangman = () => {
  let idx = appState.wrongGuesses - 1;
  hangman[idx].classList.remove("hidden");
};

//add click listeners

guessBtn.addEventListener("click", () => {
  guessLetter(
    letterInput.value,
    appState.punchline,
    appState.currentGuessStatus
  );
  console.log(appState);
});

//restart

restartBtn.addEventListener("click", () => {
  restart();
});

const restart = () => {
  appState = {};
  wrongGuessCountSpan.innerHTML = "";
  wrongGuessDiv.innerHTML = "";
  setupDiv.innerHTML = "";
  guessStatusDiv.innerHTML = "";
  correctGuessDiv.innerHTML = "";
  hideHangman();
  jokeFetch();
  loadJoke();
};

const startGame = () => {
  hideHangman();
  jokeFetch();
  loadJoke();
};

startGame();
