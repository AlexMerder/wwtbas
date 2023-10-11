const { bot } = require('./src/bot/bot.js');
const { UserSession } = require('./src/models/user_session.js');
const { newGame, rulesAndDonation, modeList, difficultyModes, back, payRespect, placeholder } = require('./src/bot/opts.js');
const { generatedQuestion, updateSessionActions } = require('./src/bot/commands.js');
const { rules, selectDifficulty } = require('./src/bot/text.js');

bot.onText(/\/start/, async (msg) => {
    console.log("message: ", msg);
    const chatId = msg.chat.id;
    const userName = msg.from.username || "User";

    let session = await UserSession.findOne({ where: { chatId: chatId } });
    if (session) {
        session.actions = [];
        session.topic = null;
        session.difficulty = null;
        await session.save();
    } else {
        await UserSession.create({ chatId: chatId, userName: userName });
    }
    await bot.sendMessage(chatId, 'Welcome 👋*' + userName + '* to the game "*Who wants to be smart?*"', newGame);
});

bot.on('callback_query', async (callbackQuery) => {


    try {
        console.log("callBack: ", callbackQuery);

        const chatId = callbackQuery.from.id;
        const userName = callbackQuery.from.username;
        const action = callbackQuery.data;

        let session = await UserSession.findOne({ where: { chatId: chatId } });

        if (!session) {
            session = await UserSession.create({ chatId: chatId, userName: userName });
        }

        await updateSessionActions(session, action);
        await session.save();

        console.log('user session: ' + session.toJSON());
        switch (action) {
            case 'new_game':
                await bot.sendMessage(chatId, '*' + userName + '*, rules are simple - answer on questions right! ', rulesAndDonation);
                break;

            case 'pay_respect':
                //todo implement telegram payments api 
                await bot.sendMessage(chatId, 'In development...', back);
                break;

            case 'achievements':
                //todo implement request to the db and get all achievements
                await bot.sendMessage(chatId, 'In development...', back);
                break;

            case 'back':
                await bot.sendMessage(chatId, '*' + userName + '*, rules are simple - answer on questions right! ', rulesAndDonation);
                break;

            case 'get_started':
                //todo initiate the game and start to write state of this game
                await bot.sendMessage(chatId, 'Pick a game mode: ', modeList);
                break;

            case 'rules':
                await bot.sendMessage(chatId, rules, back);
                break;

            case 'addition':
            case 'subtraction':
            case 'multiplication':
            case 'random':
                switch (action) {
                    case 'addition':
                        topic = 'addition';
                        session.set({ topic: topic });
                        await session.save();
                        break;
                    case 'subtraction':
                        topic = 'subtraction';
                        session.set({ topic: topic })
                        await session.save();
                        break;
                    case 'multiplication':
                        topic = 'multiplication';
                        session.set({ topic: topic })
                        await session.save();
                        break;
                    case 'random':
                        topic = 'random';
                        session.set({ topic: topic })
                        await session.save();
                        break;
                    default:
                        topic = "";
                }
                await bot.sendMessage(chatId, selectDifficulty, difficultyModes);
                break;

            case 'easy_mode':
            case 'normal_mode':
            case 'hardcore_mode':
                switch (action) {
                    case 'easy_mode':
                        difficulty = 'easy';
                        session.set({ difficulty: difficulty });
                        await session.save();
                        break;
                    case 'normal_mode':
                        difficulty = 'normal';
                        session.set({ difficulty: difficulty });
                        await session.save();
                        break;
                    case 'hardcore_mode':
                        difficulty = 'hardcore';
                        session.set({ difficulty: difficulty });
                        await session.save();
                        break;
                }

                console.log('Session : ' + session.dataValues);

                if (!session.topic || !session.difficulty) {
                    await bot.sendMessage(chatId, 'Welcome *' + userName + '* to the game "*Who wants to be smart*" 👋', newGame);
                }

                const questionData = await generatedQuestion(session.topic, session.difficulty);
                console.log(questionData);
                const { question, correctAnswer, uniqueIncorrectAnswers } = questionData;

                console.log(uniqueIncorrectAnswers);

                const game = {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: correctAnswer.toString(), callback_data: 'pay_respect' }],
                            [{ text: uniqueIncorrectAnswers[0].toString(), callback_data: 'pay_respect' }],
                            [{ text: uniqueIncorrectAnswers[1].toString(), callback_data: 'pay_respect' }],
                            [{ text: uniqueIncorrectAnswers[2].toString(), callback_data: 'pay_respect' }]
                        ]
                    }
                };

                await bot.sendMessage(chatId, question, game);
                break;

            default:
                await bot.sendMessage(chatId, 'Welcome *' + userName + '* to the game "*Who wants to be smart*" 👋', newGame);
        }
    } catch (error) {
        console.log('Error: ' + error);
    }
});