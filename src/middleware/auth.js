const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const auth_header = req.headers.authorization;
    const cookie = req.headers.cookie;

    if (auth_header == null) {
        if (cookie != null) {
            const tokenStartIndex = cookie.indexOf("token=") + 6;
            const token = cookie.substring(tokenStartIndex);
            jwt.verify(token, process.env.SECRET, (err, user) => {
                if (err != null) {
                    return res.status(401).json({"msg":"Token is not valid"});
                }
                req.use = user.id;
                next();
            });
        } else
            res.status(401).json({"msg":"No token , authorization denied"});
    } else if (cookie == null) {
        if (auth_header != null) {
            const token = auth_header.split(' ')[1];
            jwt.verify(token, process.env.SECRET, (err, user) => {
                if (err != null) {
                    return res.status(498).json({"msg":"Token is not valid"});
                }
                req.use = user.id;
                next();
            });
        } else
            res.status(401).json({"msg":"No token , authorization denied"});
    } else
        res.status(401).json({"msg":"No token , authorization denied"});
};
