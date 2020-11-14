const jwt = require('jsonwebtoken');
const { User } = require('../db/models');

module.exports = function() {
    return async function(req,res,next) {
        var headerToken = req.header('Authorization');

        if(!headerToken) {
            return res.status(401).json({status: 401, message: 'Token is required'});
        }

        const user = await User.findOne({where: {token: headerToken}}); 

        if(user) {
            if(user.token == headerToken) {
                return next();
            } else {
                return res.status(401).json({status: 401, message: 'invalid token'});
            }
        } else {
            return res.status(401).json({status: 401, message: 'invalid token'});
        }
    }
}