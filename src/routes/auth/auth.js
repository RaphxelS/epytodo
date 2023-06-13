const user = require('./../user/user.query');
const jwt = require('jsonwebtoken');

module.exports = function(app, bcrypt) {
    app.get('/register', function(req, res) {
        const cwd = process.cwd();
        res.sendFile(`${cwd}/public/register.html`);
    });
    app.post('/register', function(req, res) {
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
        user.is_mail_in_db(email, async function(is_in) {
            if (is_in === 0) {
                user.add_user(res, email, name, fname, pass);
            } else
            res.status(409).json({"msg":"account already exist"});
        })
    });
    app.get('/login', function(req, res) {
        const cwd = process.cwd();
        res.sendFile(`${cwd}/public/login.html`);
    });
    app.post('/login', function(req, res) {
        const email = req.body.email;
        const pass = req.body.password;

        if (email === undefined || pass === undefined) {
                res.status(400).json({"msg":"Bad parameter"});
                return;
        }
        user.check_password(email, async function(hash) {
            if (hash) {
                const id = await user.get_user_id(res, email);
                if (bcrypt.compareSync(pass, hash) === true) {
                    const token = jwt.sign({email:email, password:pass}, process.env.SECRET, { expiresIn: 60 * 60 });
                    if (id)
                        res.cookie('id', id, {maxAge: 3600000});
                    res.format({
                        json: function () {
                            res.cookie('token', token, {maxAge: 3600000});
                            res.status(200).json({ token });
                        },
                        html: function () {
                            res.cookie('token', token, {maxAge: 3600000});
                            res.status(200).send(`<p>Your token is : ${token}</p>`);
                        }
                    });
                } else {
                    res.status(409).json({"msg":"Invalid Credentials"});
                }
            } else
                res.status(500).json({"msg":"Internal server error"});
        })
    });
};
