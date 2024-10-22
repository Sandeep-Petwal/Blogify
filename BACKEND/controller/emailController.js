const { Users, Templates, Tempusers } = require("../models")
const bcrypt = require('bcryptjs');
const handlebars = require('handlebars');
const nodeMailer = require('../util/nodeMailer');
const validate = require('../middleware/validators');
const response = require("../util/response")


exports.sendForgetPassMail = async (req, res) => {
    const { email } = req.body;
    const rules = {
        email: "email|required|string|exist:users,email"
    }

    let { status, message } = await validate({ email }, rules);
    if (!status) {
        return response.failed(res, "Provide currect information !", message)
    }

    try {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const template = await Templates.findOne({ where: { template_id: 2 } })
        if (!template) {
            throw new Error('Email template not found');
        }

        const compiledHtmlTemplate = handlebars.compile(template.html);
        const html = compiledHtmlTemplate({ otp });
        const compiledTextTemplate = handlebars.compile(template.text);
        const text = compiledTextTemplate({ otp });

        // Send the email
        await nodeMailer.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: template.subject,
            text,
            html
        });
        const updatedUser = await Users.update({ otp }, { where: { email } });
        if (updatedUser[0] === 0) {
            return response.failed(res, "Error Processign OTP", "Error Processing OTP")
        }
        return response.success(res, "OTP sent to your registered email")
    } catch (error) {
        return response.serverError(res);
    }
}


exports.verifyForgetPassword = async (req, res) => {
    let { otp, email, password } = req.body;
    otp = parseInt(otp);

    const rules = {
        otp: "required|numeric",
        email: "required|email",
        password: "required|min:3"
    }

    let { status, message } = await validate({ otp, email, password }, rules);
    if (!status) {
        return response.failed(res, "Provide currect information !", message)
    }

    try {
        // if user exists
        console.log("\nFinding user in db \n");
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            console.log("user does not exist");
            return response.notFound(res, "No blogs found for the user");
        }

        // console.log(user);
        console.log("\n Matching the otp user.otp :" + user.otp + " otp : " + otp);
        if (user.otp !== otp) {
            return response.failed(res, "Otp does not match", "Otp does not match")
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedOtp = 0;  // ddelete the existing otp in db

        const updatePassword = await Users.update({ password: hashedPassword, otp: updatedOtp }, {
            where: { email }
        });

        if (updatePassword[0] === 0) {
            console.log("Error in updating the password !");
            return response.failed(res, "Error updating password", "Error updating password")
        }
        return response.success(res, "Successfully updated the password",)

    } catch (error) {
        console.error("Error in verifyOtp:", error);
        return response.serverError(res);
    }
};


// create a temp user , send otp to provided email and storre otp to tempuser model
exports.createTempUser = async (req, res) => {
    console.log("\ninside :: createTempUser\n");

    let { name, email, bio, password } = req.body;

    const rules = {
        email: "required|email|unique:users,email",
        name: "required|string|min:3",
        password: "required|string"
    }

    let { status, message } = await validate({ name, email, password }, rules);
    if (!status) {
        return response.failed(res, "Provide currect information !", message)
    }


    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("\n user not exists, now sending OTP email:\n");


        // get the html, text, subject from db
        const verification_otp = Math.floor(100000 + Math.random() * 900000);
        const template = await Templates.findOne({ where: { template_id: 1 } })
        if (!template) {
            throw new Error('Email template not found');
        }

        const compiledHtmlTemplate = handlebars.compile(template.html);
        const html = compiledHtmlTemplate({ otp: verification_otp });


        const compiledTextTemplate = handlebars.compile(template.text);
        const text = compiledTextTemplate({ otp: verification_otp });

        // Send the email
        await nodeMailer.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: template.subject,
            text,
            html
        });

        console.log("\nEmail sent now creating or updating tempuser:\n");

        let user = await Tempusers.findOne({ where: { email } });
        if (user) {
            user = await Tempusers.update({ name, email, bio, password: hashedPassword, verification_otp }, { where: { email } })
        } else {
            user = await Tempusers.create({ name, email, bio, password: hashedPassword, verification_otp });

        }

        res.json({ message: 'OTP sent!', user: { name: user.name, email: user.email } });
    } catch (error) {
        console.error(error);
        return response.serverError(res);
    }
};


// verify user registration with stored and provided otp
exports.verifyUserRegistration = async (req, res) => {
    console.log("\ninside :: verifyUserRegistration\n");
    let { otp, email } = req.body;
    otp = parseInt(otp);

    const rules = {
        otp: "required|numeric",
        email: "required|email"
    }

    let { status, message } = await validate({ otp, email }, rules);
    if (!status) {
        return response.failed(res, "Provide currect information !", message)
    }

    try {
        const tempUser = await Tempusers.findOne({ where: { email } });
        if (!tempUser) {
            return response.failed(res, "User does not exists !")
        }

        console.log("\n Matching the otp tempUser.verification_otp :" + tempUser.verification_otp + " otp : " + otp);
        if (tempUser.verification_otp !== otp) {
            return response.failed(res, "Provide currect information !", "OTP does not match")
        }

        console.log("\nOtp matches now creatign user in user table and deleting the tempuser\n");
        console.log(tempUser);
        const { name, bio, password } = tempUser;
        let user_email = tempUser.email;

        const user = await Users.create({ name, email: user_email, bio, password });
        if (!user) {
            return response.failed(res, "Provide currect information !", message)
        }


        // get the html, text, subject from db
        const template = await Templates.findOne({ where: { template_id: 3 } })
        if (!template) {
            throw new Error('Email template not found');
        }

        const compiledHtmlTemplate = handlebars.compile(template.html);
        const html = compiledHtmlTemplate({ name });


        const compiledTextTemplate = handlebars.compile(template.text);
        const text = compiledTextTemplate({ name }); // Pass dynamic data

        // Send Welcome Email if everything is okay
        await nodeMailer.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: template.subject,
            text,
            html
        });

        // finally deletinG user from tempuser
        try {
            await Tempusers.destroy({ where: { email } })
        } catch (error) {
            console.log("Error deletign tempuser");
        }

        res.json({ message: 'User created successfully', user });

    } catch (error) {
        console.error("errr in verifyUserRegistration:", error);
        return response.serverError(res);
    }

}


// send otp to for changing password
exports.changePassword = async (req, res) => {
    const { email, currentPassword } = req.body;
    const rules = {
        email: "required|email|exist:users,email",
        currentPassword: "required|min:3"
    }
    let { status, message } = await validate({ email, currentPassword }, rules);
    if (!status) {
        return response.failed(res, "Provide currect information !", message)
    }

    try {
        //if the user exists in the database
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            console.log("\nUser does not exist\n");
            return response.failed(res, "Provide currect information !", "User with this email not found!")
        }

        // match the password
        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordMatch) {
            return response.failed(res, "Provide currect information !", "Invalid email or password!")
        }

        console.log("\nemail exists and password matches now sending otp\n");

        // get the html, text, subject from db
        const otp = Math.floor(100000 + Math.random() * 900000);
        const template = await Templates.findOne({ where: { template_id: 4 } })
        if (!template) {
            throw new Error('Email template not found');
        }
        const compiledHtmlTemplate = handlebars.compile(template.html);
        const html = compiledHtmlTemplate({ otp });


        const compiledTextTemplate = handlebars.compile(template.text);
        const text = compiledTextTemplate({ otp });

        console.log("\nNow sending OTP email:\n");

        // Send the email
        await nodeMailer.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: template.subject,
            text,
            html
        });

        console.log("\nemail send, now storing OTP to DB:\n");
        const updatedUser = await Users.update({ otp }, { where: { email } });
        if (updatedUser[0] === 0) {
            console.log("\nerror in   storing  OTP to db \n");
            return response.failed(res, "Provide currect information !", "Error processign OTP !")
        }
        return response.success(res, "OTP sent ");

    } catch (error) {
        console.log("\nerror in changePassword: \n" + error);
        return response.serverError(res);
    }
}


// verify change password
exports.verifyChangePassword = async (req, res) => {
    const { email, newPassword, otp } = req.body;
    const rules = {
        email: "required|email",
        newPassword: "required",
        otp: "required"
    }

    let { status, message } = await validate({ email, newPassword, otp }, rules);
    if (!status) {
        return response.failed(res, "Provide currect information !", message)
    }

    try {
        // check if email and otp matches
        const user = await Users.findOne({ where: { email, otp } });
        if (!user) {
            return response.failed(res, "OTP does not matches", "OTP does not matches")
        }

        // update the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log("\nOTP matches now changing the password\n");

        const updatedUser = await Users.update({ password: hashedPassword }, { where: { email } });
        if (!updatedUser) {
            return response.failed(res, "Error while Changing password !", "Error while Changing password !")
        }

        console.log("\nPassword change success , now deleting otp:\n");
        await Users.update({ otp: 0 }, { where: { email } })
        return response.success(res, "Password changed successfully");
    } catch (error) {
        console.log("\nerror in verifyChangePassword: \n" + error);
        return response.serverError(res);
    }
}