  
const express = require('express')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer');
const path = require('path');
var exphbs  = require('express-handlebars');
const dotenv = require('dotenv')

const port = 3000
const app = express()
dotenv.config()

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static File
app.use('/public', express.static('public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.render('contact', {layout: false}); 
});

app.post('/send', async (req, res) => {
    const output = `
    <p>You have a new Contact Request</p>
    <h3>Contact Detail</h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Company: ${req.body.company}</li>
        <li>Email: ${req.body.email}</li>
        <li>phone number: ${req.body.phone}</li>
    </ul>
    <p>Message: ${req.body.message}</p>
    `;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_NAME, // generated ethereal user
      pass: process.env.EMAIL_PASS, // generated ethereal password
    },
    });

    let info = await transporter.sendMail({
        from: '"First Node Email" <test@gmail.com>', // sender address
        to: "aithietke10@gmail.com", // list of receivers
        subject: "Node contact Mail", // Subject line
        text: "Hello world?", // plain text body
        html: output, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.render('contact', {layout: false, msg: 'Email has been sent'})
})


app.listen(port, () => console.log(`Server Started`))