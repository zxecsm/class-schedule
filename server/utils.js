// token加密
const jwt = require('jsonwebtoken');

const myconfig = require('./myconfig')

// 格式化当前日期或时间戳日期
function newDate(templete, timestamp) {
  templete ? null : (templete = "{0}年{1}月{2}日 {3}时{4}分{5}秒 星期{6}");
  let currentDate = timestamp ? new Date(+timestamp) : new Date();
  let year = currentDate.getFullYear(),
    month = currentDate.getMonth() + 1,
    date = currentDate.getDate(),
    hour = currentDate.getHours(),
    minute = currentDate.getMinutes(),
    second = currentDate.getSeconds(),
    weekArr = ["日", "一", "二", "三", "四", "五", "六"],
    n_day = currentDate.getDay();
  let formattedDateString = `${year}-${month}-${date}-${hour}-${minute}-${second}-${n_day}`,
    timeArr = formattedDateString.match(/\d+/g);
  return templete.replace(/\{(\d+)\}/g, (...arg) => {
    if (arg[1] === "6") {
      return weekArr[timeArr[arg[1]]];
    } else {
      let time = timeArr[arg[1]] || "00";
      return time.length < 2 ? "0" + time : time;
    }
  });
}
// 用户密码二次加密
function encryption(str) {
  return str.slice(10, -10).split('').reverse().join('');
}
//处理返回的结果
function _send(res, options) {
  res.status(200);
  res.type('application/json');
  res.send(Object.assign({
    code: 0,
    codeText: 'OK',
    data: null
  }, options));
}
function _success(res, codeText = "操作成功~", data = null) {
  _send(res, {
    data,
    codeText
  });
}
function _nologin(res) {
  _send(res, {
    code: 2,
    codeText: `当前未登录，请登录后再操作~`
  });
}
function _nothing(res) {
  _send(res, {
    code: 3,
  });
}
function _err(res, codeText = "操作失败，请稍后再试~", data = null) {
  _send(res, {
    code: 1,
    codeText
  });
}
// 生成token
function jwten(id) {
  return jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), id }, myconfig.tokenKey)
}
// 解密token
function jwtde(token) {
  try {
    let obj = jwt.verify(token, myconfig.tokenKey);
    return obj
  } catch (error) {
    return {}
  }
}
function nanoid() {
  return (+(Date.now() + Math.random().toFixed(5).slice(-5))).toString(16);
}
function isUserName(str) {
  let reg = /^[\u2E80-\u2FDF\u3040-\u318F\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FFF\uA960-\uA97F\uAC00-\uD7FF\w -]+$/g;
  return str && reg.test(str)
}

module.exports = {
  isUserName,
  newDate,
  encryption,
  _send,
  _success,
  _nologin,
  _nothing,
  _err,
  jwten,
  jwtde,
  nanoid,
}
