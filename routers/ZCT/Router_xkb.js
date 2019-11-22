const express = require("express")
const router = express.Router()

// 引入mysql
const conn = require('../../db')

// 获取订单的金额
router.get('/getOrderMoney',(req,res) => {
    // console.log(1)
    // 获取订单的id
    let orderId = req.query.id
    // console.log(orderId)
    conn.query('select price from `order` where id =?',orderId,(error,data) => {
        if(error) {
            res.json({
                'ok':0,
                'error':error
            })
            console.log(error)
            return
        } else {
            res.json({
                'ok':1,
                'data':data
            })
        }

    })
})
router.get('/getUsersMoney',(req,res)=> {
    let usersId =  1
    conn.query('select price from users where id = ?',usersId,(error,data) => {
        if(error) {
            res.json({
                'ok':0,
                'error':error
            })
            console.log(error)
        } else {
            res.json({
                'ok':1,
                'data':data
            })
        }
    })
})
// 付款完毕后修改用户剩余金额
router.post('/updateOrderMoney',(req,res) => {
    let price = req.body.price
    let id = 1
    let msg = [price,id]  
    conn.query('update users set price=? where id = ?',msg,(error,data) => {
        if(error) {
            res.json({
                'ok':0,
                'error':error
            })
            console.log(error)
        } else {
            res.json({
                'ok':1,
                'data':data
            })
        }
    })
})

// 后台数据显示
router.get('/showTableData',(req,res) => {
    // 获取用户id
    let id = req.query.id
    // 获取商品订单状态
    let state = req.query.state
    let sql = '  Select * From `order`  where state in (?)  and id in (Select order_id From order_stdetail where menu_id in (Select menu_id From win_menu where user_id in (?) ))'
    let msg  = [state,id]
    conn.query(sql,msg,(error,data) => {
        if(error) {
            res.json({
                'ok':0,
                'error':error
            })
            console.log(error)
        } else {
            res.json({
                'ok':1,
                'data':data
            })
        }
    })
})

// 修改订单状态
router.post('/affirmState/:id(\\d+)/:state(\\d+)',(req,res) => {
    // 获取商品id
    let id = req.params.id
    // 获取订单状态
    let state = (req.params.state - 0) + 1
    // 传入信息
    let msg = [state,id]
    conn.query('update `order` set state =? where id = ?',msg,(error,data) => {
        if(error) {
            res.json({
                'ok':0,
                'error':error
            })
            console.log(error)
        } else {
            res.json({
                'ok':1,
                'msg':'更新成功'
            })
        }
    })
})

module.exports = router;

