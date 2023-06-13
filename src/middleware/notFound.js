const database = require('./../config/db');

exports.user_is_in_db = function(mail, callback) {
    database.query(`SELECT * FROM user WHERE email = '${mail}'`, function(err ,results, fields) {
        if (err === null)
            callback(0);
        else
            callback(1);
    });
}
