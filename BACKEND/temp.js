

// crreate user function 
exports.createUser = async (req, res) => {
    let { name, email, bio, password } = req.body;
    const rules = {
        name: "required|string|min:3|max:50",
        password: "required|string|min:3",
        bio: "max:200|string",
        email: "required|email|email_available"
    };

    let { status, message } = await validate({ name, email, bio, password }, rules);
    console.table({ status, message });

    if (!status) {
        return res.status(400).json({ message });
    }

    // validation passes
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Users.create({ name, email, bio, password: hashedPassword });
        return res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        return res.status(400).json({ message: "Error registering the user!", error });
    }
};




// validation logics
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







  


