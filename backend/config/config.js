const path = require('path');
require('dotenv').config();

module.exports = {
    rootFolder: path.normalize(path.join(__dirname, '/../')),
    dbUrl: 'mongodb://localhost:27017/luncher-box'
};

