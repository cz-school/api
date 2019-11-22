const express = require("express")
const router = express.Router()
const db = require("../../db")
// 获取食堂购物车信息
router.get('/myCart_st/:id', (req, res) => {
  let userID = req.params.id;  //req.user.id
  let sql = 'SELECT * FROM stcare WHERE user_id = ?'

  db.query(sql, userID, (error, data) => {
    if (error) {
      return res.json({
        ok: 0,
        error: error
      })
    } else {
      
      if (data.length === 0) {
        return res.json({
          ok: 1,
          data: []
        })
      } else {
              // 获取商品id列表 
      let cart_ids = [];

      data.forEach(item => {
        cart_ids.push(item.menu_id)
      });


      let sql2 = `SELECT a.id,a.menu_id,a.menu_num,a.menu_check,stuser_id,b.menu_name ,b.menu_describe,b.menu_price,b.menu_img
                  FROM stcare a LEFT JOIN menu b ON a.menu_id = b.id  
                  WHERE b.id in(?)`

      db.query(sql2, [cart_ids], (error2, data2) => {
        if (error2) {

          return res.json({
            ok: 0,
            error: error2
          })

        } else {
          data2.forEach(item => {
            if (item.menu_check == 1) {
              item.menu_check = true
            } else {
              item.menu_check = false
            }
          })
          res.json({
            ok: 1,
            data: data2
          })
        }
      })

      }


    }
  })

})

// 添加购物车数量
router.put("/myCart_st", (req, res) => {
  let id = req.body.id
  let menu_num = req.body.menu_num
  let sql = "UPDATE stcare SET menu_num = ? WHERE id = ?"
  db.query(sql, [menu_num, id], (error, data) => {
    if (error) {
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

// 修改选中
router.put("/myCart_st/:id", (req, res) => {
  let id = req.params.id
  let ischeck = req.body.ischeck

  if (ischeck) {
    ischeck = 1
  } else {
    ischeck = 0
  }

  let sql = "UPDATE stcare SET menu_check = ? WHERE id = ?"
  db.query(sql, [ischeck, id], (error, data) => {
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


// 修改选中全部
router.put("/myCart_s_all", (req, res) => {
  let ids = req.body.id
  let ischeck = req.body.ischeck

  if (ischeck) {
    ischeck = 1
  } else {
    ischeck = 0
  }


  let sql = "UPDATE stcare SET menu_check = ? WHERE id in(?)"
  db.query(sql, [ischeck, ids], (error, data) => {
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

// 删除  单个
router.delete("/myCart_st/:id", (req, res) => {
  let id = req.params.id;
  let sql = 'DELETE FROM stcare WHERE  id = ?'
  db.query(sql, id, (error, data) => {
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

// 删除  多个
router.delete("/myCart_st", (req, res) => {
  let ids = req.body.id;
  let sql = 'DELETE FROM stcare WHERE  id in (?)'
  db.query(sql, [ids], (error, data) => {
    if (error) {
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
