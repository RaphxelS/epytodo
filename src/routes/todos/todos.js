const todos = require('./todos.query');
const auth = require('../../middleware/auth');

module.exports = function(app, bcrypt) {
    app.get('/todos', auth, function(req, res) {
        todos.get_all_todos(res);
    });
    app.get('/todos/:id', auth, function(req, res){
        todos.get_todos(res, req.params.id);
    });
    app.post('/todos', auth, function(req, res) {
        const title = req.body.title;
        const desc = req.body.description;
        const date = req.body.due_time;
        const user_id = req.body.user_id;
        const status = req.body.status;
        todos.add_todo(res, title, desc, date, user_id, status);
    });
    app.put('/todos/:id', auth, function(req, res) {
        const id = req.params.id;
        const title = req.body.title;
        const date = req.body.due_time;
        const desc = req.body.description;
        const user_id = req.body.user_id;
        const status = req.body.status;
        if (id === undefined || title === undefined  ||
            date === undefined || desc === undefined ||
            user_id === undefined) {
                res.status(400).json({"msg":"Bad parameter"});
                return;
            }
        todos.update_todo(res, id, title, desc, user_id, status, date);
    });
    app.delete('/todos/:id', auth, function(req, res) {
        todos.delete_todo(res, req.params.id);
    })
};
