
const rules = `*Welcome to the game "Who Wants to Be Smart?"* 
You can choose the desired game mode and difficulty.

For each correct answer at any difficulty level you get points:
- *Stage 1 to 5*: 100 points
- *Stage 6 to 10*: 200 points
- *From stage 11 to 15*: 300 points

For each wrong answer at any difficulty level you will be deducted points:
- *Stage 1 to 5*: 50 points
- *Stage 6 to 10*: 150 points
- *From stage 11 to 15*: 250 points

Depending on the level you are given different amounts of time to answer:
- *For easy*: 10 seconds
- *For normal*: 30 seconds
- *For hardcore*: 60 seconds.

Your task is to get the highest number of points.
P.S. Good luck!
`;

const selectDifficulty = `After selecting *DIFFICULTY* 🏆 the *TIMER* 🕔 will start and the *GAME* ▶️ will start. Select the difficulty level :`;


const ACTIONS = {
    NEW_GAME: 'new_game',
    PLACEHOLDER: 'placeholder',
    PAY_RESPECT: 'pay_respect',
    ACHIEVEMENTS: 'achievements',
    BACK: 'back',
    GET_STARTED: 'get_started',
    RULES: 'rules',
    ADDITION: 'addition',
    SUBTRACTION: 'subtraction',
    MULTIPLICATION: 'multiplication',
    RANDOM: 'random',
    EASY: 'easy',
    NORMAL: 'normal',
    HARDCORE: 'hardcore',
    CORRECT_ANSWER: 'correct_answer',
    INCORRECT_ANSWER: 'incorrect_answer'
};


module.exports = { rules, selectDifficulty, ACTIONS };