const express = require('express')
const { _nologin, nanoid, _success, _err } = require('../utils');
const { insertData, queryData, deleteData, updateData } = require('../sqlite');
const route = express.Router()

// 拦截器
route.use((req, res, next) => {
  if (req._userInfo.id) {
    next()
  } else {
    _nologin(res)
  }
})
// 获取课程信息
route.get('/update', async (req, res) => {
  try {
    let uid = req._userInfo.id
    let duration = await queryData('duration', '*', `WHERE uid=?`, [uid])
    let schedule = await queryData('schedule', '*', `WHERE uid=?`, [uid])
    _success(res, 'ok', { duration, schedule })
  } catch (error) {
    _err(res)
  }
})
//新增duration
route.post('/addduration', async (req, res) => {
  try {
    let { title } = req.body;
    await insertData('duration', [{
      id: nanoid(),
      uid: req._userInfo.id,
      title
    }])
    _success(res)
  } catch (error) {
    _err(res)
  }
})

//删除duration
route.get('/delduration', async (req, res) => {
  try {
    let { id } = req.query;
    await deleteData('duration', `WHERE id=?`, [id])
    await deleteData('schedule', `WHERE durationId=?`, [id])
    _success(res)
  } catch (error) {
    _err(res)
  }
})
//编辑duration
route.post('/editduration', async (req, res) => {
  try {
    let { id, title } = req.body
    await updateData('duration', { title }, `WHERE id=?`, [id])
    _success(res)
  } catch (error) {
    _err(res)
  }
})
//新增schedule
route.post('/addschedule', async (req, res) => {
  try {
    let uid = req._userInfo.id
    let { title, week, durationId, describe } = req.body
    await insertData('schedule', [{
      id: nanoid(),
      title,
      uid,
      week,
      durationId,
      describe
    }])
    _success(res)
  } catch (error) {
    _err(res)
  }
})

//删除schedule
route.get('/delschedule', async (req, res) => {
  try {
    let { id } = req.query;
    await deleteData('schedule', `WHERE id=?`, [id])
    _success(res)
  } catch (error) {
    _err(res)
  }
})

//编辑schedule
route.post('/editschedule', async (req, res) => {
  try {
    let { id, title, describe } = req.body
    await updateData('schedule', { title, describe }, `WHERE id=?`, [id])
    _success(res)
  } catch (error) {
    _err(res)
  }
})


module.exports = route