const express = require('express')
const app = express()
const port = 3000
const accountSid = 'AC5104ebba3096e7d735781e4d0954367b';
const authToken = '1d77525edf61c4874349c4c89b6796a8';
const twilioVerifyService = require('twilio')(accountSid, authToken)?.verify.services('VA80cec388c41c95d6f47901b5ae2d59eb');
const bodyParser = require('body-parser')

const PHONE_NUMBER = '+84347122643';
const EMAIL = 'qnguyen.play@gmail.com';

app.use(bodyParser.json({ type: 'application/*+json' }))
app.use((req, res, next) => {
  req.query.channel = req.query.channel === 'sms' ? 'sms' : 'email';
  req.query.toParam = req.query.channel === 'sms' ? PHONE_NUMBER : EMAIL;
  next();
});

app.get('/request-otp', async (req, res) => {
  try {
    const verify = await twilioVerifyService
      .verifications
      .create({ to: req.query.toParam, channel: req.query.channel });

    res.send(verify);
  } catch (error) {
    throw error
  }
})

app.get('/verify-otp', async (req, res) => {
  if (!req.query.otp) {
    throw new Error('missing otp');
  }

  const verify = await twilioVerifyService.verificationChecks
    .create({ to: req.query.toParam, channel: req.query.channel, code: req.query.otp });

  res.send(verify);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})