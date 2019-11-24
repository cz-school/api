const express = require("express")
const router = express.Router()
const db = require("../../db")

// 查询订单
router.get("/order_st/:state", (req, res) => {
  let state = req.params.state;
  let id = req.query.id;

  let sql = null;
  if (state !== '9') {
    sql = 'SELECT * FROM `order` WHERE classify_State = 1 AND state = ? AND user_id = ?'
    var orderdata = [state,id]
  } else {
    sql = 'SELECT * FROM `order` WHERE classify_State = 1 AND user_id = ?'
    var orderdata = id
  }

  db.query(sql, orderdata, (error, data) => {
    if (error) {
      console.log(error)
      return res.json({
        ok: 0,
        error: error
      })
    } else {
      if (data.length == 0) {
        return res.json({
          ok: 1,
          data: []
        })
      }
      let order_id = []
      data.forEach(item => {
        order_id.push(item.id)
        item.imgList = []
      });
      let sql2 = 'SELECT a.order_id ,a.menu_num,a.menu_price,a.menu_name ,b.menu_img FROM order_stdetail a LEFT JOIN menu b ON a.menu_id = b.id WHERE a.order_id IN (?)'
      db.query(sql2, [order_id], (error2, data2) => {
        if (error2) {
          console.log(error2)
        } else {
          data.forEach((item, i) => {
            let index = data2.filter(el => {
              return el.order_id == item.id
            })
            data[i].imgList = index
          })
          // console.log(data)
          res.json({
            ok: 1,
            data: data
          })
        }
      })
    }
  })
})

// 删除订单
router.delete("/order_st/:id", (req, res) => {
  let id = req.params.id
  console.log(id)
  let sql = 'DELETE FROM `order` WHERE  id = ?;DELETE FROM order_stdetail WHERE order_id = ?'
  db.query(sql, [id, id], (error, data) => {
    if (error) {
      res.json({
        ok: 0,
        error: error
      })
    } else {
      if (data[0].affectedRows) {
        res.json({
          ok: 1
        })
      } else {
        res.json({
          ok: 0,
          error: data
        })
      }
    }
  })
})

// 取消订单
router.put("/order_st/:id", (req, res) => {
  let id = req.params.id;
  let order_type = req.body.type
  let sql = 'UPDATE `order` SET state = ? WHERE id =?'
  db.query(sql, [order_type, id], (error, data) => {
    if (error) {
      console.log(error)
      return res.json({
        ok: 0,
        error: error
      })
    } else {
      res.json({
        ok: 1
      })
    }
  })
})

// 退款
router.put("/order_st/refund/:id", (req, res) => {
  let id = req.params.id;
  let order_type = req.body.type
  let sql = 'UPDATE `order` SET return_state = ? WHERE id =?'
  db.query(sql, [order_type, id], (error, data) => {
    if (error) {
      console.log(error)
      return res.json({
        ok: 0,
        error: error
      })
    } else {
      res.json({
        ok: 1
      })
    }
  })
})

// 取消退款
router.put("/order_st/unrefund/:id", (req, res) => {
  console.log(1)
  let id = req.params.id;
  let order_type = req.body.type
  let sql = 'UPDATE `order` SET return_state = ? WHERE id =?'
  db.query(sql, [order_type, id], (error, data) => {
    if (error) {
      console.log(error)
      return res.json({
        ok: 0,
        error: error
      })
    } else {
      res.json({
        ok: 1
      })
    }
  })
})

// 准备创建订单 查询商品信息
router.get("/purchase/:id", (req, res) => {
  let ids = req.params.id.split(",")
  // console.log(ids)
  let sql = 'SELECT * FROM menu WHERE id IN(?)'
  db.query(sql, [ids], (error, data) => {
    if (error) {
      console.log(error)
      return res.json({
        ok: 0,
        error: error
      })
    } else {
      // console.log(data)
      res.json({
        ok: 1,
        data: data
      })
    }
  })
})

// // 创建订单
router.post('/createorder_st', (req, res) => {
  // 购物车id
  let cartid = req.body.data.cartid
  // 当前时间秒
  let time = Date.parse(new Date()) / 1000;
  // 商品id
  let goodsdata = req.body.data.goodsdata
  console.log(goodsdata)
  // 支付金额
  let price = req.body.data.totalPrice
  // 用户id
  let userid = 1 //req.body.userid
  // 姓名
  let name = req.body.data.users_name
  // 手机号
  let mobile = req.body.data.users_mobile
  // 地址
  let site = req.body.data.dormitory + req.body.data.dormitory_no
  // console.log(req.body.dormitory)
  // 获取当前时间戳毫秒
  var timestamp = Date.parse(new Date());
  // 生成七个随机数
  let num = Math.random().toString().substring(2, 9);
  // 拼接成订单号
  let order_num = timestamp + num;
  // // 添加数据
  let arr = [order_num, time, price, 0, userid, 1, 0, 0, name, mobile, site]
  // console.log(arr)
  db.query('insert into `order`(order_num,add_time,price,state,user_id,classify_State,return_state,pay_method,shr_name,shr_mobile,shr_address) values(?)', [arr], (error, data) => {
    if (error) {
      // console.log(error)
      return res.json({
        ok: 0,
        msg: "生成订单失败"
      })
    } else {
      // 查询添加的订单号的id
      db.query('select id from `order` where order_num =?', order_num, (error2, data2) => {
        if (error2) {
          console.log(error)
        }
        let orderId = data2[0].id
        let iscorrect = []
        goodsdata.forEach(item => {
          db.query('insert into order_stdetail values(?,?,?,?,?,?)', [null,orderId, item.id, item.menu_name, item.menu_price,item.menu_num], (error3, data3) => {
            if (error3) {
              console.log(error3)
              return res.json({
                ok: 0,
                msg: "创建失败"
              })
            } else {
              iscorrect.push(data3[0])
            }
          })
        })
        // 判断
        iscorrect.forEach(item => {
          if (!item.affectedRows) {
            return res.json({
              ok: 0,
              msg: "创建失败"
            })
          }
        })

        db.query("DELETE FROM stcare WHERE id IN(?)", [cartid], (error4, data4) => {
          if (error4) {
            console.log(error4)
            return res.json({
              ok: 0,
              msg: "创建失败"
            })
          } else {
            res.json({
              ok: 1,
              id:data[0].insertId,
              msg: "创建成功"
            })
          }
        })

      })
    }
  })

})

module.exports = router