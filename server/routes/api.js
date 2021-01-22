const express = require('express')
const router = express.Router()

const models = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const cookieOptions = {
  maxAge: 604800,
  signed: true,
  httpOnly: true
}

const JWT_SECRET = process.env.JWT_SECRET || 'pneumonoultramicroscopicsilicovolcanoconiosis'

router.get('/', (req, res) => {
  res.send('Hello world!')
})

router.post('/register', async (req, res) => {
  console.log('API reg', req.body)
  models.User.create({
    uid: req.body.id,
    password_hash: await bcrypt.hash(req.body.password, 10),
    name: req.body.username,
    photo: (!req.body.avatar || !req.body.avatar.length ) ? '/favicon.ico' : req.body.avatar,
  })
  .then(user => {
    const token = jwt.sign({ u: user.uid, p: user.password_hash }, JWT_SECRET)
    res.cookie('cred', token, cookieOptions)
    res.send({ status: true })
  })
  .catch(err => res.status(403).send({ status: false, msg: err.code === 11000 ? '這個E-mail已經被註冊過了。' : err.message }))
})

router.post('/login', async (req, res) => {
  console.log('API login', req.body)
  if (req.body.id && req.body.id.length && req.body.password && req.body.password.length) {
    const user = await models.User.findOne({uid: req.body.id})
    if (!user || !await bcrypt.compare(req.body.password, user.password_hash))
      res.status(403).send({ status: false, msg: '登入ID或密碼錯誤。' })
    else {
      const token = jwt.sign({ u: user.uid, p: user.password_hash }, JWT_SECRET)
      res.cookie('cred', token, cookieOptions)
      res.send({ status: true })
    }
  }
  else
    res.status(403).send({ status: false, msg: '請輸入帳號和密碼。' })
})

router.post('/logout', (req, res) => {
  console.log('API logout', !!req.signedCookies.cred)
  res.clearCookie('cred')
  res.send({ status: true })
})

router.get('/auth', async (req, res) => {
  console.log('API auth', !!req.signedCookies.cred)
  if (!req.signedCookies.cred) {
    res.send({ uid: false, msg: 'No credential in cookie.' })
    return
  }
  let auth
  try {
    auth = jwt.verify(req.signedCookies.cred, JWT_SECRET)
  } catch(err) {
    res.send({ uid: false, msg: err.message })
    return
  }
  if ('u' in auth && 'p' in auth) {
    const user = await models.User.findOne({uid: auth.u})
    if (user && user.uid === auth.u && user.password_hash === auth.p)
      res.send({ uid: auth.u, msg: 'Authorized.' })
    else
      res.send({ uid: false, msg: 'Credential is malformed.' })
  }
  else res.send({ uid: false, msg: 'Credential is malformed.' })
})

router.get('/profile', async (req, res) => {
  console.log('API profile', req.query.Id, !!req.signedCookies.cred)
  res.set({ 'Cache-Control': 'private, no-cache, no-store, must-revalidate', });
  if (req.query.Id) {
    let username = '(沒有這個帳號！)', avatar = 'https://i.imgur.com/YENBp8x.jpg', lastmsg
    const user = await models.User.findOne({uid: req.query.Id})
    if (user) [username, avatar] = [user.name, user.photo]
    if (req.signedCookies.cred) {
      let auth, self, conv, msg
      try { auth = jwt.verify(req.signedCookies.cred, JWT_SECRET) }
      catch (err) {}
      if (auth && 'u' in auth && 'p' in auth && auth.u !== req.query.Id)
        self = await models.User.findOne({uid: auth.u})
      if (self && self.password_hash === auth.p) {
        const member_1 = auth.u < req.query.Id ? auth.u : req.query.Id
        const member_2 = auth.u > req.query.Id ? auth.u : req.query.Id
        conv = await models.Conv.findOne({ member_1, member_2 })
      }
      if (conv) msg = await models.Message.find({conv: conv._id}).sort({time: -1}).limit(1)
      if (msg && msg.length) switch (msg[0].type) {
        case 'TEXT':
        default:
          lastmsg = msg[0].body; break
        case 'IMAGE':
          lastmsg = '(圖片)'; break
        case "STICKER":
          lastmsg = '(貼圖)'; break
        case "ATTACHMENT":
          lastmsg = '(附檔)'; break
      }
    }
    res.send({ user_id: user ? user.uid : false, username, avatar, lastmsg })
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
