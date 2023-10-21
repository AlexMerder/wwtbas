const { bot } = require('./bot');
const { difficultyModes, back } = require('./opts.js');
const { ACTIONS } = require('./text.js');

const generatedQuestion = async (topic, difficulty, questionNumber, score) => {
    let dif;
    switch (difficulty) {
        case ACTIONS.EASY:
            dif = 9;
            break;
        case ACTIONS.NORMAL:
            dif = 100;
            break;
        case ACTIONS.HARDCORE:
            dif = 999;
            break;
        default:
            dif = 100;
    }

    let number1 = Math.floor(Math.random() * dif);
    let number2 = Math.floor(Math.random() * dif);

    while (number1 === 0) {
        number1 = Math.floor(Math.random() * dif);
    }
    while (number2 === 0) {
        number2 = Math.floor(Math.random() * dif);
    }

    let question = '';
    let correctAnswer = 0;

    let { price, fine } = getPriceAndFine(questionNumber);

    switch (topic) {
        case ACTIONS.ADDITION:
            question = `Score: ${score}\nQuestion ${questionNumber}:\nPrice: ${price}\nWhat is ${number1} + ${number2} ?`;
            correctAnswer = number1 + number2;
            break;

        case ACTIONS.SUBTRACTION:
            question = `Score: ${score}\nQuestion ${questionNumber}:\nPrice: ${price}\nWhat is ${number1} - ${number2} ?`;
            correctAnswer = number1 - number2;
            break;

        case ACTIONS.MULTIPLICATION:
            question = `Score: ${score}\nQuestion ${questionNumber}:\nPrice: ${price}\nWhat is ${number1} * ${number2} ?`;
            correctAnswer = number1 * number2;
            break;

        case ACTIONS.RANDOM:
            const operations = [ACTIONS.ADDITION, ACTIONS.SUBTRACTION, ACTIONS.MULTIPLICATION];
            let randomOp = operations[Math.floor(Math.random() * operations.length)];
            while (randomOp === ACTIONS.RANDOM) {
                randomOp = operations[Math.floor(Math.random() * operations.length)]
            }
            return generatedQuestion(randomOp, difficulty, questionNumber, score);
        default:
            console.error('topic: ', topic);
            console.error('difficultyModes: ', difficultyModes);
    }

    let uniqueIncorrectAnswers = [];

    for (let i = 0; i < 3; i++) {
        uniqueIncorrectAnswers.push(generateIncorrectUniqueAnswer(correctAnswer, uniqueIncorrectAnswers, difficulty));
    }

    return { question, correctAnswer, uniqueIncorrectAnswers, price, fine };
}

function getPriceAndFine(questionNumber) {
    let priceValue, fineValue;
    if (questionNumber >= 1 && questionNumber <= 5) {
        priceValue = 100;
        fineValue = 50;
    } else if (questionNumber >= 6 && questionNumber <= 10) {
        priceValue = 150;
        fineValue = 150;
    } else if (questionNumber >= 11 && questionNumber <= 15) {
        priceValue = 200;
        fineValue = 250;
    } else {
        priceValue = 100;
        fineValue = 50;
    }
    return { price: priceValue, fine: fineValue };
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

async function sendMessage(chatId, message, options) {
    try {
        return bot.sendMessage(chatId, message, options);

    } catch (error) {
        console.log('Error while sending message via telegram: ', error);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getTimeout(difficulty) {
    switch (difficulty) {
        case ACTIONS.EASY:
            return 10000;
        case ACTIONS.NORMAL:
            return 30000;
        case ACTIONS.HARDCORE:
            return 60000;
        default:
            return 30000;
    }
}

async function sendGeneratedQuestion(session, chatId) {

    if (session.questionNumber > 15) {
        return sendMessage(chatId, `Your result: ${session.score}`, back);
    }

    const questionData = await generatedQuestion(session.topic, session.difficulty, session.questionNumber, session.score);
    const { question, correctAnswer, uniqueIncorrectAnswers, price, fine } = questionData;

    session.timerId = null;
    session.answered = false;
    session.price = price;
    session.fine = fine;

    const allAnswers = [
        { answer: correctAnswer, callback_data: 'correct_answer' },
        ...uniqueIncorrectAnswers.map(answer => ({ answer, callback_data: 'incorrect_answer' }))
    ];

    const shuffledAnswers = shuffleArray([...allAnswers]);

    console.log("Shuffled answers for question 🔽: ", shuffledAnswers);
    const gameQuestion = {
        reply_markup: {
            inline_keyboard: [
                ...Array(Math.ceil(shuffledAnswers.length / 2)).fill().map((_, index) => {
                    const offset = index * 2;
                    return [
                        { text: shuffledAnswers[offset].answer.toString(), callback_data: shuffledAnswers[offset].callback_data },
                        ...(shuffledAnswers[offset + 1] ? [{ text: shuffledAnswers[offset + 1].answer.toString(), callback_data: shuffledAnswers[offset + 1].callback_data }] : [])
                    ];
                }),
                [{ text: "Finish", callback_data: 'new_game' }]
            ]
        }
    };
    await sendMessage(chatId, question, gameQuestion);
    const timeLimit = getTimeout(session.difficulty);
    session.timerId = setTimeout(() => {
        if (session.answered) {
            return;
        }
        session.answered = true;
        sendMessage(chatId, 'Time expired!', back);
        console.log(`Time expired: ${session.userName}`);
    }, timeLimit);
}

async function inDevelopment(chatId) {
    return sendMessage(chatId, 'In development...', back);
}

module.exports = { inDevelopment, sendGeneratedQuestion, sendMessage };