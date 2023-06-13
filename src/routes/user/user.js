const user = require('./user.query');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');

module.exports = function(app, bcrypt) {
    app.get('/user', auth, function(req, res) {
        user.get_all_user(res);
    });
    app.get('/user/todos', auth, function(req, res) {
        const head = req.headers.authorization
        const token = head.split(' ')[1];
        const mail = jwt.decode(token).email;
        user.get_user_todo(res, mail);
    });
    app.get('/users/:id', auth, function(req, res) {
        user.get_user_info(res, req.params.id);
    });
    app.delete('/users/:id', auth, function(req, res) {
        user.delete_user(res, req.params.id);
    })
    app.put('/users/:id', auth, function(req, res) {
        const email = req.body.email;
        const name = req.body.name;
        const fname = req.body.firstname;
        var pass = req.body.password;
        if (email === undefined || name === undefined  ||
        fname === undefined || pass === undefined) {
            res.status(400).json({"msg":"Bad parameter"});
            return;
        }
        pass = bcrypt.hashSync(pass, 10);
        user.update_user(res, req.params.id, email, name, fname, pass);
    })
};
