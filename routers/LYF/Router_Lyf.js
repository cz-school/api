const express = require("express")
const router = express.Router()
const db = require('../../db')

// 登录
router.post('/login', (req, res) => {
  let username = req.body.username
  let password = req.body.password

  let sql = `select * from users where phone = ?`;

  // 后台处理数据
  let userReg = /^[1][3,4,5,7,8][0-9]{9}$/

  if (!userReg.test(username)) {
    res.json({
      code: '201',
      msg: '电话号码格式不正确'
    })
    return
  }

  if (password.length < 6 || password.length > 12) {
    res.json({
      code: '201',
      msg: '密码长度为6 - 12 位'
    })
    return
  }

  db.query(sql, username, (error, data) => {
    if (error) {
      console.log(error)
      return
    }
    // 判断是否存在
    if (data[0]) {
      // 判断密码是否正确
      if (data[0].password == password) {
        res.json({
          code: '200',
          id: data[0].id,
          token: 'asjkdasjdlasjdlsajdsal:;sadjkdhas',
          msg: '登录成功'
        })
        return
      } else {
        res.json({
          code: '201',
          msg: '密码不正确'
        })
        return
      }
    } else {
      // 若用户不存在 提示
      res.json({
        code: '201',
        msg: '用户不存在'
      })
      return
    }
  })
})

// 注册
router.post('/regist', (req, res) => {
  let username = req.body.username
  let password = req.body.password
  let time = parseInt(new Date().getTime() / 1000)
  // console.log(time)

  // 后台处理数据
  let userReg = /^[1][3,4,5,7,8][0-9]{9}$/
  if (!userReg.test(username)) {
    res.json({
      code: '201',
      msg: '电话号码格式不正确'
    })
    return
  }
  if (password.length < 6 || password.length > 12) {
    res.json({
      code: '201',
      msg: '密码长度为6 - 12 位'
    })
    return
  }
  let sql = `select * from users where phone = ?`

  db.query(sql, username, (error, data) => {
    if (error) {
      console.log(error)
      return
    }
    // res.json(data)
    if (data[0]) {
      res.json({
        code: '201',
        msg: '账号已存在'
      })
    } else {
      sql = `insert into users(phone,password,add_time) values(?,?,?)`
      db.query(sql, [username, password, time], (error, data) => {
        if (error) {
          console.log(error)
          return
        }

        if (data.affectedRows === 1) {
          res.json({
            code: '200',
            msg: '注册成功'
          })
          return
        } else {
          res.json({
            code: '201',
            msg: '注册失败'
          })
          return
        }
      })
    }
  })


  // let sql = `insert into users(phone,password,add_time) values(?)`

})

const WebSocket = require('ws');// 导入WebSocket模块:
const WebSocketServer = WebSocket.Server;// 引用Server类:
const wss = new WebSocketServer({ port: 3101 });// 实例化: 端口3000
wss.on('connection', function (ws) {
  console.log('client connected');
  // 接收客户端数据
  ws.on('message', async (message) => {
    // console.log(message); //我是前台数据
    // ws.send('你好啊')
    // 获取用户聊天消息列表
    if (JSON.parse(message).user_id !== undefined) {
      var user_id = ''
      user_id = JSON.parse(message).user_id
    }
    // 判断user_id 是否存在
    if (user_id !== undefined) {
      // 判断发送者
      let sql = `select a.* from (select * from commit where req_id = ? or res_id = ? order by add_time desc limit 30) a group by a.room_id order by a.add_time desc`
      db.query(sql, [user_id, user_id], (error, data) => {
        if (error) {
          console.log(error)
          return
        }
        // console.log(data)
        // 处理完的数据
        let info = []
        let idArr = []
        data.forEach((v, i) => {
          // console.log(v.req_id)
          if (v.req_id == user_id) {
            idArr.push(v.res_id)
            info.push({
              'user_id': v.res_id,
              'message': v.message,
              'add_time': v.add_time,
              'room_id': v.room_id
            })
          } else {
            idArr.push(v.req_id)
            info.push({
              'user_id': v.req_id,
              'message': v.message,
              'add_time': v.add_time,
              'room_id': v.room_id
            })
          }
        })
        info.sort((a, b) => {
          return a.user_id - b.user_id
        })
        db.query(`select id,username,phone,head_img from users where id in (?)`, [idArr], (err, result) => {
          if (err) {
            console.log(err)
            return
          }
          // console.log(result.length)
          result.forEach((v, i) => {
            if (v.id == info[i].user_id) {
              result[i].message = info[i].message
              result[i].add_time = info[i].add_time
              result[i].room_id = info[i].room_id
            }
          })
          ws.send(JSON.stringify(result))
        })
      })
    }
    if (JSON.parse(message).room_id !== undefined) {
      // 房间号id
      var room_id = ''
      // 获取房间id
      room_id = JSON.parse(message).room_id
    }
    function getRoom(id) {
      let sql = `select * from commit where room_id = ?`
      db.query(sql, id, (err, data) => {
        if (err) {
          console.log(err)
          return
        }
        // console.log(data)
        let idArr = []
        let info = []
        data.forEach((v, i) => {
          if (v.req_id == room_id) {
            idArr.push(v.req_id)
            info.push({
              'user_id': v.req_id,
              'add_time': v.add_time,
              'message': v.message
            })
          } else {
            idArr.push(v.req_id)
            info.push({
              'user_id': v.req_id,
              'add_time': v.add_time,
              'message': v.message
            })
          }
        })
        // console.log(idArr)
        // console.log(info)
        db.query(`select id,username,head_img from users where id in (?)`, [idArr], (err, data) => {
          if (err) {
            console.log(err)
            return
          }
          // 王海龙
          let datalist = [];
          info.forEach((item) => {
            data.forEach((item1) => {
              if (item1.id == item.user_id) {
                datalist.push({
                  id: item1.id,
                  username: item1.username,
                  head_img: item1.head_img,
                  add_time: item.add_time,
                  message: item.message
                })
              }
            })
          })
          data = datalist
          // console.log(data);
          data.forEach((v, i) => {
            if (v.id == info[i].user_id) {
              v['add_time'] = info[i].add_time
              v['message'] = info[i].message
            }
          })
          // console.log(data)
          ws.send(JSON.stringify(data))
        })
      })
    }
    // console.log(room_id) 房间信息
    if (room_id !== undefined) {
      getRoom(room_id)
    }
    // 发送消息
    if (JSON.parse(message).reqInfo != undefined) {
      var reqInfo = {}
      reqInfo = JSON.parse(message).reqInfo
      let time = parseInt(new Date().getTime() / 1000)
      reqInfo.add_time = time
      // console.log(reqInfo)
      let sql = `insert into commit value(?,?,?,?,?,?)`
      let info = [null, reqInfo.req_id, reqInfo.res_id, reqInfo.message, reqInfo.add_time, reqInfo.room_id]
      db.query(sql, info, (err, data) => {
        if (err) {
          console.log(err)
          return
        }
        // console.log(data)
        if (data.affectedRows === 1) {
          getRoom(reqInfo.room_id)
          return
        }
      })
    }

  });
})

module.exports = router;