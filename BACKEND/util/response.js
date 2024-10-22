
exports.success = (res, message = 'Success', data = []) => {
    return res.status(200).json({ message, data });

};

exports.created = (res, data, message = 'Resource created successfully') => {
    return res.status(201).json({ message, data });
};

exports.failed = (res, error, message = 'Request failed') => {
    return res.status(400).json({ error, message });

};

exports.notFound = (res, error, message = 'Request failed') => {
    return res.status(404).json({ message, error });

};

exports.unauthorized = (res, message = 'Unauthorized access') => {
    return res.status(401).json({ message });
};

exports.serverError = (res, error = "Internal server error", message = 'Internal server error') => {
    return res.status(500).json({ message, error });

};

exports.noContent = (res, error = "No content") => {
    return res.status(204).json({ error });
};



// return response.success(res, "Blog updated successfully !", updatedBlog)
// return response.noContent(res)
// return response.serverError(res);
// return response.unauthorized(res, "User is not Author")
// return response.notFound(res, "No blogs found for the user");
// return response.failed(res, "Provide currect information !", message)
