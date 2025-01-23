const bcrypt = require('bcrypt');
const crypto = require('crypto');
const saltRounds = 10;
const Token = require('../model/token');

exports.hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        throw new Error('Error hashing password');
    }
};

exports.generateVerificationToken = async (userId) => {
    try {
        const token = crypto.randomBytes(32).toString('hex');
        await new Token({ userId, token }).save();
        return token;
    } catch (error) {
        throw new Error('Error generating verification token');
    }
};
