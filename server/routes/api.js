const express = require('express')
const router = express.Router()

const models = require('../models')

const cookieOptions = {
  maxAge: 604800,
  signed: true,
  httpOnly: true
}

router.get('/', (req, res) => {
  res.send('Hello world!')
})

router.post('/register', (req, res) => {
  console.log('API reg', req.body)
  res.send({ status: true })
})

router.post('/login', (req, res) => {
  console.log('API login', req.body.id, req.body.password, req.signedCookies.cred)
  res.cookie('cred', req.body.id+'@'+req.body.password, cookieOptions)
  res.send({ status: true })
})

router.post('/logout', (req, res) => {
  console.log('API logout', req.signedCookies.cred)
  res.clearCookie('cred')
  res.send({ status: true })
})

router.get('/profile', (req, res) => {
  console.log('API profile', req.query.Id)
  if (req.query.Id) {
    let username, avatar
    switch (req.query.Id) {
      default:
        username = 'Serval Cat'
        avatar = 'https://i.imgur.com/YENBp8x.jpg'
    }
    res.send({ user_id: req.query.Id, username, avatar })
  }
  else
    res.status(404).send({ user_id: false, msg: 'The requested profile is unavailable.' })
})

router.post('/profile', (req, res) => {
  console.log('API profile update', req.body)
  res.send('update profile')
})

router.get('/friends', (req, res) => {
  console.log('API friends', req.query.Id)
  res.send('list friends')
})

module.exports = router
