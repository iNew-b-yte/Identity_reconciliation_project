module.exports = function(err, req, res, next) {
    res.status(500).send({
        error: "Exception Occurred",
        message: err.message
    });
}