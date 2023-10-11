const { difficultyModes } = require("./opts");

const generatedQuestion = async (topic, difficulty) => {

    let dif;

    switch (difficulty) {
        case 'easy':
            dif = 31;
            break;
        case 'normal':
            dif = 101;
            break;
        case 'hardcore':
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
        case "addition":
            question = `What is ${number1} + ${number2} ?`;
            correctAnswer = number1 + number2;
            break;

        case 'subtraction':
            question = `What is ${number1} - ${number2} ?`;
            correctAnswer = number1 - number2;
            break;

        case 'multiplication':
            question = `What is ${number1} * ${number2} ?`;
            correctAnswer = number1 * number2;
            break;

        case 'random':
            const operations = ['addition', 'subtraction', 'multiplication'];
            let randomOp = operations[Math.floor(Math.random() * operations.length)];
            while (randomOp === 'random') {
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
            case 'easy':
                offset = Math.floor(Math.random() * 6) - 3;
                uniqueAnswer = correctAnswer + offset;
                break;
            case 'normal':
                offset = Math.floor(Math.random() * 20) - 10;
                uniqueAnswer = correctAnswer + offset;
                break;
            case 'hardcore':
                offset = Math.floor(Math.random() * 61) - 30;
                uniqueAnswer = correctAnswer + offset;
                break;
            default:
                offset = Math.floor(Math.random() * 20) - 10;
                uniqueAnswer = correctAnswer + offset;
        }
    } while (existingAnswers.includes(uniqueAnswer) ||
    uniqueAnswer === correctAnswer ||
        uniqueAnswer < 0);
    return uniqueAnswer;
}

const updateSessionActions = async (session, action) => {
    if (session) {
        const existingActions = session.actions || [];  // Make sure it's an array
        const updatedActions = [...existingActions, action];
        await session.update({ actions: updatedActions });
    }
};

module.exports = { generatedQuestion, updateSessionActions };