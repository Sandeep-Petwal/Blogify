exports.success = (res, statusCode, message, data) => {
    return res.status(statusCode).json({ message, data });
};


exports.failled = (res, statusCode, message) => {
    return res.status(statusCode).json({ message });
};

