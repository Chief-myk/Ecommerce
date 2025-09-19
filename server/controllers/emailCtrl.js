const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

// const sendEmail = asyncHandler(async (req, res) => {
const sendEmail = asyncHandler(async (data, req, res) => {


    // Create a test account or replace with real credentials.
    // const transporter = nodemailer.createTransport({
    //     host: 'smtp.ethereal.email',
    //     port: 587,
    //     auth: {
    //         user: 'hillard.tremblay48@ethereal.email',
    //         pass: 'MdJTY3gCqEU58AtbES'
    //     }
    // });


    // const mailOptions = await transporter.sendMail({
    //     from: 'mayankixa17@gmail.com', // sender address
    //     to: 'mayankmittal1106@gmail.com',
    //     subject: "ECOMMERCE Email", // Subject line
    //     text: 'Hello world?', // plain text body 
    //     // html: data.html, // html body
    // });


    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service
        // secure: true, // true for 465, false for other ports
        port: 465,
        auth: {
            user: 'mayankixa17@gmail.com',
            pass: 'vomm kuds edtx cbmp'
        }
    });


    const mailOptions = await transporter.sendMail({
        from: 'mayankixa17@gmail.com', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.html, // html body
    });

    console.log('Message sent: %s', mailOptions.messageId);
    res.json({ message: "Email sent successfully", info: mailOptions });

});

module.exports = sendEmail;