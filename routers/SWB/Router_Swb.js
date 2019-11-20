const express = require("express")
const router = express.Router()
const db = require("../../db")

// 发布商品分类
router.post('/esclassify_shop', (req, res) => {
    // var value = `null,''`
    // console.log(), 
    var sql = `INSERT INTO shop VALUES ('${req.body.esclassifyId}','${req.body.shopId}')`
    db.query(sql, (err, data) => {
        if (err) {
            res.json({
                'ok': 0,
                'error': err
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

// 商品分类
router.get('/esclassify', (req, res) => {
    let sql = "select * from esclassify"
    db.query(sql, (err, data) => {
        if (err) {
            res.json({
                'ok': 0,
                'error': err
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

// 商品列表
router.get('/shop/:id', (req, res) => {
    const reqId = req.params.id
    const reqData = req.query.inputVal
    console.log(reqId, reqData)

    if (reqData != "undefined") {
        var sql = "select * from shop where shop_name like ?"
        var value = '%' + reqData + '%'
    } else if (reqId != "null") {
        var sql = `
        select * 
        from esclassify_shop a,shop b,esclassify c 
        where a.esclassify_id=c.id 
        and  a.shop_id=b.id 
        and  esclassify_id = ?`
        var value = Number(reqId) + 1
    } else if (reqId === "null") {
        var sql = "select * from shop"
        var value = ""
    }
    console.log(sql, value)
    db.query(sql, value, (err, data) => {
        if (err) {
            res.json({
                'ok': 0,
                'error': err
            })
            return
        } else {
            console.log(data)
            res.json({
                'ok': 1,
                'data': data
            })
        }
    })
})

// 商品添加add
router.post('/shop', (req, res) => {
    var value = `${null},'${req.body.shopData.shop_name}', '${req.body.shopData.shop_describe}', ${req.body.shopData.shop_price}, '${req.body.shopData.shop_img}', '${req.body.shopData.shop_unit}', 17, 8,${req.body.shopData.shop_original_cost}, ${req.body.shopData.shop_num_new}`
    var sql = `INSERT INTO shop VALUES (${value})`
    db.query(sql, (err, data) => {
        db.query('select max(id) maxId from shop ', (err1, data1) => {
            if (err1) {
                res.json({
                    'ok': 0,
                    'error': err1
                })
                return
            } else {
                res.json({
                    'ok': 1,
                    'data': data1
                })
            }
        })
    })
})


module.exports = router;