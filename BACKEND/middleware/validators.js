const Validator = require('validatorjs');
const Users = require('../models/userModel');
const sequelize = require('../config/database');

// new version 
Validator.registerAsync('unique', async function (value, attribute, req, passes) {
    const table = attribute.split(",")[0];  // 0 = tablename , 1 = columnname
    const comumn = attribute.split(",")[1];

    sequelize.query(`SELECT * FROM ${table} Where ${comumn} = "${value}" LIMIT 1`)
        .then(([results]) => {
            return (results.length == 0)
                ? passes()
                : passes(false, `The ${req} already exists in ${table} table !`)
        }).catch((error) => {
            return passes(false, error.message)
        });
});


Validator.registerAsync('exist', async function (value, attribute, req, passes) {
    const table = attribute.split(",")[0];  // 0 = tablename , 1 = columnname
    const comumn = attribute.split(",")[1];

    sequelize.query(`SELECT * FROM ${table} Where ${comumn} = "${value}" LIMIT 1`)
        .then(([results]) => {
            return (results.length == 0)
                ? passes(false, `The ${req} not exists !`)
                : passes()
        }).catch((error) => {
            return passes(false, error.message)
        });
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
