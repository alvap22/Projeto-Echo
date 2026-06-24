const nodemailer =
  require("nodemailer");

const transporter =
  nodemailer.createTransport({
    service: "gmail",

    auth: {
      user:
        "SEUEMAIL@gmail.com",

      pass:
        "SENHA_DO_APP",
    },
  });

module.exports =
  transporter;