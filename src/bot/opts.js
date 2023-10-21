const newGame = {
    parse_mode: 'Markdown',
    reply_markup: {
        inline_keyboard: [
            [{ text: "Get smarter!", callback_data: 'new_game' }]
        ]
    }
};

const rulesAndDonation = {
    parse_mode: 'Markdown',
    reply_markup: {
        inline_keyboard: [
            [{ text: "Let's get started!🚀", callback_data: 'get_started' }],
            [{ text: "Pay respect to the author👍", callback_data: 'pay_respect' }],
            [{ text: "Achievements🎯", callback_data: 'achievements' }],
            [{ text: "Rules📖", callback_data: 'rules' }]
        ]
    }
};

const modeList = {
    parse_mode: 'Markdown',
    reply_markup: {
        inline_keyboard: [
            [{ text: "addition➕", callback_data: 'addition' }],
            [{ text: "subtraction", callback_data: 'subtraction' }],
            [{ text: "multiplication*️⃣", callback_data: 'multiplication' }],
            [{ text: "random🎲", callback_data: 'random' }],
            [{ text: "Back", callback_data: 'back' }]
        ]
    }
};

const difficultyModes = {
    parse_mode: 'Markdown',
    reply_markup: {
        inline_keyboard: [
            [{ text: "easy", callback_data: 'easy' }],
            [{ text: "normal", callback_data: 'normal' }],
            [{ text: "hardcore", callback_data: 'hardcore' }],
            [{ text: "Back", callback_data: 'back' }]
        ]
    }
};


const back = {
    parse_mode: 'Markdown',
    reply_markup: {
        inline_keyboard: [
            [{ text: "Back", callback_data: 'back' }]
        ]
    }
};

const tryAgain = {
    parse_mode: 'Markdown',
    reply_markup: {
        inline_keyboard: [
            [{ text: "Try again ⬇️", callback_data: 'back' }]
        ]
    }
};

const playAgain = {
    parse_mode: 'Markdown',
    reply_markup: {
        inline_keyboard: [
            [{ text: "Play again ⬇️", callback_data: 'back' }]
        ]
    }
};

const payRespect = {
    parse_mode: 'Markdown',
    reply_markup: {
        inline_keyboard: [
            [{ text: "In development...", callback_data: 'pay_respect' }]
        ]
    }
};

const placeholder = {
    parse_mode: 'Markdown',
    reply_markup: {
        inline_keyboard: [
            [{ text: "In development...", callback_data: 'placeholder' }]
        ]
    }
};


module.exports = { newGame, rulesAndDonation, modeList, difficultyModes, back, payRespect, placeholder, tryAgain, playAgain };