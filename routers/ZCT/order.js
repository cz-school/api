const express = require("express")
const router = express.Router()
const db = require("../../db")

// 查询订单
router.get("/order_st/:state", (req, res) => {
  let state = req.params.state;
  let sql = null;
  if (state !== '9') {
    sql = 'SELECT * FROM `order` WHERE classify_State = 1 AND state = ?'
  } else {
    sql = 'SELECT * FROM `order` WHERE classify_State = 1'
  }

  db.query(sql, state, (error, data) => {
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
router.put("/order_st/refund/:id",(req,res)=>{
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
module.exports = router;