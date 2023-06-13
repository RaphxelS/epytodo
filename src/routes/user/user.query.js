const database = require('./../../config/db');
const jwt = require('jsonwebtoken');
const notFound = require('./../../middleware/notFound');

exports.get_all_user = function (res) {
    const cwd = process.cwd();
    database.query(`SELECT * FROM user`, function (err, results, fields) {
        if (err === null) {
            res.format ({
                json: function() {
                    res.status(200).json(results);
                },
                html: function() {
                    res.sendFile(`${cwd}/public/user.html`);
                }
            })
        } else {
            res.status(500).json({ "msg": "Internal server error" });
        }
    });
};

exports.get_user_todo = function (res, mail) {
    notFound.user_is_in_db(mail, function(ret) {
        if (ret === 0) {
            database.query(`SELECT todo.*
            FROM todo
            JOIN user ON user.id = todo.user_id
            WHERE user.email = '${mail}'`, function (err, results, fields) {
                res.status(200).json(results);
            });
        } else {
            res.status(500).json({"msg": "Not found"});
        }
    })
};

exports.get_user_info = function (res, param) {
    if (param.includes('@')) {
        database.query(`SELECT * FROM user WHERE email = '${param}'`, function (err, results, fields) {
            if (results.length != 0)
                res.status(200).json(results);
            else
                res.status(404).json({ "msg": "Not found" });
        });
    } else {
        database.query(`SELECT * FROM user WHERE id = '${param}'`, function (err, results, fields) {
            if (results.length != 0)
                res.status(200).json(results);
            else
                res.status(404).json({ "msg": "Not found" });
        });
    };
};

exports.add_user = function (res, email, name, fname, pass) {
    database.query(`INSERT INTO user (id, email, password, name, firstname)
    VALUES (${0}, '${email}', '${pass}', '${name}', '${fname}')`, async function (err, results, fields) {
        if (err === null) {
            const id = await get_user_id(res, email);
            if (id)
                res.cookie('id', id, {maxAge: 3600000});
            const token = jwt.sign({ email: email, password: pass }, process.env.SECRET, { expiresIn: 60 * 60 });
            res.format({
                json: function () {
                    res.cookie('token', token, {maxAge: 3600000});
                    res.status(201).json({ token });
                },
                html: function () {
                    res.cookie('token', token, {maxAge: 3600000});
                    res.status(201).send();
                }
            });
        } else
            res.status(500).json({ "msg": "Internal server error" });
    });
};

exports.is_mail_in_db = function (email, callback) {
    database.query(`SELECT * FROM user WHERE email = '${email}'`, function (err, results, fields) {
        if (results.length > 0)
            callback(1);
        else
            callback(0);
    });
};

exports.check_password = function (email, callback) {
    database.query(`SELECT password FROM user WHERE email = '${email}'`, function (err, results, fields) {
        if (results.length > 0)
            callback(results[0].password)
        else
            callback(null);
    });
};

exports.delete_user = function (res, id) {
    database.query(`SELECT * FROM user WHERE id = ${id}`, function (err, results, fields) {
        if (results != 0) {
            database.query(`DELETE FROM todo WHERE user_id = ${id}`, function (err, results, fields) {
                if (err === null) {
                    database.query(`DELETE FROM user WHERE id = ${id}`, function (err, results, fields) {
                        if (err === null) {
                            res.status(200).json({ "msg": `Successfully deleted record number : ${id}` });
                        } else {
                            res.status(500).json({ "msg": "Internal server error" });
                        }
                    });
                } else {
                    res.status(500).json({ "msg": "Internal server error" });
                }
            });
        } else {
            res.status(404).json({"msg":"Not found"});
        };
    });
};

exports.update_user = function (res, id, email, name, fname, pass) {
    database.query(`UPDATE user
    SET email = '${email}', name = '${name}', firstname = '${fname}', password = '${pass}'
    WHERE id = ${id}`, function (err, results, fields) {
        if (err === null) {
            database.query(`SELECT * FROM user WHERE id = ${id}`, function (err, results, fields) {
                res.status(200).json(results[0]);
            });
        } else {
            res.status(500).json({ "msg": "Internal server error" });
        };
    });
};

get_user_id = function(res, email) {
    return new Promise((resolve, reject) => {
        database.query(`SELECT id FROM user WHERE email = '${email}'`, function (err, results, fields) {
            if (err === null) {
                const id = parseInt(results[0].id);
                resolve(id);
            } else {
                reject(err);
            }
        });
    });
};

exports.get_user_id = get_user_id;
