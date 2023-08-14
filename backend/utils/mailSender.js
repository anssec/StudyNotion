const nodeMailer = require("nodemailer");

exports.mailSender = async (email, title, body) => {
  try {
    let transpoter = nodeMailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    let info = await transpoter({
      from: process.env.SMTP_MAIL,
      to: `${email}`,
      subject: `${title}`,
      text: `${body}`,
    });

    console.log(info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};
