const express = require('express')
const router = express.Router()

const cookieOptions = {
  maxAge: 604800,
  signed: true,
  httpOnly: true
}

router.get('/', (req, res) => {
  res.send('Hello world!')
})

router.get('/avatar', (req, res) => {
  if (req.query.Id) {
    let url
    switch (req.query.Id) {
      case 'alice':
        url = 'https://s.yimg.com/ob/image/8b867e11-d4b7-4492-95b0-66aa3f04efd4.jpg'
        break
      case 'bob':
        url = 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Bob_the_builder.jpg/220px-Bob_the_builder.jpg'
        break
      default:
        url = 'https://i.imgur.com/YENBp8x.jpg'
    }
    res.send({ url })
  }
  else
    res.status(404).send({ url: false, msg: 'The requested avatar is unavailable.' })
})

router.post('/register', (req, res) => {
  res.send('register')
})

router.post('/login', (req, res) => {
  console.log(req.body.id, req.body.password, req.signedCookies)
  res.cookie('cred', req.body.id+'@'+req.body.password, cookieOptions)
  res.send({ status: true })
})

router.post('/logout', (req, res) => {
  console.log(req.signedCookies)
  res.clearCookie('cred')
  res.send({ status: true })
})

router.post('/updateProfile', (req, res) => {
  res.send('update profile')
})

router.get('/listFriends', (req, res) => {
  res.send('list friends')
})

module.exports = router
