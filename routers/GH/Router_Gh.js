const express = require("express")
const router = express.Router()
const conn = require('../../db')
// 渲染购买宝贝页面
router.post('/purchase/:id', (req, res) => {
    let id = req.params.id
    conn.query('select * from shop where id = ?', id, (error, data) => {
        if (error) {
            res.json({
                code: "400",
                msg: "商品查询出现错误"
            })
        } else {
            res.json({
                code: "200",
                msg: "商品查询成功",
                data: data
            })
        }
    })
})
// 渲染默认购买宝贝地址
router.post('/purchaseSite', (req, res) => {
    // 用户id
    let userid = req.body.userid;
    // 地址id
    let id = req.body.id.id;
    // 当地址id为空时选择第一个地址
    if (id === undefined) {
        conn.query('select * from address  where users_id=?', userid, (error, data) => {
            if (error) {
                res.json({
                    code: "400",
                    msg: "收获地址查询失败",
                })
            } else {
                let datas = data[0];
                res.json({
                    code: "200",
                    msg: "收获地址查询成功",
                    data: datas
                })
            }
        })
    } else {
        conn.query('select * from address  where users_id = ? and id = ?', [userid, id], (error, data) => {
            if (error) {
                res.json({
                    code: "400",
                    msg: "地址查询失败",
                })
            } else {
                let datas = data[0];
                res.json({
                    code: "200",
                    msg: "地址查询成功",
                    data: datas
                })
            }
        })
    }
})
// 渲染所有的地址
router.post('/changesite/:id', (req, res) => {
    // 用户id
    let userid = req.params.id;
    conn.query('select * from address where users_id = ?', userid, (error, data) => {
        if (error) {
            res.json({
                code: "400",
                msg: "地址查询失败",
            })
        } else {
            res.json({
                code: "200",
                msg: "地址查询成功",
                data: data
            })
        }
    })
})
// 确认付款
router.post('/payment', (req, res) => {
    let commodityId = req.body.commodityId
    let userid = req.body.userid
    // console.log(req.body)
    // 查询商品金额和账户余额
    conn.query(`select shop_price from shop where id = ${commodityId};select price from users where id = ${userid}`, (error, data) => {
        if (error) {
            res.json({
                code: '200',
                msg: "付款失败"
            })
        }
        // 商品价格
        let shop_price = data[0][0].shop_price
        // 账户余额
        let userPrice = data[1][0].price
        // 账户余额大于等于商品金额才可以购买
        // console.log(shop_price,userPrice)
        if (userPrice >= shop_price) {
            // 修改账户余额并修改商品的状态
            conn.query(`update users set price=${userPrice-shop_price} where id=${userid};update shop set buys = 1 where id= ${commodityId}`, (error, data) => {
                if (error) {
                    res.json({
                        code: "200",
                        msg: "付款失败"
                    })
                } else {
                    res.json({
                        code: "400",
                        msg: "付款成功",
                        data: shop_price
                    })
                }
            })
        } else {
            res.json({
                code: "200",
                msg: "付款失败,账户余额不足"
            })
        }

    })
})
// 生成订单
router.post('/createorder', (req, res) => {
    // 当前时间秒
    let time = Date.parse(new Date()) / 1000;
    // 商品id
    let commodityId = req.body.commodityId
    // 支付金额
    let price = req.body.price
    // 用户id
    let userid = req.body.userid
    // 姓名
    let name = req.body.sites.users_name
    // 手机号
    let mobile = req.body.sites.users_mobile
    // 地址
    let site = req.body.sites.dormitory + req.body.sites.dormitory_no
    // 获取当前时间戳毫秒
    var timestamp = Date.parse(new Date());
    // 生成七个随机数
    let num = Math.random().toString().substring(2, 9);
    // 拼接成订单号
    let order_num = timestamp + num;
    // 添加数据
    let arr = [order_num, time, price, 1, userid, 2, 0, 4, name, mobile, site]
    conn.query('insert into `order`(order_num,add_time,price,state,user_id,classify_State,return_state,pay_method,shr_name,shr_mobile,shr_address) values(?,?,?,?,?,?,?,?,?,?,?)', arr, (error, data) => {
        if (error) {
            res.json({
                code: "200",
                msg: "生成订单失败"
            })
        } else {
            // 查询添加的订单号的id
            conn.query('select id from `order` where order_num =?', order_num, (error, data) => {
                if (error) {
                    id
                    console.log(error)
                }
                let orderId = data[0].id
                let escarearr = [orderId, commodityId]
                conn.query('insert into order_esdetail(order_id,shop_id) values(?,?)', escarearr, (error, data) => {
                    if (error) {
                        console.log(error)
                        res.json({
                            code: "200",
                            msg: "创建失败"
                        })
                    } else {
                        res.json({
                            code: "400",
                            msg: "创建成功"
                        })
                    }
                })
            })
        }
    })

})
// 渲染订单列表
router.post('/gainOrder', (req, res) => {
    // 用户id
    let userid = req.body.userid
    conn.query('SELECT shop.shop_name,shop.shop_price,shop.shop_img,shop.user_id,`order`.order_comment,`order`.id FROM `order` ,order_esdetail ,shop where `order`.id = order_esdetail.order_id and order_esdetail.shop_id = shop.id and `order`.user_id = ?', userid, (error, data) => {
        if (error) {
            res.json({
                code: "200",
                msg: "查询订单失败"
            })
        } else {
            res.json({
                code: "400",
                msg: "查询订单成功",
                data: data
            })
        }
    })
})
// 评论
router.post('/comment', (req, res) => {
    let id = req.body.id;
    let value = req.body.value
    let arr = [value, id]
    conn.query('update `order` set order_comment = ? where id = ?', arr, (error, data) => {
        if (error) {
            console.log(error)
            res.json({
                code: "200",
                msg: "评论失败"
            })
        } else {
            res.json({
                code: "400",
                msg: "评论成功"
            })
        }

    })
})

// 后台代码
// 获取所有的订单时间数量
router.get('/showtime', (req, res) => {
    // 多少天前的时间戳
    let begtime = req.query[0]
    // 当天23.59分的时间戳
    let endtime = (new Date().setHours(24, 0, 0, 0)) / 1000;
    // console.log(begtime, endtime)
    conn.query('select a.add_time from `order` a LEFT JOIN order_esdetail b on a.id = b.order_id  where a.add_time >=? and a.add_time <=?', [begtime, endtime], (error, data) => {
        if (error) {
            console.log(error)
        }
        // console.log(data)
        let info = []
        info = data

        function getLocalTime(nS) {
            return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
        }
        info.forEach(v => {
            let value = getLocalTime(v.add_time)
            v.add_time = value
        })
        // console.log(info)
        let arr = []
        for (var i = 0; i < info.length; i++) {
            arr.push(info[i].add_time)
        }
        // console.log(arr.length)
        var arrNum = 1
        var numArr = []
        for (var i = 0; i < arr.length; i++) {
            arr[i].slice(0, 10)
            if (i == arr.length - 1) {
                numArr.push(arrNum)
            } else if (arr[i].slice(0, 10) == arr[i + 1].slice(0, 10)) {
                arrNum++
            } else {
                numArr.push(arrNum)
                arrNum = 1
            }
        }
        // console.log(numArr)
        // console.log(arr[0].slice(9,7))
        res.json({
            code:"200",
            msg:"查询成功",
            data:numArr
        })
    })
})
module.exports = router;