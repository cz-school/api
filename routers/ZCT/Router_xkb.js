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
    let usersId =  req.query.id
    // console.log(usersId + '123123sdasqw')
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
    let id = req.body.id
    let msg = [price,id]  
    conn.query(`update users set price=? where id = ?`,msg,(error,data) => {
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

// 更改全部 pay_method
router.post('/updateOrderMoneyAll',(req,res) => {
    let price = req.body.price
    let id = req.body.id
    let msg = [price,id]
    let order_id = req.body.order_id
    let pay_method =req.body.valSelect;
    conn.query(`update users set price=? where id = ?`,msg,(error,data) => {
        if(error) {
            res.json({
                'ok':0,
                'error':error
            })
            return console.log(error)
        } else {
            conn.query('update `order` set pay_method = ? , state = 1 where id = ?',[pay_method,order_id],(error1,data1)=>{
                if(error1) {
                    res.json({
                        'ok':0,
                        'error':error1
                    })
                   return console.log(error1)
                } 
                else{
                    res.json({
                        'ok':1,
                        'data':data
                    })
                }
            })

        }
    })
})

module.exports = router;

