const Users = require("../models/userModel");
const Tempusers = require("../models/tempUserModel");
const Templates = require("../models/emailTemplatesModel");
const bcrypt = require('bcryptjs');
const handlebars = require('handlebars');
const nodeMailer = require('../util/nodeMailer');


exports.sendForgetPassMail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email not provided" });
    }

    try {
        //if the user exists in the database
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            console.log("\nUser does not exist\n");
            return res.status(400).json({ message: "User with this email not found!" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        // get the html, text, subject from db
        const template = await Templates.findOne({ where: { template_id: 2 } })
        if (!template) {
            throw new Error('Email template not found');
        }


        const compiledHtmlTemplate = handlebars.compile(template.html);
        const html = compiledHtmlTemplate({ otp });


        const compiledTextTemplate = handlebars.compile(template.text);
        const text = compiledTextTemplate({ otp });

        console.log("\nUser exists, now sending OTP email:\n");

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
            return res.status(400).json({ message: "error processing OTP !" });
        }
        res.status(200).json({ message: 'OTP sent to your registered email' });

    } catch (error) {
        console.log("\nerror in sendForgetPassMail: \n" + error);
        res.status(500).json({ message: 'Error finding user or sending OTP!' });
    }
}


exports.verifyForgetPassword = async (req, res) => {
    let { otp, email, password } = req.body;
    otp = parseInt(otp);

    if (!otp || !email || !password) {
        return res.status(400).json({ message: "credentials not provided" });
    }

    try {
        // if user exists
        console.log("\nFinding user in db \n");
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            console.log("user does not exist");
            return res.status(400).json({ message: "User with this email not found!" });
        }

        // console.log(user);
        console.log("\n Matching the otp user.otp :" + user.otp + " otp : " + otp);
        if (user.otp !== otp) {
            return res.status(400).json({ message: "OTP does not match" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedOtp = 0;  // ddelete the existing otp in db

        const updatePassword = await Users.update({ password: hashedPassword, otp: updatedOtp }, {
            where: { email }
        });

        if (updatePassword[0] === 0) {
            console.log("Error in updating the password !");
            return res.status(400).json({ message: "Error updating password !" });
        }
        res.status(200).json({ message: 'Successfully updated the password' });

    } catch (error) {
        console.error("Error in verifyOtp:", error);
        res.status(500).json({ message: 'An error occurred while verifying OTP or updating password!' });
    }
};



// create a temp user , send otp to provided email and storre otp to tempuser model
exports.createTempUser = async (req, res) => {
    console.log("\ninside :: createTempUser\n");

    let { name, email, bio, password } = req.body;
    email = email.trim();
    name = name.trim();

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'required fields are missing.' });
    }

    try {
        // if user already exists
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists!" });
        }

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

        console.log("\nEmail sent now creating tempuser:\n");

        const user = await Tempusers.create({
            name,
            email,
            bio,
            password: hashedPassword,
            verification_otp
        });

        res.status(201).json({ message: 'OTP sent!', user: { name: user.name, email: user.email } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "server error. try again later.", error: error.message });
    }
};



// verify user registration with stored and provided otp
exports.verifyUserRegistration = async (req, res) => {
    console.log("\ninside :: verifyUserRegistration\n");
    let { otp, email } = req.body;
    otp = parseInt(otp);

    if (!otp || !email) {
        return res.status(400).json({ message: 'Required fields are missing .' });
    }

    console.log("Email is : " + email + " otp is = " + otp);

    try {
        // check if user exists on tempuser or not
        const tempUser = await Tempusers.findOne({ where: { email } });
        if (!tempUser) {
            return res.status(400).json({ error: "User doesnt exists !" })
        }

        console.log("\n Matching the otp tempUser.verification_otp :" + tempUser.verification_otp + " otp : " + otp);
        if (tempUser.verification_otp !== otp) {
            return res.status(400).json({ message: "OTP does not match" });
        }

        console.log("\nOtp matches now creatign user in user table and deleting the tempuser\n");
        console.log(tempUser);
        const { name, bio, password } = tempUser;
        let user_email = tempUser.email;

        const user = await Users.create({ name, email: user_email, bio, password });
        if (!user) {
            return res.status(400).json({ message: "error while creating the user !" })
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

        // finally deletign user from tempuser
        try {
            await Tempusers.destroy({ where: { email } })
        } catch (error) {
            console.log("Error deletign tempuser");
        }

        res.status(201).json({ message: 'User created successfully', user });

    } catch (error) {
        console.error("errr in verifyUserRegistration:", error);
        return res.status(500).json({ message: "Error verifying the user", error: error.message });
    }

}


// changig passwrod
// send otp to for changing password
exports.changePassword = async (req, res) => {
    const { email, currentPassword } = req.body;
    if (!email, !currentPassword) {
        return res.status(400).json({ message: "Credencials not provided" });
    }

    try {
        //if the user exists in the database
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            console.log("\nUser does not exist\n");
            return res.status(400).json({ message: "User with this email not found!" });
        }

        // match the password
        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid email or password " });
        }

        console.log("\nemail exists and password matches now sending otp\n");

        // get the html, text, subject from db
        const otp = Math.floor(100000 + Math.random() * 900000);
        const template = await Templates.findOne({ where: { template_id: 4 } })
        if (!template) {
            throw new Error('Email template not found');
        }
        const name = "jlsdkfjk";
        const compiledHtmlTemplate = handlebars.compile(template.html);
        const html = compiledHtmlTemplate({ otp, name });


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
            return res.status(400).json({ message: "error processing OTP !" });
        }
        res.status(200).json({ message: 'OTP sent to your registered email' });

    } catch (error) {
        console.log("\nerror in changePassword: \n" + error);
        res.status(500).json({ message: 'Error in changing password !' });
    }
}



// verify change pass
exports.verifyChangePassword = async (req, res) => {
    const { email, newPassword, otp } = req.body;
    if (!email, !newPassword, !otp) {
        return res.status(400).json({ message: "Credencials not provided" });
    }

    try {
        // check if email and otp matches
        const user = await Users.findOne({ where: { email, otp } });
        if (!user) {
            console.log("\nUser does not exist\n");
            return res.status(400).json({ message: "OTP does not matches !" });
        }

        // update the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log("\nOTP matches now changing the password\n");

        const updatedUser = await Users.update({ password: hashedPassword }, { where: { email } });
        if (!updatedUser) {
            return res.status(400).json({ message: "Error while Changing password !" });
        }


        console.log("\nPassword change success , now deleting otp:\n");
        await Users.update({ otp: 0 }, { where: { email } })
        res.status(200).json({ message: 'Password changed successfully !' });
    } catch (error) {
        console.log("\nerror in verifyChangePassword: \n" + error);
        res.status(500).json({ message: 'Error Changing the password!' });
    }
}