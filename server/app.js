const express = require('express');

const app = express()

const bodyParser = require('body-parser')

const cookieParser = require('cookie-parser')

// 处理history模式
const history = require('connect-history-api-fallback');

app.use(cookieParser())

let myconfig = require('./myconfig')

let {
  jwtde,
  _err
} = require('./utils')
let { queryData } = require('./sqlite')


app.listen(myconfig.port, () => {
  console.log(`服务启动成功，端口： ${myconfig.port}`);
})

//设置bodyParser
app.use(bodyParser.json({ limit: "50mb", parameterLimit: 1000000 }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    parameterLimit: 1000000,
    extended: false,
  })
);

//token拦截
app.use(async (req, res, next) => {
  try {
    req._userInfo = {}
    let _token = req.cookies.token;//读取token
    let obj = jwtde(_token);//解密token
    let userinfo = await queryData('user', '*', `WHERE id = ?`, [obj.id]);
    if (userinfo.length > 0) {
      req._userInfo = userinfo[0]
    }
    next()
  } catch (error) {
    _err(res)
  }
});
app.use(history());

app.use('/user', require('./routes/user'))
app.use('/course', require('./routes/course'))


app.use(express.static('./dist'))