const User = require('../models/user');
const Token = require('../models/token');
const { handleError } = require('../utils/handleError');

export default {
    confirm: (req, res) => {
        Token.findOne({ token: req.params.token })
            .then(token => {
                if (!token) {
                    throw { 
                        status: 404,
                        name: 'Token not found' + token.token + '.' 
                    };
                }
                
                return token;
            })
            .then(token => User.findOne({ _id: token._userId }))
            .then(user => {
                if (!user) {
                    throw { 
                        status: 404,
                        msg: 'User not found ' + user.email + '.'
                    };
                }

                if (user.isVerified) {
                    res.status(200).send({
                        msg: 'This user has already been verified.'
                    });
                }

                user.isVerified = true;
                user.save();
            })
            .then(user => res.status(200).send({
                msg: 'User verified successfully!',
                user: user
            }))
            .catch((err) => handleError(err, res));
    }
};