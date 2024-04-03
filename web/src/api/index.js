import req from "./ajax";

// 注册
export const registerReq = (data) => req.post('/user/register', data)

// 登录
export const loginReq = (data) => req.post('/user/login', data)

// 退出
export const logoutReq = () => req.post('/user/logout')

// 修改密码
export const changepdReq = (data) => req.post('/user/changepd', data)

// 修改用户名
export const changeuserReq = (data) => req.post('/user/changeuser', data)

// 删除账号
export const deleteUserReq = () => req.get('/user/delete')

//获取课程数据
export const updateCourseReq = () => req.get('/course/update')

// 新增时间段
export const addDurationReq = (data) => req.post('/course/addduration', data)

// 删除时间段
export const delDurationReq = (params) => req.get('/course/delduration', { params })

// 编辑时间段
export const editDurationReq = (data) => req.post('/course/editduration', data)

// 新增课程安排
export const addScheduleReq = (data) => req.post('/course/addschedule', data)

// 删除课程安排
export const delScheduleReq = (params) => req.get('/course/delschedule', { params })

// 编辑课程安排
export const editScheduleReq = (data) => req.post('/course/editschedule', data)