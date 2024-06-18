document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');

    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const phone = document.getElementById('register-phone').value;
            const password = document.getElementById('register-password').value;

            const user = { username, email, phone, password };
            localStorage.setItem('user', JSON.stringify(user));
            alert('User registered successfully!');
            window.location.href = 'login.html';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            const user = JSON.parse(localStorage.getItem('user'));

            if (user && user.username === username && user.password === password) {
                sessionStorage.setItem('loggedInUser', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                alert('Invalid login details!');
            }
        });
    }

    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            usernameDisplay.innerText = loggedInUser.username;
        } else {
            window.location.href = 'login.html';
        }
    }
});
//exame part 
document.addEventListener('DOMContentLoaded', function() {
    const questionContainer = document.getElementById('questionContainer');
    const status = document.getElementById('status');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const timeDisplay = document.getElementById('time');
    let timerInterval;
    let totalTime = 600; // 10 minutes in seconds
    let timeLeft = totalTime;
    let currentCategoryIndex = 0;
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let scores = {
        html: 0,
        css: 0,
        javascript: 0
    };

    const categories = [
        {
            name: 'HTML',
            questions: [
                {
                    question: 'What does HTML stand for?',
                    options: ['Hyper Text Markup Language', 'Hyperlinks and Text Markup Language', 'Home Tool Markup Language'],
                    answer: 0 // Index of correct answer in options array
                },
                {
                    question: 'What is the latest version of HTML?',
                    options: ['HTML5', 'XHTML', 'HTML 4.01'],
                    answer: 0
                },
                {
                    question: 'What does the "doctype" declaration do?',
                    options: ['Defines the document type', 'Defines a doctype element', 'Defines a document title'],
                    answer: 0
                }
            ]
        },
        {
            name: 'CSS',
            questions: [
                {
                    question: 'What is CSS?',
                    options: ['Cascade Style Sheets', 'Creative Style Sheets', 'Computer Style Sheets'],
                    answer: 0
                },
                {
                    question: 'What does CSS Grid Layout provide?',
                    options: ['Grid-based layout system', 'Flex-based layout system', 'Block-based layout system'],
                    answer: 0
                },
                {
                    question: 'Which CSS property controls the text size?',
                    options: ['font-size', 'text-size', 'font-style'],
                    answer: 0
                }
            ]
        },
        {
            name: 'JavaScript',
            questions: [
                {
                    question: 'What is JavaScript?',
                    options: ['A programming language', 'A markup language', 'A database technology'],
                    answer: 0
                },
                {
                    question: 'What does JSON stand for?',
                    options: ['JavaScript Object Notation', 'JavaScript Oriented Notation', 'JavaScript Objected Notation'],
                    answer: 0
                },
                {
                    question: 'What is the purpose of the "addEventListener" method in JavaScript?',
                    options: ['Attaches an event handler to an element', 'Creates a new event listener', 'Removes an event listener'],
                    answer: 0
                }
            ]
        }
    ];

    function startExam() {
        showQuestion();
        startTimer();
        displayUserDetails(); // Added

    }

    function showQuestion() {
        const currentCategory = categories[currentCategoryIndex];
        const currentQuestion = currentCategory.questions[currentQuestionIndex];
        questionContainer.innerHTML = `
            <div class="question-container">
                <div class="question">${currentQuestion.question}</div>
                <div class="options">
                    ${currentQuestion.options.map((opt, idx) => `
                        <label>
                            <input type="radio" name="answer" value="${idx}">
                            ${opt}
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
        status.textContent = `${currentCategory.name} - Question ${currentQuestionIndex + 1} of ${currentCategory.questions.length}`;
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft >= 0) {
                let minutes = Math.floor(timeLeft / 60);
                let seconds = timeLeft % 60;
                timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            } else {
                clearInterval(timerInterval);
                completeExam();
            }
        }, 1000);
    }

    function completeExam() {
        clearInterval(timerInterval);
        showExamResult();
        submitBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    }

    function showExamResult() {
        questionContainer.innerHTML = `
            <h2>Exam Completed!</h2>
            <p>HTML Score: ${scores.html} out of ${categories[0].questions.length}</p>
            <p>CSS Score: ${scores.css} out of ${categories[1].questions.length}</p>
            <p>JavaScript Score: ${scores.javascript} out of ${categories[2].questions.length}</p>
        `;
    }

    function nextQuestion() {
        const selectedOption = document.querySelector(`input[name="answer"]:checked`);
        if (selectedOption) {
            const selectedAnswer = parseInt(selectedOption.value);
            const currentCategory = categories[currentCategoryIndex];
            const currentQuestion = currentCategory.questions[currentQuestionIndex];
            if (selectedAnswer === currentQuestion.answer) {
                switch (currentCategoryIndex) {
                    case 0:
                        scores.html++;
                        break;
                    case 1:
                        scores.css++;
                        break;
                    case 2:
                        scores.javascript++;
                        break;
                }
            }
            userAnswers.push(selectedAnswer);
            currentQuestionIndex++;
            if (currentQuestionIndex < currentCategory.questions.length) {
                showQuestion();
                // Show next button only if there are more questions
                if (currentQuestionIndex === currentCategory.questions.length - 1) {
                    nextBtn.textContent = 'Next Category';
                }
            } else {
                currentQuestionIndex = 0;
                currentCategoryIndex++;
                if (currentCategoryIndex < categories.length) {
                    showQuestion();
                    nextBtn.textContent = 'Next';
                    if (currentCategoryIndex === categories.length - 1) {
                        nextBtn.style.display = 'none';
                        submitBtn.style.display = 'block';
                    }
                }
            }
        } else {
            alert('Please select an answer before proceeding.');
        }
    }
// user details  
  function displayUserDetails() {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            document.getElementById('username-display').textContent = loggedInUser.username;
            document.getElementById('email-display').textContent = loggedInUser.email;
            document.getElementById('phone-display').textContent = loggedInUser.phone;
        } else {
            window.location.href = 'login.html';
        }
    }
    nextBtn.addEventListener('click', nextQuestion);
    submitBtn.addEventListener('click', completeExam);

    // Start the exam when the page loads
    startExam();
});
