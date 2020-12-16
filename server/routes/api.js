const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('Hello world!')
})

router.post('/register', (req, res) => {
  res.send('register')
})

router.post('/login', (req, res) => {
  res.send('login')
})

router.post('/updateProfile', (req, res) => {
  res.send('update profile')
})

router.get('/listFriends', (req, res) => {
  res.send('list friends')
})

module.exports = router
