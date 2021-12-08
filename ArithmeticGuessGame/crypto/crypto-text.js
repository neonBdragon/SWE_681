const { encrypt, decrypt } = require('./crypto');
const prompt = require('prompt');
const fs = require('fs');

prompt.start();
prompt.get(['username', 'password'], function (err, result) {
    if (err) { return onErr(err); }
    console.log('Input received!');
    encode(result);
});

function onErr(err) {
    console.log(err);
    return 1;
}

function encode(result) {
    const hashUser = encrypt(result.username);
    const hashPass = encrypt(result.password);

    var outputData = {
        table: []
    };

    outputData.table.push({user: hashUser, pass: hashPass});
    var json = JSON.stringify(outputData);

    var outputJSON = JSON.stringify(outputData);

    function callback() {
        console.log('Wrote file!');
    }

    fs.writeFile('rps/config/cred.json', json, 'utf8', callback);
}
