const bcrypt = require('bcrypt');
const crypto = require('crypto');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const Token = require('../../model/token');

exports.hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        throw new Error('Error hashing password');
    }
};


exports.generateVerificationToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h', // Default to 1 hour
    });
};


