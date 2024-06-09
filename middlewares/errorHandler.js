const errorHandler = (err, req, res) => {
    const errorStatus = err.statusCode || 500;
    const errorMessage = err.message || 'Something went wrong';

    res.status(errorStatus).json({
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    })
}

module.exports = errorHandler;