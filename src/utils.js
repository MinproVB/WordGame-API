const jwt = require('jsonwebtoken');

const generateAPIToken = (user_id, key, limit) => {
    return jwt.sign({
        user_id,
        limit,
        key,
        created_at: 12,
    }, process.env.jwt_secret);
};

const generateKey = () => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 50; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const random = (items) => {
    return items[Math.floor(Math.random() * items.length)];
};

module.exports = {
    generateAPIToken,
    generateKey,
    random
}