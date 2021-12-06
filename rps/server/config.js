const dotenv = require('dotenv');
dotenv.config(); //Loads file content into environment variables

const Crypto = require('crypto')
function randomString(size = 128) {
    return Crypto
        .randomBytes(size)
        .toString('base64')
        .replace(/\//g,'_') //Replaces / with _
        .replace(/\+/g,'-') //Replaces + with -
        .slice(0, size)
}

<<<<<<< HEAD
module.exports = { //Renaming of environment variables
=======
module.exports = {
>>>>>>> 350a3c109afd6a4c57dc819037d326572ea6b3e9
    port: process.env.SERVER_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    pass: process.env.DB_PASSWORD,
    base: process.env.DB_NAME,
    secret: randomString()
}