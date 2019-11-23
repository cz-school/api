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
    // console.log(req.query);
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
    } else if (reqId === null) {
        var sql = `select count(*) as total from shop where buys = 0;select *,id shop_id from shop where buys = 0 ${limit}`
        var value = ""
    } if (reqId === "null") {
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

// 单个商品
router.get('/shopId/:id', (req, res) => {
    const reqId = req.params.id
    var sql = `select * from shop where id = ${reqId}`

    db.query(sql, (err, data) => {
        if (err) {
            res.json({
                'ok': 0,
                'error': err
            })
            return
        } else {

            let sql2 = 'SELECT shop_img FROM shopimg WHERE shop_id = ?'
            db.query(sql2, reqId, (error, data2) => {
                if (error) {
                    return res.json({
                        'ok': 0,
                        'error': error
                    })
                } else {
                    res.json({
                        'ok': 1,
                        'data': data,
                        'imgList': data2
                    })
                }
            })

        }
    })
    // if (reqId >= 0) {
    //     var sql = `select * from shop where id = ${reqId}`
    //     var value = '%' + reqData + '%'
    // } else
    // if (reqData != "undefined") {
    //     var sql = `select count(*) as total from shop where shop_name like ? and buys = 0;select *,id shop_id from shop where shop_name like ? and buys = 0 ${limit}`
    //     var value = '%' + reqData + '%'
    // } else if (reqId != "null") {
    //     var sql = `
    //     select count(*) as total 
    //     from esclassify_shop a,shop b,esclassify c 
    //     where a.esclassify_id=c.id 
    //     and  a.shop_id=b.id 
    //     and  esclassify_id = ?
    //     and  b.buys = 0;
    //     select * 
    //     from esclassify_shop a,shop b,esclassify c 
    //     where a.esclassify_id=c.id 
    //     and  a.shop_id=b.id 
    //     and  esclassify_id = ?
    //     and  b.buys = 0
    //     ${limit}`
    //     var value = Number(reqId) + 1
    // } else if (reqId === "null") {
    //     var sql = `select count(*) as total from shop where buys = 0;select *,id shop_id from shop where buys = 0 ${limit}`
    //     var value = ""
    // }


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
    // console.log(req.body.shopData)
    var value = `null,'${req.body.shopData.shop_name}', '${req.body.shopData.shop_describe}', ${req.body.shopData.shop_price}, '${req.body.shopData.shop_img}', '${req.body.shopData.shop_unit}', 17, 0,${req.body.shopData.shop_original_cost}, ${req.body.shopData.shop_num_new}`
    var sql = `INSERT INTO shop VALUES (${value})`
    db.query(sql, (err, data) => {
        if (err) {
            res.json({
                'ok': 0,
                'error': err
            })
            return
        } else {
            // console.log(data.insertId)
            if (req.body.shopData.shop_imgList) {
                req.body.shopData.shop_imgList.forEach(item => {
                    db.query("INSERT INTO shopimg VALUE(?,?,?)", [null, data.insertId, item], (error, data2) => {
                        if (error) {
                            return res.json({
                                'ok': 0,
                                'error': error
                            })
                        }
                    })
                });
            }

            res.json({
                'ok': 1,
                'data': data.insertId
            })
        }

    })
})



module.exports = router;