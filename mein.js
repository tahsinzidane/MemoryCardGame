
const gameBoard = document.getElementById('game-board');
const timerElement = document.getElementById('timer');
const moveCounterElement = document.getElementById('move-counter');
const restartButton = document.getElementById('restart-button');
const cardValues = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let timer;
let moves = 0;
let time = 0;


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startTimer() {
    timer = setInterval(() => {
        time++;
        timerElement.textContent = time;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function resetGame() {
    gameBoard.innerHTML = '';
    timerElement.textContent = '0';
    moveCounterElement.textContent = '0';
    time = 0;
    moves = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    clearInterval(timer);
    createBoard();
    startTimer();
}

function createBoard() {
    const shuffledValues = shuffle(cardValues);
    shuffledValues.forEach(value => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.innerHTML = ''; 
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');
    this.innerHTML = this.dataset.value; 

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
    updateMoveCounter();
}

function checkForMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetBoard();
    checkIfGameIsComplete();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        firstCard.innerHTML = '';
        secondCard.innerHTML = '';
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function updateMoveCounter() {
    moves++;
    moveCounterElement.textContent = moves;
}

function checkIfGameIsComplete() {
    const matchedCards = document.querySelectorAll('.card.matched');
    if (matchedCards.length === cardValues.length) {
        stopTimer();
        alert(`Congratulations! You completed the game in ${time} seconds and ${moves} moves.`);
    }
}

restartButton.addEventListener('click', resetGame);

createBoard();
startTimer();


