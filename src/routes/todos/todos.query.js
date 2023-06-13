const database = require('./../../config/db');

exports.get_all_todos = function(res) {
    database.query(`SELECT * FROM todo`, function(err, results, fields) {
        res.status(200).json(results);
    });
};

exports.get_todos = function(res, id) {
    database.query(`SELECT * FROM todo WHERE id = ${id}`, function(err, results, fields) {
        if (err === null)
            res.status(200).json(results);
        else
            res.status(500).json({"msg":"Not found"});
    });
};

exports.add_todo = function(res, title, desc, date, user_id, status) {
    database.query(`INSERT INTO todo (id, title, description, due_time, status, user_id)
    VALUES (${0}, '${title}', '${desc}', '${date}', '${status}', ${user_id})`, function(err, results, fields) {
        if (err === null) {
            const id = results.insertId;
            database.query(`SELECT * FROM todo WHERE id = ${id}`, function(err, results, fieds) {
                res.status(200).json(results[0]);
            });
        } else {
            console.log(err);
            res.status(500).json({"msg":"Internal server error"});
        };
    });
};

exports.update_todo = function(res, id, title, desc, user_id, status, date) {
    database.query(`UPDATE todo
    SET title = '${title}', description = '${desc}', user_id = '${user_id}', due_time = '${date}', status = '${status}'
    WHERE id= ${id}`, function(err, results, fields) {
        if (err === null) {
            database.query(`SELECT * FROM todo WHERE id = ${id}`, function(err, results, fieds) {
                res.status(200).json(results[0]);
            });
        } else {
            res.status(500).json({"msg":"Internal server error"});
        };
    });
};

exports.delete_todo = function(res, id) {
    database.query(`DELETE FROM todo WHERE id = ${id}`, function(err, results, fields) {
        if (err === null) {
            res.status(200).json({"msg":`Succesfully deleted record number: ${id}`});
        } else {
            res.status(500).json({"msg":"Internal server error"});
        };
    });
};
