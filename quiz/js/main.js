// Variables declaration 

// Object to store the themes and questions
var themes = {};
// Variable to store the currently selected theme
var currentTheme = '';
// Variable to store the timer interval
var timerInterval;
//


document.addEventListener('DOMContentLoaded', () => {
    // Fetch the data from the JSON file
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            // Store the questions in the themes object
            data.forEach(theme => themes[theme.theme] = theme.questions);
        });
    // Show the welcome page
    showPage('welcome-page');
});
//

// Function to show a specific page and hide the others
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'block';
}
//

// Function to start the quiz
function startQuiz() {
    // Get the entered username
    const username = document.getElementById('username').value.trim();
    // Check if the username is not empty
    if (!username) {
        alert('Voer je naam in om te beginnen');
        return;
    }
    //If the username has value, display the theme page with the greeting text
    document.getElementById('greeting').innerText = `Hallo ${username},`;
    showPage('theme-page');
}
//

// Function to select a theme and start the quiz
function selectTheme(theme) {
    // Set the current theme
    currentTheme = theme;
    // Set the current question index = first question
    currentQuestionIndex = 0;
    // Set the current score = 0
    score = 0;
    // Initialize the userAnswers array to store the user's answers
    userAnswers = [];
    // Set the team name (username) in the quiz page
    document.getElementById('team-name').innerText = document.getElementById('username').value.trim();
    // Display the quiz page
    showPage('quiz-page');
    // Call this function to load the first question of the selected theme
    loadQuestion();
}
//

// Function to load the questions
function loadQuestion() {
    // Check if the current question index is beyond the number of questions in the theme
    if (currentQuestionIndex >= themes[currentTheme].length) {
        // If all questions are answered, get the showScore function to display the score
        showScore();
        return;
    }

    // Get the current question based on the current question index
    const question = themes[currentTheme][currentQuestionIndex];
    // Set the question text in the HTML element with id question-text
    document.getElementById('question-text').innerText = question.question;
    // Set the question image in the HTML element with id question-image
    document.getElementById('question-image').src = question.image;
    
    // Get the answer buttons from the HTML
    const answerButtons = document.getElementById('answer-buttons');
    // Clear any previous answer buttons
    answerButtons.innerHTML = '';
    
    // Copy the answers array and shuffle it for random order
    const answers = [...question.answers];
    shuffleArray(answers); 
    
    // Create a button for each answer
    answers.forEach(answer => {
        // Create a new button element
        const button = document.createElement('button');
        // Set the button text to the answer text
        button.innerText = answer.text;
        // Set the button's onclick event to selectAnswer function
        button.onclick = () => selectAnswer(answer);
        // Add the button to the answer buttons container
        answerButtons.appendChild(button);
    });
    // Start the timer function for the current question
    startTimer();
}
//

// Function to shuffle an array
function shuffleArray(array) {
    // Sort the array randomly by returning a value between -0.5 and 0.5
    array.sort(() => Math.random() - 0.5);
}

// Function to start the timer for each question
function startTimer() {
    // Set the time left to 15 seconds
    var timeLeft = 15;
    // Get the timer element from the HTML with id timer and display the value
    document.getElementById('timer').innerText = timeLeft;
    // Clear any existing timer intervals
    clearInterval(timerInterval);
    // Set a new timer interval to count down every second
    timerInterval = setInterval(() => {
        // Decrease the time left by 1 second
        timeLeft -= 1;
        // Update the displayed timer value
        document.getElementById('timer').innerText = timeLeft;
        // If the time left reaches 0, stop the timer and select no answer
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            selectAnswer({
                text: 'Geen Antwoord'
            });
        }
    }, 1000);
}
//

// Function to handle the selected answer
function selectAnswer(answer) {
    // Clear any existing timer intervals
    clearInterval(timerInterval);
    // Get the current question index
    const question = themes[currentTheme][currentQuestionIndex];
    // Store the user's answer and whether it was correct
    userAnswers.push({
        question: question.question,
        userAnswer: answer.text,
        correct: answer.correct || false
    });
    // If the answer was correct, increase the score
    if (answer.correct) {
        score += 1;
    }
    // Move to the next question
    currentQuestionIndex += 1;
    // Load the next question
    loadQuestion();
}
//

// Function to display the score
function showScore() {
    // Get the score details element from the HTML with id score-details
    const scoreDetails = document.getElementById('score-details');
    // Set the inner HTML to display the user's score and answers
    // Display the user's total score out of the number of questions
    // Loop through each user's answer and create HTML for each question
    // Display if the user's answer was correct or incorrect
    // Display the user's given answer
    // Display the correct answer for the question
    scoreDetails.innerHTML = `
        <p>Je score is ${score} van ${themes[currentTheme].length}</p> 
        <div class="questions">
            ${userAnswers.map((answer, index) => `
                <div class="question">
                    <p>Vraag ${index + 1}: ${answer.question}</p>
                    <p class="${answer.correct ? 'correct' : 'incorrect'}">Deze vraag had je ${answer.correct ? 'Goed' : 'Fout'}</p>
                    <p>Jouw antwoord: ${answer.userAnswer}</p>
                    <p>Het juiste antwoord: ${getCorrectAnswer(themes[currentTheme][index].answers)}</p>
                </div>
            `).join('')}
        </div>
    `;
    // Display the score page
    showPage('score-page');
}
//

// Function to get the correct answer from the answers array
function getCorrectAnswer(answers) {
    // Find and return the text of the correct answer
    return answers.find(answer => answer.correct).text;
}
//

// Function to restart the quiz
function restartQuiz() {
    // Show the welcome page
    showPage('welcome-page');
}
//