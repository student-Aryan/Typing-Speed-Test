const quoteDisplay = document.getElementById('quote-display');
const quoteInput = document.getElementById('quote-input');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const startBtn = document.getElementById('start-btn');
const resultDiv = document.getElementById('result');

let timer;
let timeLeft = 60;
let isTestRunning = false;
let correctCharacters = 0;
let totalCharacters = 0;

// Sample quotes for typing test
const quotes = [
    "The quick brown fox jumps over the lazy dog.",
    "Programming is the art of telling another human what one wants the computer to do.",
    "Coding is not just code, it is logic and creativity.",
    "The best way to predict the future is to invent it.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts."
];

// Start the typing test
function startTest() {
    if (isTestRunning) return;

    isTestRunning = true;
    timeLeft = 60;
    correctCharacters = 0;
    totalCharacters = 0;
    quoteInput.value = '';
    resultDiv.textContent = '';

    // Pick a random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteDisplay.innerHTML = '';
    randomQuote.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        quoteDisplay.appendChild(charSpan);
    });

    // Start timer
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            endTest();
        }
    }, 1000);

    quoteInput.focus();
}

// End the typing test
function endTest() {
    clearInterval(timer);
    isTestRunning = false;
    quoteInput.disabled = true;

    // Calculate WPM (assuming 5 characters = 1 word)
    const words = correctCharacters / 5;
    const wpm = Math.round(words / (60 - timeLeft) * 60) || 0;

    // Calculate accuracy
    const accuracy = Math.round((correctCharacters / totalCharacters) * 100) || 0;

    // Display results
    resultDiv.innerHTML = `
        <p>Test Complete!</p>
        <p>Your Typing Speed: <strong>${wpm} WPM</strong></p>
        <p>Accuracy: <strong>${accuracy}%</strong></p>
    `;
}

// Check typed characters in real-time
quoteInput.addEventListener('input', () => {
    if (!isTestRunning) return;

    const quoteSpans = quoteDisplay.querySelectorAll('span');
    const inputText = quoteInput.value.split('');

    totalCharacters = inputText.length;
    correctCharacters = 0;

    quoteSpans.forEach((span, index) => {
        const typedChar = inputText[index];

        if (typedChar == null) {
            span.className = '';
        } else if (typedChar === span.innerText) {
            span.className = 'correct';
            correctCharacters++;
        } else {
            span.className = 'incorrect';
        }
    });

    // Calculate WPM in real-time
    const words = correctCharacters / 5;
    const timeElapsed = 60 - timeLeft;
    const wpm = Math.round(words / timeElapsed * 60) || 0;
    wpmElement.textContent = wpm;

    // Calculate accuracy in real-time
    const accuracy = Math.round((correctCharacters / totalCharacters) * 100) || 0;
    accuracyElement.textContent = accuracy;

    // If user finishes typing before time ends
    if (inputText.length === quoteSpans.length) {
        endTest();
    }
});

// Reset and start new test
startBtn.addEventListener('click', () => {
    quoteInput.disabled = false;
    startTest();
});
