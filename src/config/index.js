require('dotenv').config();

module.exports = {
    app: {
        port: process.env.PORT || 8006, 
    },
    db: {
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017/horseRidingApp', // Default MongoDB URI
    },
    
    jwtSecret: process.env.JWT_SECRET || 'defaultSecretKey',
};
