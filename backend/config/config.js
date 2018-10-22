const path = require('path');
require('dotenv').config();

module.exports = {
    rootFolder: path.normalize(path.join(__dirname, '/../')),
    dbUrl: process.env.DB_IP
};

