const Validator = require('validatorjs');
const Users = require('../models/userModel');

// registering custom async validation rule for email availability
Validator.registerAsync('email_available', async function (email, attribute, req, passes) {
    try {
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
            return passes(false, 'Email already registered !');
        }
        return passes(); // Email available
    } catch (error) {
        return passes(false, 'Error while checking email availability.');
    }
});

// check if email registered or not , for login  
Validator.registerAsync('email_registered', async function (email, attribute, req, passes) {
    try {
        const existingUser = await Users.findOne({ where: { email } });
        if (!existingUser) {
            return passes(false, 'User is not registered !');
        }
        return passes(); // email is available
    } catch (error) {
        return passes(false, 'error while checking email availability.');
    }
});

// check if user with user_id found
Validator.registerAsync('user_registered', async function (user_id, attribute, req, passes) {
    try {
        const existingUser = await Users.findOne({ where: { user_id } });
        if (!existingUser) {
            return passes(false, 'User with this user id not found !');
        }
        return passes(); // email is available
    } catch (error) {
        return passes(false, 'error while checking user availability.');
    }
});
 

const getFirstErrorMessage = (validation) => {
    const firstKey = Object.keys(validation.errors.errors)[0];
    return validation.errors.first(firstKey);
}

// validating input against rules and return a promise
function validate(request, rules, messages = {}) {
    if (typeof request !== 'object' || typeof rules !== 'object' || typeof messages !== 'object') {
        return { status: 0, message: 'Invalid Params' };
    }

    const validation = new Validator(request, rules, messages);
    return new Promise((resolve, reject) => {
        validation.checkAsync(
            () => resolve({ status: 1, message: "Validation Passes" }), // Validation passed
            () => reject({ status: 0, message: getFirstErrorMessage(validation) }) // Validation failed
        );
    }).then(result => result) // optional
        .catch(err => err); // errors in promise
}

module.exports = validate;
