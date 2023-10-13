const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class UserSession extends Model { }

UserSession.init({
    chatId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    userName: DataTypes.STRING,
    difficulty: DataTypes.STRING,
    topic: DataTypes.STRING
}, {
    sequelize,
    modelName: 'user_session',
    timestamps: true,
    freezeTableName: true
});

module.exports = { UserSession };