/*
@author Jader Luz - A01405008
JavaScript file to handle all the tasks required on the final project
*/

const popup = document.getElementById('intro-popup');
const game = document.getElementById('game');

//Close popup
popup.addEventListener('click', function() {
    popup.classList.add('hidden');
    game.classList.add('active');
});


document.addEventListener('DOMContentLoaded', function() {
    let words = [];
    let currentWord = {};
    let guessedLetters = [];
    let mistakes = 0;

    const grinch = document.getElementById('grinch');
    const hint = document.getElementById('hint');
    const wordDiv = document.getElementById('word');
    const keyboard = document.getElementById('keyboard');
    const present = document.getElementById('present');
    const message = document.getElementById('message');
    const restartButton = document.getElementById('restart-button');

    const maxMistakes = 6;
    const boardWidth = document.getElementById('game-board').offsetWidth;
    const grinchStartPosition = 20;
    const grinchEndPosition = boardWidth - 140;

    //Function to load the words from the JSON file
    async function loadWords() {
        try {
            const response = await fetch('./christmas_words.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            words = await response.json();
            startGame();
        } catch (error) {
            console.error('Error loading JSON:', error);
            message.innerText = 'Failed to load words. Please try again.';
        }
    }

    //Start the game with Grinch in the start position, keyboard, and the gift image
    function startGame() {
        currentWord = words[Math.floor(Math.random() * words.length)];
        guessedLetters = [];
        mistakes = 0;
        grinch.src = "images/grinch-stopped.png";
        grinch.style.display = "block"
        grinch.style.left = `${grinchStartPosition}px`;
        present.src = "images/gift-box.png";
        message.innerText = "";
        hint.innerText = `Hint: ${currentWord.hint}`;
        keyboard.style.display = "flex";
        renderWord();
        renderKeyboard();
    }

    //Function to render the word
    function renderWord() {
        wordDiv.innerHTML = '';
        let wordComplete = true;
        for (let letter of currentWord.word) {
            const letterDiv = document.createElement('div');
            letterDiv.className = 'letter';
            if (guessedLetters.includes(letter.toLowerCase())) {
                letterDiv.innerText = letter;
            } else {
                letterDiv.innerText = '_';
                wordComplete = false;
            }
            wordDiv.appendChild(letterDiv);
        }

        if (wordComplete) {
            message.innerText = "You won! Congratulations!";
            keyboard.style.display = "none";
            restartButton.style.display = "block";
        }
    }

    //Function to render the keyboard
    function renderKeyboard() {
        keyboard.innerHTML = '';
        for (let i = 65; i <= 90; i++) {
            const letter = String.fromCharCode(i).toLowerCase();
            const keyDiv = document.createElement('div');
            keyDiv.className = 'key';
    
            //Disable chosen letters
            if (guessedLetters.includes(letter)) {
                keyDiv.classList.add('disabled');
            } else {
                keyDiv.addEventListener('click', () => handleGuess(letter));
            }
    
            keyDiv.innerText = letter.toUpperCase();
            keyboard.appendChild(keyDiv);
        }
    }

    //Function to handle with the player's guess
    function handleGuess(letter) {
        if (guessedLetters.includes(letter)) return; //Avoid repetition
        guessedLetters.push(letter);
    
        if (!currentWord.word.includes(letter)) {
            mistakes++;
    
            if (mistakes === 1) {
                grinch.src = "images/grinch-moving.png";
            }
    
            if (mistakes <= maxMistakes) {
                const newPosition = grinchStartPosition + ((grinchEndPosition - grinchStartPosition) / maxMistakes) * mistakes;
                grinch.style.left = `${newPosition}px`;
            }
    
            if (mistakes === maxMistakes) {
                present.src = "images/grinch-hands.png";
                grinch.style.display = "none";
                message.innerText = "You lost! The Grinch stole the present!";
                keyboard.style.display = "none";
                restartButton.style.display = "block";
            }
        } else {
            renderWord();
        }
    
        renderKeyboard();
    }

    restartButton.addEventListener('click', startGame);

    //Load the words when it starts
    loadWords();
});