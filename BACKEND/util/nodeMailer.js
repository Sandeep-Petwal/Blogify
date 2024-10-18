const nodemailer = require("nodemailer");

const SMTP_SERVER = process.env.SMTP_SERVER;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;




// exports.transporter = nodemailer.createTransport({
//     host: SMTP_SERVER,
//     port: SMTP_PORT,
//     auth: {
//         user: SMTP_USER,
//         pass: SMTP_PASSWORD
//     }
// });


exports.transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: "shengsohel@gmail.com",
        pass: "sodituvleilvuqrl"
    }
});