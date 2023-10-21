const { bot } = require('./src/bot/bot.js');
const { newGame, rulesAndDonation, modeList, difficultyModes, back, payRespect, placeholder } = require('./src/bot/opts.js');
const { rules, selectDifficulty, ACTIONS } = require('./src/bot/text.js');
const { setDifficulty, findOrCreateUser, setTopicAndSave } = require('./src/bot/services/userService.js')
const { inDevelopment, sendGeneratedQuestion, sendMessage } = require('./src/bot/commands.js')

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
        console.log("username: ", callbackQuery.from.username);
        console.log("message: ", callbackQuery.message.text);


        const chatId = callbackQuery.from.id;
        const userName = callbackQuery.from.username;
        const action = callbackQuery.data;

        let session = await findOrCreateUser(chatId, userName);

        switch (action) {
            case ACTIONS.NEW_GAME:
            case ACTIONS.BACK:
                resetData(session);
                console.log('Button clicked: ', action);
                await sendMessage(chatId, `*${userName}*, rules are simple - answer on questions right!`, rulesAndDonation);
                break;

            case ACTIONS.GET_STARTED:
                console.log('Button clicked: ', action);
                await sendMessage(chatId, 'Pick a game mode: ', modeList);
                break;

            case ACTIONS.PLACEHOLDER:
            case ACTIONS.PAY_RESPECT:
            case ACTIONS.ACHIEVEMENTS:
                console.log('Button clicked: ', action);
                await inDevelopment(chatId);
                break;

            case ACTIONS.RULES:
                console.log('Button clicked: ', action);
                await sendMessage(chatId, rules, back);
                break;

            case ACTIONS.ADDITION:
            case ACTIONS.SUBTRACTION:
            case ACTIONS.MULTIPLICATION:
            case ACTIONS.RANDOM:
                console.log('Button clicked: ', action);
                await setTopicAndSave(session, action);
                console.log('Topic set: ', action);
                await sendMessage(chatId, selectDifficulty, difficultyModes);
                break;

            case ACTIONS.EASY:
            case ACTIONS.NORMAL:
            case ACTIONS.HARDCORE:
                console.log('Button clicked: ', action);
                await setDifficulty(session, action);
                console.log('Topic set: ', action);
                try {
                    if (!session.topic || !session.difficulty) {
                        await sendMessage(chatId, `Welcome 👋*${userName}* to the game "*Who wants to be smart?*"`, newGame);
                    } else {
                        session.questionNumber = 1;
                        session.score = 0;
                        await sendGeneratedQuestion(session, chatId);
                        console.log('Question sent');
                    }
                } catch (error) {
                    console.log('Error: ', error);
                }
                break;

            case ACTIONS.CORRECT_ANSWER:
                sendMessage(chatId, `Correct!`, {})
                    .then(() => {
                        if (session.answered) {
                            return;
                        }
                        clearTimeout(session.timerId);
                        session.answered = true;
                        session.questionNumber++;
                        session.score += session.price;
                        questionTimeout = setTimeout(() => {
                            sendGeneratedQuestion(session, chatId);
                        }, 1500)
                    })
                    .catch(error => {
                        console.log('Error: ', error);
                    });
                break;
            case ACTIONS.INCORRECT_ANSWER:
                sendMessage(chatId, `Incorrect!`, {})
                    .then(() => {
                        if (session.answered) {
                            return;
                        }
                        clearTimeout(session.timerId);
                        session.answered = true;
                        session.questionNumber++;
                        session.score -= session.fine;
                        questionTimeout = setTimeout(() => {
                            sendGeneratedQuestion(session, chatId);
                        }, 1500)
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

function resetData(session) {
    session.questionNumber = null;
    clearTimeout(session.timerId);
}
