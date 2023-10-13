const { difficultyModes } = require("./opts");
const { ACTIONS } = require('./text');

const generatedQuestion = async (topic, difficulty) => {

    let dif;

    switch (difficulty) {
        case ACTIONS.EASY:
            dif = 31;
            break;
        case ACTIONS.NORMAL:
            dif = 101;
            break;
        case ACTIONS.HARDCORE:
            dif = 1001;
            break;
        default:
            dif = 101;
    }

    let number1 = Math.floor(Math.random() * dif);
    let number2 = Math.floor(Math.random() * dif);

    let question = '';
    let correctAnswer = 0;

    switch (topic) {
        case ACTIONS.ADDITION:
            question = `What is ${number1} + ${number2} ?`;
            correctAnswer = number1 + number2;
            break;

        case ACTIONS.SUBTRACTION:
            question = `What is ${number1} - ${number2} ?`;
            correctAnswer = number1 - number2;
            break;

        case ACTIONS.MULTIPLICATION:
            question = `What is ${number1} * ${number2} ?`;
            correctAnswer = number1 * number2;
            break;

        case ACTIONS.RANDOM:
            const operations = [ACTIONS.ADDITION, ACTIONS.SUBTRACTION, ACTIONS.MULTIPLICATION];
            let randomOp = operations[Math.floor(Math.random() * operations.length)];
            while (randomOp === ACTIONS.RANDOM) {
                randomOp = operations[Math.floor(Math.random() * operations.length)]
            }
            return generatedQuestion(randomOp, difficulty);
        default:
            console.error('topic: ' + topic);
            console.error('difficultyModes: ' + difficultyModes);
    }

    let uniqueIncorrectAnswers = [];

    for (let i = 0; i < 3; i++) {
        uniqueIncorrectAnswers.push(generateIncorrectUniqueAnswer(correctAnswer, uniqueIncorrectAnswers, difficulty));
    }

    return { question, correctAnswer, uniqueIncorrectAnswers };
}


function generateIncorrectUniqueAnswer(correctAnswer, existingAnswers, difficulty) {
    let uniqueAnswer;
    let offset;
    do {
        switch (difficulty) {
            case ACTIONS.EASY:
                offset = Math.floor(Math.random() * 6) - 3;
                uniqueAnswer = correctAnswer + offset;
                break;
            case ACTIONS.NORMAL:
                offset = Math.floor(Math.random() * 20) - 10;
                uniqueAnswer = correctAnswer + offset;
                break;
            case ACTIONS.HARDCORE:
                offset = Math.floor(Math.random() * 61) - 30;
                uniqueAnswer = correctAnswer + offset;
                break;
            default:
                offset = Math.floor(Math.random() * 20) - 10;
                uniqueAnswer = correctAnswer + offset;
        }
    } while (existingAnswers.includes(uniqueAnswer) ||
    uniqueAnswer === correctAnswer);
    return uniqueAnswer;
}

module.exports = { generatedQuestion };