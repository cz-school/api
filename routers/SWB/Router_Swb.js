const express = require("express")
const router = express.Router()
const db = require("../../db")

// 发布商品分类
router.post('/esclassify_shop', (req, res) => {
    // var value = `null,''`

    var sql = `INSERT INTO esclassify_shop VALUES (null,'${req.body.shopId}','${req.body.esclassifyId}')`
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

// 获取到菜品分类
router.get('/esclassify', (req, res) => {
    let pagesize = req.query.pagesize || 10;
    let pagenum = req.query.pagenum || 1;
    let pageindex = (pagenum - 1) * pagesize;
    let query = req.query.query || " ";
    let where = ` WHERE  1  `;
    if (query !== " ") {
        where = where + ` AND name like '%${query}%' `;
    }
    let order = `order by id asc `
    let limit = ` limit ${pageindex}, ${pagesize} `;
    let sql = `select count(*) as total  from esclassify; select * from esclassify ${where} ${order} ${limit}`;
    db.query(sql, (error, data) => {
        if (error) {
            res.json({
                ok: "0",
                state: {
                    code: "400",
                    msg: "出现错误",
                    'error': error
                }
            })
        }
        if (data.length === 0) {
            res.json({
                "ok": 0,
                state: {
                    code: "400",
                    msg: "没有该条件的数据",
                },
                data: data
            })
        } else {
            res.json({
                "ok": 1,
                state: {
                    code: "200",
                    msg: "获取分类数据成功",
                },
                data: data
            })
        }
    })
})
// 通过id获取到菜品分类
router.get('/esclassify/:id(\\d+)', (req, res) => {
    let id = req.params.id;
    let sql = `select * from esclassify where id = ?`;
    db.query(sql, [id], (error, data) => {
        if (error) {
            res.json({
                ok: "0",
                state: {
                    code: "400",
                    msg: "出现错误",
                    'error': error
                }
            })
            return console.log(error);
        }
        if (data.length === 0) {
            res.json({
                "ok": 0,
                state: {
                    code: "400",
                    msg: "没有该条件的数据",
                },
                data: data
            })
        } else {
            res.json({
                "ok": 1,
                state: {
                    code: "200",
                    msg: "通过id获取菜品分类",
                },
                data: data
            })
        }
    })
})
// 商品分类
// router.get('/esclassify', (req, res) => {
//     let sql = "select * from esclassify like ?"
//     let value = ""
//     db.query(sql, value, (err, data) => {
//         if (err) {
//             res.json({
//                 'ok': 0,
//                 'error': err
//             })
//             return
//         } else {
//             res.json({
//                 'ok': 1,
//                 'data': data
//             })
//         }
//     })
// })
// 添加菜品分类
router.post("/esclassify", (req, res) => {
    let result = {
        name: req.body.name,
    }
    let sql = `insert into esclassify set ?`;
    db.query(sql, result, (error, data) => {
        if (error) {
            res.json({
                ok: "0",
                state: {
                    code: "400",
                    msg: "出现错误",
                    'error': error
                }
            })
            return console.log(error);
        }
        else {
            res.json({
                "ok": 1,
                state: {
                    code: "200",
                    msg: "添加窗口数据成功",
                }
            })
        }
    })

})
// 删除菜品分类
router.delete('/esclassify/:id(\\d+)', (req, res) => {
    let id = req.params.id;
    let sql = `delete from esclassify where id =? ;`;
    db.query(sql, [id], (error, data) => {
        if (error) {
            res.json({
                ok: "0",
                state: {
                    code: "400",
                    msg: "出现错误",
                    'error': error
                }
            })
            return console.log(error);
        } else {
            res.json({
                "ok": 1,
                state: {
                    code: "200",
                    msg: "删除数据成功",
                }
            })
        }
    })
})

// 修改菜品分类
router.put('/esclassify/:id(\\d+)', (req, res) => {
    let id = req.params.id;
    let resulte = {
        name: req.body.name,
    }
    let sql = `update esclassify set ? where id = ? ;`;
    db.query(sql, [resulte, id], (error, data) => {
        if (error) {
            res.json({
                ok: "0",
                state: {
                    code: "400",
                    msg: "出现错误",
                    'error': error
                }
            })
            return console.log(error);
        } else {
            res.json({
                "ok": 1,
                state: {
                    code: "200",
                    msg: "修改菜品分类成功",
                }
            })
        }
    })
})

// 商品列表
router.get('/shop/:id', (req, res) => {
    let pagesize = req.query.pagesize || 10;
    let pagenum = req.query.pagenum || 1;
    let pageindex = (pagenum - 1) * pagesize;
    let reqData = req.query.inputVal || "";
    let limit = ` limit ${pageindex}, ${pagesize} `;
    const reqId = req.params.id

    if (reqData != "undefined") {
        var sql = `select count(*) as total from shop where shop_name like ? and buys = 0;select *,id shop_id from shop where shop_name like ? and buys = 0 ${limit}`
        var value = '%' + reqData + '%'
    } else if (reqId != "null") {
        var sql = `
        select count(*) as total 
        from esclassify_shop a,shop b,esclassify c 
        where a.esclassify_id=c.id 
        and  a.shop_id=b.id 
        and  esclassify_id = ?
        and  b.buys = 0;
        select * 
        from esclassify_shop a,shop b,esclassify c 
        where a.esclassify_id=c.id 
        and  a.shop_id=b.id 
        and  esclassify_id = ?
        and  b.buys = 0
        ${limit}`
        var value = Number(reqId) + 1
    } else if (reqId === "null") {
        var sql = `select count(*) as total from shop where buys = 0;select *,id shop_id from shop where buys = 0 ${limit}`
        var value = ""
    }

    db.query(sql, [value, value], (err, data) => {
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

router.get('/bgshop/:id', (req, res) => {
    let pagesize = req.query.pagesize || 10;
    let pagenum = req.query.pagenum || 1;
    let pageindex = (pagenum - 1) * pagesize;
    let reqData = req.query.query || "";
    let limit = ` limit ${pageindex}, ${pagesize} `;
    const reqId = req.params.id

    if (reqData != "undefined") {
        var sql = `select count(*) as total from shop where shop_name like ?; select *,id shop_id from shop where shop_name like ? ${limit}`
        var value = '%' + reqData + '%'
    } else if (reqId != "null") {
        var sql = `
        select count(*) as total 
        from esclassify_shop a,shop b,esclassify c 
        where a.esclassify_id=c.id 
        and  a.shop_id=b.id 
        and  esclassify_id = ?;
        select * 
        from esclassify_shop a,shop b,esclassify c 
        where a.esclassify_id=c.id 
        and  a.shop_id=b.id 
        and  esclassify_id = ?
        ${limit}`
        var value = Number(reqId) + 1
    } else if (reqId === "null") {
        var sql = `select count(*) as total from shop; select *,id shop_id from shop ${limit}`
        var value = ""
    }
    db.query(sql, [value, value], (err, data) => {
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

// 删除菜品分类
router.delete('/bgshop/:id(\\d+)', (req, res) => {
    let id = req.params.id;
    let sql = `delete from shop where id =? ;`;
    db.query(sql, [id], (error, data) => {
        if (error) {
            res.json({
                ok: "0",
                state: {
                    code: "400",
                    msg: "出现错误",
                    'error': error
                }
            })
        } else {
            res.json({
                "ok": 1,
                state: {
                    code: "200",
                    msg: "删除数据成功",
                }
            })
        }
    })
})

// 商品添加add
router.post('/shop', (req, res) => {
    var value = `null,'${req.body.shopData.shop_name}', '${req.body.shopData.shop_describe}', ${req.body.shopData.shop_price}, '${req.body.shopData.shop_img}', '${req.body.shopData.shop_unit}', 17, 0,${req.body.shopData.shop_original_cost}, ${req.body.shopData.shop_num_new}`
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