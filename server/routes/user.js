const express = require('express'),
  route = express.Router();

const { insertData, updateData, runSqlite, deleteData, queryData } = require('../sqlite')
const { encryption, nanoid, jwten, _success, _err, _nologin, isUserName } = require('../utils');

queryData('user', 'id').then(() => { }).catch(async () => {
  try {
    await runSqlite(`CREATE TABLE user (
      id       TEXT PRIMARY KEY
                    UNIQUE
                    NOT NULL,
      username TEXT,
      password TEXT
  );`)
    await runSqlite(`CREATE TABLE duration (
      id    TEXT PRIMARY KEY
                 UNIQUE
                 NOT NULL,
      uid   TEXT NOT NULL,
      title TEXT
  );`)
    await runSqlite(`CREATE TABLE schedule (
      id         TEXT PRIMARY KEY
                      UNIQUE
                      NOT NULL,
      uid        TEXT NOT NULL,
      week       TEXT NOT NULL,
      durationId TEXT NOT NULL,
      title      TEXT,
      describe   TEXT
  );`)
  } catch (error) {
  }
})
//注册
route.post("/register", async (req, res) => {
  try {
    let { username, password } = req.body;
    if (!isUserName(username)) {
      _err(res)
      return
    }
    let id = nanoid();
    await insertData('user', [{
      id,
      username,
      password: encryption(password)
    }])
    let token = jwten(id);
    res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true })
    _success(res, '注册账号成功~', { username, id });
  } catch (error) {
    _err(res)
  }
});
//登录
route.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;
    if (!isUserName(username)) {
      _err(res)
      return
    }
    let userinfo = await queryData('user', '*', `WHERE username=? AND password=?`, [username, encryption(password)])
    if (userinfo.length > 0) {
      let token = jwten(userinfo[0].id);
      res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true })
      _success(res, '登录成功~', { username, id: userinfo[0].id });
      return
    }
    _err(res, '用户名或密码错误~');
  } catch (error) {
    _err(res)
  }
});
// 拦截器
route.use((req, res, next) => {
  if (req._userInfo.id) {
    next()
  } else {
    _nologin(res)
  }
})
//退出
route.post("/logout", async (req, res) => {
  try {
    res.clearCookie('token')
    _success(res)
  } catch (error) {
    _err(res)
  }
});
//修改用户名
route.post("/changeuser", async (req, res) => {
  try {
    let { username } = req.body;
    if (!isUserName(username)) {
      _err(res)
      return
    }
    if (username.length > 20) {
      _err(res, '用户名过长~')
      return
    }
    await updateData('user', { username }, `WHERE id=?`, [req._userInfo.id])
    _success(res)
  } catch (error) {
    _err(res)
  }
});
// 修改密码
route.post("/changepd", async (req, res) => {
  try {
    let { password, oldpassword } = req.body;
    if (encryption(oldpassword) !== req._userInfo.password) {
      _err(res, '原密码错误，请重新输入~')
      return
    }
    password = encryption(password);
    await updateData('user', { password }, `WHERE id=?`, [req._userInfo.id])
    _success(res, '修改密码成功~')
  } catch (error) {
    _err(res)
  }
});
// 删除账号
route.get("/delete", async (req, res) => {
  try {
    let uid = req._userInfo.id
    await deleteData('user', `WHERE id=?`, [uid])
    await deleteData('duration', `WHERE uid=?`, [uid])
    await deleteData('schedule', `WHERE uid=?`, [uid])
    res.clearCookie('token')
    _success(res, '删除账号成功~')
  } catch (error) {
    _err(res)
  }
});

module.exports = route