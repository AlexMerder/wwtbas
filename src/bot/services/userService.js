const { UserSession } = require("../../models/user_session");
const { sendMessage } = require("../commands");
const { newGame } = require("../opts");


const sessionCache = new Map();

async function setDifficulty(session, difficulty) {
    try {
        session.difficulty = difficulty;
        await session.save();
        const cacheKey = `${session.chatId}-${session.userName}`;
        sessionCache.set(cacheKey, session);
        console.log('Difficulty has been set: ' + difficulty);
    } catch (error) {
        console.log('Error in db: ', error);
        await sendMessage(session.chatId, `Welcome 👋*${session.userName}* to the game "*Who wants to be smart?*"`, newGame);
    }
}

async function setTopicAndSave(session, topic) {
    try {
        session.topic = topic;
        await session.save();
        const cacheKey = `${session.chatId}-${session.userName}`;
        sessionCache.set(cacheKey, session);
        console.log('Topic has been set: ' + topic);
    } catch (error) {
        console.log('Error in db: ', error);
        await sendMessage(session.chatId, `Welcome 👋*${session.userName}* to the game "*Who wants to be smart?*"`, newGame);
    }
}

async function findOrCreateUser(chatId, userName) {

    const cacheKey = `${chatId}-${userName}`;

    if (sessionCache.has(cacheKey)) {
        console.log('Session received from cache: ', cacheKey)
        return sessionCache.get(cacheKey);
    }

    if (userName) {
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
        } else {
            return null;
        }
    }

module.exports = { setDifficulty, findOrCreateUser, setTopicAndSave }