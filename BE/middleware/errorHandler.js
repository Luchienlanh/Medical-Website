const errorHandler = (err, req, res, next) => {
    console.error('Error:', err)
    console.error('Stack:', err.stack)

    const statusCode = err.statusCode || 500
    const message = err.message || 'Da xay ra loi!'

    res.status(statusCode).json({
        success: false,
        message: message
    })


}