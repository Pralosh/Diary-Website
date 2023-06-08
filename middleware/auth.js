exports.checkAuth = (req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
        next();
    } else {
        //return res.status(401).json({ message: "Not authorized" });
        res.redirect('/login');
    }
};