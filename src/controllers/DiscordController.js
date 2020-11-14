const axios = require('axios');
const { generateKey,generateAPIToken } = require('../utils');
const jwt = require('jsonwebtoken');

const { User } = require('../db/models');

function redirect() {
    return function(req,res) {
        return res.status(200).redirect('https://discordapp.com/api/oauth2/authorize?client_id=' + process.env.clientID + '&scope=identify&response_type=code&redirect_uri=' + encodeURIComponent(process.env.redirectURI));
    }
}

function callback() {
    return async function(req, res) {
        if (!req.query.code) {
            return res.status(400).json({ status: 400, error: 'Bad Request', message: 'Code query missing' });
        }

        try {
            const { data: authPayload } = await axios.post(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&redirect_uri=${encodeURIComponent(process.env.redirectURI)}`, `code=${req.query.code}`, {
                auth: {
                    username: process.env.clientID,
                    password: process.env.clientSecret,
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            const { data: userPayload } = await axios.get('http://discordapp.com/api/users/@me', {
                headers: {
                    'Authorization': `Bearer ${authPayload.access_token}`,
                },
            });
            const user = await User.findOne({ where: { user_id: userPayload.id } });

            if(user) {
                await User.update({
                    user_name: userPayload.username,
                    user_avatar: userPayload.avatar,
                    user_token: authPayload.access_token,
                }, {
                    where: { user_id: userPayload.id },
                });
            } else {
                const key = generateKey();
                const token = await generateAPIToken(userPayload.id, key, 100);

                await User.create({
                    user_id: userPayload.id,
                    user_name: userPayload.username,
                    user_avatar: userPayload.avatar,
                    user_token: authPayload.access_token,
                    user_token_refresh: authPayload.refresh_token,
                    token_key: key,
                    token,
                });
            }

            const key = await jwt.sign(authPayload.access_token, process.env.jwt_secret);
            res.cookies.set('auth', key);
        } catch (error) {
            console.error('Discord-Auth', error);
        }

        return res.redirect('/account');
    };
}

module.exports = {
    redirect,
    callback
}