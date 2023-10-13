const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Achievements extends Model { }

Achievements.init({
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    game_mode: DataTypes.STRING,
    difficulty: DataTypes.STRING,
    score: DataTypes.INTEGER
}, {
    sequelize,
    modelName: 'achievements'
});

module.exports = { Achievements };