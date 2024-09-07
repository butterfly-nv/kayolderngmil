const correctAnswers = {
    1: 'B',
    2: 'C',
    3: 'C',
    4: 'D',
    5: 'B',
    6: 'B',
    7: 'A',
    8: 'D',
    9: 'A',
    10: 'B',
    11: 'A',
    12: 'B',
    13: 'A',
    14: 'A',
    15: 'B',
};

let userAnswers = {};
let currentQuestion = 1;
const totalQuestions = Object.keys(correctAnswers).length;

function selectOption(questionNumber, answer) {
    const options = document.querySelectorAll(`#question${questionNumber} .answer-option`);
    options.forEach(option => option.classList.remove('selected'));

    const selectedOption = Array.from(options).find(opt => opt.textContent.trim().startsWith(answer));
    if (selectedOption) selectedOption.classList.add('selected');

    userAnswers[questionNumber] = answer;
}

function nextQuestion() {
    if (currentQuestion < totalQuestions) {
        document.getElementById(`question${currentQuestion}`).classList.remove('active');
        currentQuestion++;
        document.getElementById(`question${currentQuestion}`).classList.add('active');
        showQuestion(currentQuestion);
        updateButtons();
    }
}

function previousQuestion() {
    if (currentQuestion > 1) {
        document.getElementById(`question${currentQuestion}`).classList.remove('active');
        currentQuestion--;
        document.getElementById(`question${currentQuestion}`).classList.add('active');
        showQuestion(currentQuestion);
        updateButtons();
    }
}

function updateButtons() {
    document.getElementById('backBtn').style.display = currentQuestion === 1 ? 'none' : 'inline-block';
    document.getElementById('nextBtn').style.display = currentQuestion === totalQuestions ? 'none' : 'inline-block';
    document.getElementById('submitBtnContainer').style.display = currentQuestion === totalQuestions ? 'block' : 'none';
}

function submitQuiz() {
    // Check if all questions have been answered
    for (let i = 1; i <= totalQuestions; i++) {
        if (!userAnswers[i]) {
            alert(`Please answer question ${i} before submitting.`);
            return; // Stop submission if a question is not answered
        }
    }

    let score = 0;

    for (let i = 1; i <= totalQuestions; i++) {
        if (userAnswers[i] === correctAnswers[i]) {
            score++;
        }
    }

    const resultDiv = document.getElementById('quizResult');
    resultDiv.textContent = `You scored ${score} out of ${totalQuestions}`;
    showQuizSummary();

    document.getElementById('retryBtn').style.display = 'block'; // Show retry button

    // Hide the back button after submission
    document.getElementById('backBtn').style.display = 'none';
}



function showQuizSummary() {
    const summaryDiv = document.getElementById('quizSummary');
    summaryDiv.innerHTML = '';

    for (let i = 1; i <= totalQuestions; i++) {
        const questionElement = document.getElementById(`question${i}`);
        const questionText = questionElement.querySelector('p').innerText;
        const userAnswer = userAnswers[i] || 'No answer';
        const correctAnswer = correctAnswers[i];

        let userAnswerText = 'No answer';
        if (userAnswer !== 'No answer') {
            const userOptionElement = Array.from(questionElement.querySelectorAll('.answer-option')).find(option => 
                option.textContent.trim().startsWith(userAnswer)
            );
            if (userOptionElement) {
                userAnswerText = userOptionElement.innerText;
            }
        }

        const correctOptionElement = Array.from(questionElement.querySelectorAll('.answer-option')).find(option => 
            option.textContent.trim().startsWith(correctAnswer)
        );
        const correctAnswerText = correctOptionElement ? correctOptionElement.innerText : '';

        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.innerHTML = `
            <strong>Question ${i}:</strong> ${questionText} <br>
            Your Answer: <span class="${userAnswer === correctAnswer ? 'correct' : 'incorrect'}">${userAnswerText}</span> <br>
            Correct Answer: <span class="correct">${correctAnswerText}</span>
        `;

        summaryDiv.appendChild(questionDiv);
    }

    summaryDiv.style.display = 'block';
}

function nextQuestion() {
    // Check if an answer has been selected for the current question
    if (!userAnswers[currentQuestion]) {
        alert('Please select an answer before proceeding.');
        return;
    }

    // Proceed to the next question if an answer is selected
    if (currentQuestion < totalQuestions) {
        document.getElementById(`question${currentQuestion}`).classList.remove('active');
        currentQuestion++;
        document.getElementById(`question${currentQuestion}`).classList.add('active');
        showQuestion(currentQuestion);
        updateButtons();
    }
}


document.getElementById('retryBtn').addEventListener('click', function() {
    // Reset to the first question
    currentQuestion = 1;

    // Hide all questions
    document.querySelectorAll('.quiz-question').forEach(question => {
        question.style.display = 'none';
    });

    // Show the first question
    showQuestion(currentQuestion);

    // Hide the retry button again
    document.getElementById('retryBtn').style.display = 'none';

    // Hide the summary
    const summaryDiv = document.getElementById('quizSummary');
    summaryDiv.style.display = 'none';

    // Hide any results or selected answers
    document.querySelectorAll('.answer-option').forEach(option => {
        option.classList.remove('selected');
    });

    // Reset the result display if any
    document.querySelector('.results').innerHTML = '';

    // Reset navigation buttons
    updateButtons();
});

function showQuestion(index) {
    document.querySelectorAll('.quiz-question').forEach((question, i) => {
        question.style.display = (i + 1 === index) ? 'block' : 'none';
    });
}

// Initially show the first question
showQuestion(currentQuestion);
