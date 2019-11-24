const express = require("express")
const router = express.Router()

// 引入mysql
const conn = require('../../db')

// 用户的所有收货地址
router.get('/siteAll', (req, res) => {
    // 获取用户id 默认为1
    let id = req.query.id 
    // console.log(id)
    conn.query('select * from address where users_id = ?', id, (error, data) => {
        if (error) {
            res.json({
                'ok': 0,
                'error': error
            })
            return
        } else {
            res.json({
                'ok': 1,
                'data': data
            })
        }
    })
})

// 添加用户地址
router.post('/addSite', (req, res) => {
    // 获取添加的数据
    let msg = req.body.addUsers
    // console.log(msg)
    // 获取登陆的用户id
    let id = req.body.id 
    // console.log(id + '222')
    // 是否是默认地址
    let mrSite = msg.checked1 ? 1 : 0
    // 插入的信息
    let siteMsg = [null, id, msg.name, msg.phone, 0, 0, 0, msg.address, 0, mrSite, msg.dormitory, msg.dormitory_no]

    // 如果添加的数据 为默认地址
    if (msg.checked1 == true) {
        conn.query('update address set sdefault = 0 where users_id = ?', id, (error, data) => {
            if (error) {
                res.json({
                    'ok': 0,
                    'error': error
                })
            }

            conn.query('insert into address values (?,?,?,?,?,?,?,?,?,?,?,?)', siteMsg, (error, data) => {
                if (error) {
                    res.json({
                        'ok': 0,
                        'error': error
                    })
                } else {
                    res.json({
                        'ok': 1,
                        'msg': '添加地址成功'
                    })
                }
            })
        })


    } else {

        conn.query('insert into address values (?,?,?,?,?,?,?,?,?,?,?,?)', siteMsg, (error, data) => {
            if (error) {
                res.json({
                    'ok': 0,
                    'error': error
                })
            } else {
                res.json({
                    'ok': 1,
                    'msg': '添加地址成功'
                })
            }
        })
    }
})

// 根据id查询地址信息
router.get('/siteShow', (req, res) => {
    // let userId = req.body.id || 1
    let id = req.query.id
    console.log(id)
    conn.query('select * from address where id = ?', id, (error, data) => {
        if (error) {
            res.json({
                'ok': 0,
                'error': error
            })
        } else {
            res.json({
                'ok': 1,
                'data': data
            })
        }
    })

})

// 用户的默认收货地址
router.get('/siteDefault', (req, res) => {
    // 获取用户id 默认为1
    let id = req.query.id || 1
    conn.query('select * from address where users_id = ? and sdefault = 1', id, (error, data) => {
        if (error) {
            res.json({
                'ok': 0,
                'error': error
            })
            return
        } else {
            res.json({
                'ok': 1,
                'data': data
            })
        }
    })
})

// 修改地址信息
router.get('/alertSite', (req, res) => {
    // 获取传过来的信息
    
    let msg1 = req.query.msg

    let msg = JSON.parse(msg1)

    // 获取登陆的用户id
    let id = req.query.id 
    // console.log(id + 'dqwq')
    // 获取修改后的地址是否是默认地址
    let che = JSON.parse(req.query.checked1)
    let mrSite = che === true ? 1 : 0
    // 修改的数据
    let alertMsg = [msg.users_name,msg.users_mobile,msg.address,msg.dormitory,msg.dormitory_no,mrSite,msg.id]
    // 如果添加的数据 为默认地址
   
    // console.log(req.query.checked1)
    // console.log(mrSite)
    if (che === true) {
        // console.log(1111)
        conn.query('update address set sdefault = 0 where users_id = ?', id, (error, data) => {
            if (error) {
                res.json({
                    'ok': 0,
                    'error': error
                })
            }

            conn.query('update address set users_name=?, users_mobile=?, address=? ,dormitory=? ,dormitory_no = ?, sdefault =? where id =?', alertMsg, (error, data) => {
                if (error) {
                    res.json({
                        'ok': 0,
                        'error': error
                    })
                    console.log(error)
                } else {
                    res.json({
                        'ok': 1,
                        'msg': '修改地址成功'
                    })
                }
            })
        })


    } else {
        conn.query('update address set users_name=?, users_mobile=?, address=? ,dormitory=? ,dormitory_no = ?, sdefault =? where id =?', alertMsg, (error, data) => {
            if (error) {
                res.json({
                    'ok': 0,
                    'error': error
                })
                console.log(error)
            } else {
                res.json({
                    'ok': 1,
                    'msg': '修改地址成功'
                })
            }
        })
       
    }
})
// 删除地址信息
router.delete('/deleteSite',(req,res) => {
    // 获取订单的id
    let siteId = req.body.id
    // console.log(siteId)
    conn.query('delete from address where id =?',siteId,(error,data) => {
        if(error) {
            res.json({
                'ok':0,
                'error':error
            })
            return
        } else {
            res.json({
                'ok':1,
                'msg':'删除地址成功'
            })
        }
        
    })
})


// 修改订单状态 whl 写

// 根据商家id显示订单状态 whl 写
router.get('/showTableData',(req,res)=>{
    let id =req.query.id;
    let state = req.query.state;
    let sql = 'select * from `order` where state = ? and id in   (select order_id from order_stdetail where menu_id in  (select menu_id from win_menu where user_id in (?)) )'
    conn.query(sql,[state,id],(error,data)=>{
        if(error) {
            res.json({
                'ok':0,
                'error':error
            })
            return console.log(error);
        }
        else{
            res.json({
                'ok':1,
                'msg':'查询订单成功',
                data:data
            })
        }
    })
})

// 修改发货状态 whl 写 /70/1
router.put('/affirmState/:id(\\d+)',(req,res)=>{
    let id = req.params.id;
    let state = {
        state:req.body.data.active-0+1
    }
    let sql = 'update `order` set ? where id = ?'
    conn.query(sql,[state,id],(error,data)=>{
        if(error) {
            res.json({
                'ok':0,
                'error':error
            })
            return console.log(error);
        }
        else{
            res.json({
                'ok':1,
                'msg':'修改状态成功',
                data:data
            })
        }
    })
})
module.exports = router;