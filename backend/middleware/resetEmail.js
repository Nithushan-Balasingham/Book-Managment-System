// const User = require("../models/usermodel")

// module.exports = async (email, OTP, emailtoUpdate) => {
//     return new Promise(async (resolve, reject) => {
//       try {
//         // Check if email exists in the database
//         const user = await User.findOne({ where: { email: email } });
//         if (!user) {
//           return reject({ message: "Email does not exist" });
//         }
  
//         const transporter = nodemailer.createTransport({
//           host: process.env.HOST,
//           service: process.env.SERVICE,
//           port: Number(process.env.EMAIL_PORT),
//           secure: Boolean(process.env.SECURE),
//           auth: {
//             user: process.env.USER,
//             pass: process.env.PASS
//           }
//         });
  
//         await transporter.sendMail({
//           from: process.env.USER,
//           to: email,
//           subject: subject,
//           text: text
//         });
  
//         transporter.sendMail(mailConfigs, function (error, info) {
//           if (error) {
//             console.log(error);
//             return reject({ message: "An error has occurred" });
//           }
//           return resolve({ message: "Email sent successfully" });
//         });
//       } catch (error) {
//         console.log(error);
//         return reject({ message: "An error has occurred" });
//       }
//     });
//   };
  