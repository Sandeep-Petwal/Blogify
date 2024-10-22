import Validator from 'validatorjs';
import { Model } from '../Database/sequelize.js';
import _ from "lodash";

const hasDuplicates = (arr) => arr.some((e, i, arr) => arr.indexOf(e) !== i);

Validator.registerAsync('distinct', function (columnValue, attribute, req, passes) {

    let grp = _.map(columnValue, 'currency');

    if(hasDuplicates(grp)){
        return passes(false, "Currency should be unique");
    }

    return passes(); 
});

Validator.registerAsync('unique', function (columnValue, attribute, req, passes) {
    const attr = attribute.split(",");  // 0 = tablename , 1 = columnname
    Model.query(`SELECT * FROM ${attr[0]} Where ${attr[1]} = "${columnValue}" LIMIT 1`).then(([results]) => {
        return (results.length == 0) ? passes() : passes(false, `The ${req} has already been taken.`);
    }).catch((error) => {
        return passes(false, error.message)
    });
});

Validator.registerAsync('exists', function (columnValue, attribute, req, passes) {

    const attr = attribute.split(",");  // 0 = tablename , 1 = columnname
    Model.query(`SELECT * FROM ${attr[0]} Where ${attr[1]} = "${columnValue}" LIMIT 1`).then(([results]) => {
        return (results.length == 0) ? passes(false, `The ${req} is not Exists.`) : passes();
    }).catch((error) => {
        return passes(false, error.message)
    });
});

Validator.registerAsync('exists-except', function (columnValue, attribute, req, passes) {
    const attr = attribute.split(",");  // 0 = tablename , 1 = columnname, 2 = expect column, 3 = expect column value
    Model.query(`SELECT * FROM ${attr[0]} Where ${attr[1]} = "${columnValue}" AND ${attr[2]} != ${attr[3]} LIMIT 1`).then(([results]) => {
        return (results.length > 0) ? passes(false, `The ${req} is Already Exists.`) : passes();
    }).catch((error) => {
        return passes(false, error.message)
    });
});

Validator.registerAsync('gte', function (columnValue, attribute, req, passes) {
 
    if(parseFloat(attribute) > parseFloat(columnValue)){
        return passes(false, `The ${req} should be greater than or equal to ${attribute}`);
    }else{
       return passes();
    } 
});

Validator.registerAsync('gt', function (columnValue, attribute, req, passes) {
     
    if(parseFloat(attribute) >= parseFloat(columnValue)){
        return passes(false, `The ${req} should be greater than ${attribute}`);
    }else{
       return passes();
    } 
});

Validator.registerAsync('lt', function (columnValue, attribute, req, passes) {
 
    if(parseFloat(columnValue) > parseFloat(attribute)){
        return passes(false, `The ${req} should be less than ${attribute}`);
    }else{
       return passes();
    } 
});


const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/;
Validator.register('password_regex', value => passwordRegex.test(value), "Password must contain at least one uppercase letter, one lowercase letter and one number");

const upiRegex = /^[\w.-]+@[\w.-]+$/;
Validator.register('upi_regex', value => upiRegex.test(value), "UPI ID Format is Invalid");

const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
Validator.register('ifsc_regex', value => ifscRegex.test(value), "IFSC Code Format is Invalid");

const dateRegex = /[1-2]\d{3}-(0[1-9]|1[0-2])-(3[0-1]|[1-2]\d|0[1-9])T(0\d|1[0-2])(:[0-5]\d){2}.\d{3}Z/;
Validator.register('date_regex', value => dateRegex.test(value), "Date format is invalid");

const decimalRegex = /^\d+(\.\d{1,8})?$/;
Validator.register('decimal_regex', value => decimalRegex.test(value), "Only allowed 8 decimal");

const countryCodeRegex = /^\+\d{1,3}$/;
Validator.register('country_code_regex', value => countryCodeRegex.test(value), "Invalid Country Code");


const firstError = (validation) => {
    const firstkey = Object.keys(validation.errors.errors)[0];
    return validation.errors.first(firstkey);
}


function validate(request, rules, messages = {}) {

    if (typeof request != 'object' || typeof rules != 'object' || typeof messages != 'object') {
        return {
            status: 0,
            message: 'Invalid Params'
        }
    }
    let validation = new Validator(request, rules, messages);

    return new Promise((resolve, reject) => {
        validation.checkAsync(() => resolve({ status: 1, message: "" }), () => reject({ status: 0, message: firstError(validation) }))
    }).then(r => r).catch(err => err);

}

export default validate;

let { status, message } = await CValidator(request, {
    plan_id: "required|exists:plans,id",
    courses_ids: "required|array",
  });


  // validator.js > blogify
  const Validator = require('validatorjs');
const Users = require('../models/userModel');

// registering custom async validation rule for email availability
Validator.registerAsync('exist', async function (email, attribute, req, passes) {
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

// new version






// check if email registered or not , for login  
Validator.registerAsync('notRegistered', async function (email, attribute, req, passes) {
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
