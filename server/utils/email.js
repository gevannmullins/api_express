// TODO: Get apiKey and domain for iBuild
const apiKey = 'key-b0d085ea80e3fc7657305060d24271f9';
const domain = 'goresponsive.com';
const mailgun = require('mailgun-js')({ apiKey, domain });

module.exports = {
  sendEmail(res, data, cb) {
    mailgun.messages().send(data, (error, body) => {
      if (error) {
        return res.status(500).json(error);
      }
      
      if (cb) {
        cb(body);
      }
    });
  }
};
