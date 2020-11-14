const jwt = require('jsonwebtoken');
const axios = require('axios');

const { User } = require('../db/models');

module.exports = function() {
    return async function(req, res, next) {
        const auth = res.cookies.get('auth');

        if(auth) {
            const token = await jwt.verify(auth,process.env.jwt_secret);
            try {
                const { data } = await axios.get('http://discordapp.com/api/users/@me', { headers: { 'Authorization': `Bearer ${token}` } });
                const user = await User.findOne({ where: { user_id: data.id }, raw: true });
                req.user = user;
            } catch (error) {
                console.error('Auth-Web:', error);
            }
        }
        next();
    };
};