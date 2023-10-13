const { bot } = require('./src/bot/bot.js');
const { UserSession } = require('./src/models/user_session.js');
const { newGame, rulesAndDonation, modeList, difficultyModes, back, payRespect, placeholder } = require('./src/bot/opts.js');
const { generatedQuestion } = require('./src/bot/commands.js');
const { rules, selectDifficulty, ACTIONS } = require('./src/bot/text.js');

bot.onText(/\/start/, async (msg) => {

    try {
        console.log("Message: ", msg);
        const chatId = msg.chat.id;
        const userName = msg.from.username || "User";
        await findOrCreateUser(chatId, userName);
        await sendMessage(chatId, `Welcome 👋*${userName}* to the game "*Who wants to be smart?*"`, newGame);
    } catch (error) {
        console.log('Error: ' + error);
    }

});

bot.on('callback_query', async (callbackQuery) => {

    try {
        console.log("UserName: ", callbackQuery.from.username);
        console.log("message: ", callbackQuery.message.text);


        const chatId = callbackQuery.from.id;
        const userName = callbackQuery.from.username;
        const action = callbackQuery.data;

        let session = await findOrCreateUser(chatId, userName);
        // console.log('User session: ', session);

        switch (action) {
            case ACTIONS.NEW_GAME:
            case ACTIONS.BACK:
                await sendMessage(chatId, `*${userName}*, rules are simple - answer on questions right!`, rulesAndDonation);
                break;

            case ACTIONS.GET_STARTED:
                await sendMessage(chatId, 'Pick a game mode: ', modeList);
                break;

            case ACTIONS.PLACEHOLDER:
            case ACTIONS.PAY_RESPECT:
            case ACTIONS.ACHIEVEMENTS:
                await inDevelopment(chatId);
                break;

            case ACTIONS.RULES:
                await sendMessage(chatId, rules, back);
                break;

            case ACTIONS.ADDITION:
            case ACTIONS.SUBTRACTION:
            case ACTIONS.MULTIPLICATION:
            case ACTIONS.RANDOM:
                await setTopicAndSave(session, action);
                await sendMessage(chatId, selectDifficulty, difficultyModes);
                break;

            case ACTIONS.EASY:
            case ACTIONS.NORMAL:
            case ACTIONS.HARDCORE:
                await setDifficulty(session, action);
                try {
                    if (!session.topic || !session.difficulty) {
                        await sendMessage(chatId, `Welcome 👋*${userName}* to the game "*Who wants to be smart?*"`, newGame);
                    } else {
                        await sendGeneratedQuestion(session, chatId);
                    }
                } catch (error) {
                    
                }
                
                break;

            case ACTIONS.CORRECT_ANSWER:
                sendMessage(chatId, `Correct!`, {})
                    .then(() => {
                        return sendGeneratedQuestion(session, chatId);
                    })
                    .catch(error => {
                        console.log('Error: ', error);
                    });
                break;
            case ACTIONS.INCORRECT_ANSWER:
                sendMessage(chatId, `Incorrect!`, {})
                    .then(() => {
                        return sendGeneratedQuestion(session, chatId);
                    })
                    .catch(error => {
                        console.log('Error: ', error);
                    });
                break;
            default:
                await sendMessage(chatId, `Welcome 👋*${userName}* to the game "*Who wants to be smart?*"`, newGame);
        }
    } catch (error) {
        console.log('Error: ', error);
    }
});

async function setDifficulty(session, difficulty) {
    try {
        session.difficulty = difficulty;
        await session.save();
        console.log('Difficulty has been set: ' + difficulty);
    } catch (error) {
        console.log('Error in db: ', error);
        await sendMessage(chatId, `Welcome 👋*${userName}* to the game "*Who wants to be smart?*"`, newGame);
    }
}

async function setTopicAndSave(session, topic) {
    try {
        session.topic =  topic;
        await session.save();
        console.log('Topic has been set: ' + topic);
    } catch (error) {
        console.log('Error in db: ', error);
        await sendMessage(chatId, `Welcome 👋*${userName}* to the game "*Who wants to be smart?*"`, newGame);
    }
}

async function findOrCreateUser(chatId, userName) {
    try {
        let session = await UserSession.findOne({ where: { chatId: chatId } });
        if (!session) {
            session = await UserSession.create({ chatId, userName });
            return session;
        }
        await session.save();
        return session;
    } catch (error) {
        console.log('Error in db: ', error);
        await sendMessage(chatId, `Welcome 👋*${userName}* to the game "*Who wants to be smart?*"`, newGame);
    }
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

async function sendGeneratedQuestion(session, chatId) {
    const questionData = await generatedQuestion(session.topic, session.difficulty);
    const { question, correctAnswer, uniqueIncorrectAnswers } = questionData;

    const allAnswers = [
        { answer: correctAnswer, callback_data: 'correct_answer' },
        ...uniqueIncorrectAnswers.map(answer => ({ answer, callback_data: 'incorrect_answer' }))
    ];

    const shuffledAnswers = shuffleArray([...allAnswers]);

    console.log("shuffledAnswers: " + shuffledAnswers);
    const gameQuestion = {
        reply_markup: {
            inline_keyboard: [
                ...shuffledAnswers.map(answerObj => [
                    { text: answerObj.answer.toString(), callback_data: answerObj.callback_data }
                ]),
                [{ text: "Finish", callback_data: 'newGame' }]
            ]
        }
    };
    return sendMessage(chatId, question, gameQuestion);
}

async function inDevelopment(chatId) {
    return sendMessage(chatId, 'In development...', back);
}