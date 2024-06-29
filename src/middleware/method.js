// middleware/methodOverride.js
module.exports = function(req, res, next) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        req.method = req.body._method;
        delete req.body._method;
    }
    next();
};
