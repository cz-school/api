const express = require("express")
const router = express.Router()

const conn = require("../../db.js")

// 获取到窗口的数据
router.get('/win_st', (req, res) => {
    let pagesize = req.query.pagesize || 10;
    let pagenum = req.query.pagenum || 1;
    let pageindex = (pagenum - 1) * pagesize;

    // 获取到窗口的名称
    let win_name = req.query.win_name || " ";
    // 获取到窗口开放的时间
    let win_start = req.query.win_start || " ";
    // 获取到窗口结束时间
    let win_end = req.query.win_end || " ";

    let where = ` WHERE  1  `;
    if (win_name !== " ") {
        where = where + ` AND win_name =${win_name} `;
    }
    if (win_start !== " ") {
        where = where + ` AND win_start <${win_start} `;
    }
    if (win_end !== " ") {
        where = where + ` AND win_end >${win_end} `;
    }

    let order = `order by id desc `
    let limit = ` limit ${pageindex}, ${pagesize} `;

    let sql = `select * from win ${where} ${order} ${limit}`;
    conn.query(sql, (error, data) => {
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
                    msg: "获取窗口成功",
                },
                data: data
            })
        }
    })
})

// 获取到窗口以及菜品数据
router.get('/win_list_st', (req, res) => {
    let pagesize = req.query.pagesize * 3 || 30;
    let pagenum = req.query.pagenum || 1;
    let pageindex = (pagenum - 1) * pagesize;
    let query = req.query.query || " ";

    let menu_price_min = req.query.menu_price_min || " ";
    let menu_price_max = req.query.menu_price_max || " ";
    let win_start = req.query.win_start || " ";
    let win_end = req.query.win_end || " ";

    let where = ` WHERE  1 And a.id = c.win_id And b.id = c.menu_id `;

    // 模糊查询
    if (query !== " " && query !== 'undefined') {
        where = where + ` AND menu_name like '%${query}%' `;
    }

    // 价格最低
    if (menu_price_min !== " " && menu_price_min !== 'undefined') {
        where = where + ` AND menu_price >= ${menu_price_min} `;
    }
    // 价格最高
    if (menu_price_max !== " " && menu_price_max !== 'undefined') {
        where = where + ` AND menu_price <= ${menu_price_max} `;
    }
    // 开始时间
    if (win_start !== " " && win_start !== 'undefined') {
        where = where + ` AND win_start  >= '${win_start}' `;
    }
    // 结束时间
    if (win_end !== " " && win_end !== 'undefined') {
        where = where + ` AND win_end >= '${win_end}' `;
    }

    let order = `order by  c.id asc `
    let limit = ` limit ${pageindex}, ${pagesize} `;
    let sql = `select a.id, a.win_name,a.win_start,a.win_end, a.win_inter,
    b.menu_name, b.Menu_price, b.Menu_describe, b.Menu_img, b.Menu_unit
    from win a,menu b, win_menu c
    ${where} 
    ${order} 
    ${limit}`;
    // console.log(sql);
    conn.query(sql, (error, data) => {
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
            let datalist = {};
            let idlist = [];
            data.forEach((item, index) => {
                if (idlist.indexOf(item.id) == '-1') {
                    idlist.push(item.id);
                    datalist[`${item.id}`] = {
                        win_id: item.id,
                        win_name: item.win_name,
                        win_start: item.win_start,
                        win_end: item.win_end,
                        win_inter: item.win_inter,
                        menu: {
                            menu_name: item.menu_name,
                            Menu_price: item.Menu_price,
                            Menu_describe: item.Menu_describe,
                            Menu_img: item.Menu_img,
                            Menu_unit: item.Menu_unitv
                        }
                    }
                } else {
                    if (!datalist[`${item.id}`].menu1 || datalist[`${item.id}`].menu1 == undefined) {
                        datalist[`${item.id}`].menu1 = {
                            menu_name: item.menu_name,
                            Menu_price: item.Menu_price,
                            Menu_describe: item.Menu_describe,
                            Menu_img: item.Menu_img,
                            Menu_unit: item.Menu_unit
                        }
                        return;
                    }
                    if (!datalist[`${item.id}`].menu2 || datalist[`${item.id}`].menu2 == undefined) {
                        datalist[`${item.id}`].menu2 = {
                            menu_name: item.menu_name,
                            Menu_price: item.Menu_price,
                            Menu_describe: item.Menu_describe,
                            Menu_img: item.Menu_img,
                            Menu_unit: item.Menu_unit
                        }
                        return;
                    }

                }

            });
            res.json({
                "ok": 1,
                state: {
                    code: "200",
                    msg: "获取窗口——菜品成功",
                },
                data: {
                    idlist,
                    datalist
                }
            })
        }
    })
})
// 获取到对应分类
router.get('/menu_classify_st', (req, res) => {

    let sql = `select * from stclassify`;
    conn.query(sql, (error, data) => {
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
                    msg: "获取彩屏分类成功",
                },
                data: data
            })
        }
    })
})

// 获取到菜品具体的数据
router.get('/list_st', (req, res) => {
    let pagesize = req.query.pagesize || 10;
    let pagenum = req.query.pagenum || 1;
    let pageindex = (pagenum - 1) * pagesize;

    let menu_price_min = req.query.menu_price_min || " ";
    let menu_price_max = req.query.menu_price_max || " ";
    let stclassify_id = req.query.stclassify_id || " ";

    let where = ` WHERE  1 And  b.id = c.menu_id `;

    // 价格最低
    if (menu_price_min !== " " && menu_price_min !== 'undefined') {
        where = where + ` AND menu_price >= ${menu_price_min} `;
    }
    // 价格最高
    if (menu_price_max !== " " && menu_price_max !== 'undefined') {
        where = where + ` AND menu_price <= ${menu_price_max} `;
    }
    // 分类
    if (stclassify_id !== " " && stclassify_id !== 'undefined') {
        where = where + ` AND stclassify_id  = '${stclassify_id}' `;
    }


    let order = `order by  c.id asc `
    let limit = ` limit ${pageindex}, ${pagesize} `;
    let groupBy = `group by Menu_id`
    let sql = `select 
    b.menu_name, b.Menu_price, b.Menu_describe, b.Menu_img, b.Menu_unit 
    from menu b, win_menu c 
    ${where}
    ${groupBy} 
    ${order} 
    ${limit}`;
    // console.log(sql)
    conn.query(sql, (error, data) => {
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
                    msg: "获取窗口——菜品成功",
                },
                data: data
            })
        }
    })
})

// 根据窗口id 获取到  分类 以及 菜品 
router.get('/classify_list_st/:id', (req, res) => {
    let id = req.params.id;
    let where = ` where a.id = c.stclassify_id and b.id =c.menu_id and c.win_id = ? `
    let sql =
        `select  
    a.id  classify_id, a.name classify_name,
    b.id as menu_id , b.menu_name , b.menu_describe , b.menu_price , b.menu_img , b.menu_unit , b.recommend
    from 
    stclassify a, menu b, win_menu c
    ${where} `;
    // console.log(sql)
    conn.query(sql, [id], (error, data) => {
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
            let classify = [];
            let menu = [];
            data.forEach((item, index) => {
                if (classify.indexOf(item.classify_name) == -1) {
                    classify.push(item.classify_name)
                    menu.push([item]);
                } else {
                    menu[classify.indexOf(item.classify_name)].push(item);
                }
            })
            res.json({
                "ok": 1,
                state: {
                    code: "200",
                    msg: "根据窗口id 获取分类——菜品成功",
                },
                data: {
                    classify,
                    menu
                }
            })
        }
    })
})

// 通过菜品id 获取到菜品的数据
router.get('/list_st/:id', (req, res) => {
    let id = req.params.id;
    let where = ` where id = ? `
    let sql = `SELECT * FROM  menu ${where} `;
    // console.log(sql)
    conn.query(sql, [id], (error, data) => {
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
                    msg: "根据菜品id 获取菜品成功",
                },
                data: data
            })
        }
    })
})


// 获取到 通过win 商铺用户id
router.get('/stusers_id', (req, res) => {
    let win_id = req.query.win_id;
    let where = `where win_id = ${win_id} and a.win_id = b.id`
    let limit = ` limit 0,1`
    let sql = `SELECT user_id as stuser_id , win_name FROM win_menu a ,win b  ${where} ${limit}`;
    conn.query(sql, [win_id], (error, data) => {
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
                    msg: "通过win 获取商铺用户id成功",
                },
                data: data
            })
        }
    })
})


// 添加购物车
router.post('/add_care', (req, res) => {
    let user_id = req.body.user_id;
    let menu_id = req.body.menu_id;
    let stuser_id = req.body.stusersid;
    let menu_check = true;

    // 发起请求查看是否有菜品
    conn.query(`select * from stcare where user_id = ${user_id} and menu_id = ${menu_id}`, (error, data) => {
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
        // 购物车中已经有了这条事务
        if (data.length !== 0) {
            let num = data[0].menu_num - 0 + 1;
            let id = data[0].id
            conn.query(`update stcare set menu_num = ${num} where id =${id}`, (error1, data1) => {
                if (error1) {
                    res.json({
                        ok: "0",
                        state: {
                            code: "400",
                            msg: "出现错误",
                            'error': error1
                        }
                    })
                    return console.log(error1);
                } else {
                    res.json({
                        "ok": 1,
                        state: {
                            code: "200",
                            msg: "添加商品数量成功",
                        },
                        data: data
                    })
                }
            })
        }
        // 购物车中没有食物
        else {
            let menu_num = 1;
            conn.query("insert into stcare(menu_id,user_id,menu_num,menu_check,stuser_id) values(?,?,?,?,?)"
                , [menu_id, user_id, menu_num, menu_check, stuser_id],
                (error2, data2) => {
                    if (error2) {
                        res.json({
                            ok: "0",
                            state: {
                                code: "400",
                                msg: "出现错误",
                                'error': error2
                            }
                        })
                        return console.log(error2);
                    } else {
                        res.json({
                            "ok": 1,
                            state: {
                                code: "200",
                                msg: "把商品添加到购物车成功",
                            },
                            data: data2
                        })
                    }
                })
        }
    })
})

// 获取到购物车中的数量
router.get('/care_st', (req, res) => {
    let user_id = req.query.user_id;
    let where = `where user_id = ${user_id}`

    let sql = `SELECT count(*) as care_num FROM stcare ${where}`;
    conn.query(sql, (error, data) => {
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
                    msg: "获取到购物车中的数量成功",
                },
                data: data
            })
        }
    })
})




// 后台管理系统
// 后台管理系统
// 后台管理系统
// 后台管理系统
// 后台管理系统
// 后台管理系统
// 后台管理系统
// 后台管理系统
// 后台管理系统
// 后台管理系统
// 后台管理系统
// 后台管理系统
// 后台管理系统
// 后台管理系统
// 后台管理系统

// 获取到窗口的数据后台
router.get('/win_st_ht', (req, res) => {
    let pagesize = req.query.pagesize || 10;
    let pagenum = req.query.pagenum || 1;
    let pageindex = (pagenum - 1) * pagesize;

    let query = req.query.query || "";

    let users_id = req.query.users_id || " ";

    // 获取到窗口的名称
    let win_name = req.query.win_name || " ";
    // 获取到窗口开放的时间
    let win_start = req.query.win_start || " ";
    // 获取到窗口结束时间
    let win_end = req.query.win_end || " ";

    let where = ` WHERE  1  `;
    // 食堂老板
    if (users_id !== " " && users_id !== "undefined") {
        where = where + ` AND users_id =${users_id} `;
    }
    if (win_name !== " ") {
        where = where + ` AND win_name =${win_name} `;
    }
    if (win_start !== " ") {
        where = where + ` AND win_start <${win_start} `;
    }
    if (win_end !== " ") {
        where = where + ` AND win_end >${win_end} `;
    }
    if (query !== " ") {
        where = where + ` AND win_name like '%${query}%' `;
    }
    let order = `order by id desc `
    let limit = ` limit ${pageindex}, ${pagesize} `;

    let sql = `select count(*) as total  from win; select * from win ${where} ${order} ${limit}`;
    conn.query(sql, (error, data) => {
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
                    msg: "获取窗口成功",
                },
                data: data
            })
        }
    })
})
// 通过id获取到窗口数据
router.get('/win_st_ht/:id(\\d+)', (req, res) => {
    let id = req.params.id;
    let sql = `select * from win where id = ?`;
    conn.query(sql, [id], (error, data) => {
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
                    msg: "通过id获取窗口成功",
                },
                data: data
            })
        }
    })
})
// 添加窗口的数据
router.post("/win_st_ht", (req, res) => {
    let result = {
        win_name: req.body.win_name,
        users_id: req.body.users_id,
        win_inter: req.body.win_inter || null,
        win_start: req.body.win_start || null,
        win_end: req.body.win_end || null
    }
    let sql = `insert into win set ?`;
    conn.query(sql, result, (error, data) => {
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
// 删除窗口的数据
router.delete('/win_st_ht/:id(\\d+)', (req, res) => {
    let id = req.params.id;
    let sql = `delete from win where id =? ;`;
    conn.query(sql, [id], (error, data) => {
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
// 修改窗口数据
router.put('/win_st_ht/:id(\\d+)', (req, res) => {

    let id = req.params.id;
    let resulte = {
        win_name: req.body.win_name,
        users_id: req.body.users_id,
        win_inter: req.body.win_inter,
        win_start: req.body.win_start,
        win_end: req.body.win_end,
    }
    let sql = `update win set ? where id =? ;`;
    conn.query(sql, [resulte, id], (error, data) => {
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
                    msg: "修改数据成功",
                }
            })
        }
    })
})

// 后台管理系统中菜品分类
// 后台管理系统中菜品分类
// 后台管理系统中菜品分类
// 后台管理系统中菜品分类
// 后台管理系统中菜品分类
// 后台管理系统中菜品分类
// 后台管理系统中菜品分类
// 后台管理系统中菜品分类
// 后台管理系统中菜品分类


// 获取到菜品分类
router.get('/classify_st_ht', (req, res) => {
    let pagesize = req.query.pagesize || 10;
    let pagenum = req.query.pagenum || 1;
    let pageindex = (pagenum - 1) * pagesize;
    let users_id = req.query.users_id || "1";
    let query = req.query.query || " ";

    let where = ` WHERE  1  And b.stclassify_id = a.id`;

    if (query !== " ") {
        where = where + ` AND name like '%${query}%' `;
    }
    // 食堂老板
    if (users_id !== " " && users_id !== "undefined") {
        where = where + ` AND user_id =${users_id} `;
    }
    let order = `order by a.id asc `
    let limit = ` limit ${pageindex}, ${pagesize} `;

    let sql = `select count(*) as total  from stclassify a, win_menu b where b.stclassify_id=a.id And user_id = ${users_id}; 
    select * from stclassify a, win_menu b ${where} ${order} ${limit}`;
    conn.query(sql, (error, data) => {
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
                    msg: "获取分类数据成功",
                },
                data: data
            })
        }
    })
})
// 通过id获取到菜品分类
router.get('/classify_st_ht/:id(\\d+)', (req, res) => {
    let id = req.params.id;
    let sql = `select * from stclassify where id = ?`;
    conn.query(sql, [id], (error, data) => {
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
router.post("/classify_st_ht", (req, res) => {
    let result = {
        name: req.body.name,
    }
    let sql = `insert into stclassify set ?`;
    conn.query(sql, result, (error, data) => {
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
router.delete('/classify_st_ht/:id(\\d+)', (req, res) => {
    let id = req.params.id;
    let sql = `delete from stclassify where id =? ;`;
    conn.query(sql, [id], (error, data) => {
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
router.put('/classify_st_ht/:id(\\d+)', (req, res) => {
    let id = req.params.id;
    let resulte = {
        name: req.body.name,
    }
    let sql = `update stclassify set ? where id = ? ;`;
    conn.query(sql, [resulte, id], (error, data) => {
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
// 

// 获取到菜品的后台管理系统
// 获取到菜品的后台管理系统
// 获取到菜品的后台管理系统
// 获取到菜品的后台管理系统
// 获取到菜品的后台管理系统
// 获取到菜品的后台管理系统
// 获取到菜品的后台管理系统
// 获取到菜品的后台管理系统
// 获取到菜品的后台管理系统
// 获取到菜品的后台管理系统
// 获取到菜品的后台管理系统
// 获取到菜品的后台管理系统
// 获取到菜品的后台管理系统
// 获取到菜品的后台管理系统






// 更具登录的人获取 获取到菜品  和 所属分类 所属窗口
router.get('/menu_st_ht', (req, res) => {
    let pagesize = req.query.pagesize || 10;
    let pagenum = req.query.pagenum || 1;
    let pageindex = (pagenum - 1) * pagesize;
    let query = req.query.query || " ";
    let users_id = req.query.users_id || " ";
    let win_id = req.query.win_id || " ";
    let classify_id = req.query.classify_id || " ";
    // where 条件
    let where = ` WHERE  1  AND a.id = b.menu_id And b.stclassify_id = c.id And b.win_id = d.id `;

    if (query !== " ") {
        where = where + ` AND a.menu_name like '%${query}%' `;
    }
    // 食堂老板
    if (users_id !== " " && users_id !== "undefined") {
        where = where + ` AND b.user_id =${users_id} `;
    }

    // 根据窗口渲染数据
    if (win_id !== " ") {
        where = where + ` AND b.win_id like '%${win_id}%' `;
    }
    // 根据分类渲染数据
    if (classify_id !== " ") {
        where = where + ` AND b.stclassify_id like '%${classify_id}%' `;
    }
    let order = `order by a.id asc `
    let limit = ` limit ${pageindex}, ${pagesize} `;

    let sql = `select count(*) as total from menu a, win_menu b , stclassify c , win d
    Where a.id = b.menu_id And b.stclassify_id = c.id And b.win_id = d.id And b.user_id = ${users_id};
    select *,c.name as classify_name , b.id as win_menu_id from menu a, win_menu b , stclassify c , win d ${where} ${order} ${limit}`;

    // console.log(sql);
    conn.query(sql, (error, data) => {
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
                    msg: "获取根据不同状态获取菜品数据成功",
                },
                data: data
            })
        }
    })
})
// 通过id获取到菜品分类
router.get('/menu_st_ht/:id(\\d+)', (req, res) => {
    let id = req.params.id;
    let sql = `select * from stclassify where id = ?`;
    conn.query(sql, [id], (error, data) => {
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
// 添加菜品
router.post("/menu_st_ht", (req, res) => {
    let result = {
        menu_name: req.body.menu_name,
        menu_describe: req.body.menu_describe || null,
        menu_price: req.body.menu_price,
        menu_unit: req.body.menu_unit,
        menu_img: req.body.menu_img || null,
        recommend: req.body.recommend || "0",

    }
    let sql = `insert into menu set ?`;
    conn.query(sql, result, (error, data) => {
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
                    msg: "添加菜品数据成功",
                },
                data: data
            })
        }
    })
})
// 添加菜品-窗口-分类-表  win_menu
router.post("/win_menu_st_ht", (req, res) => {
    let result = {
        win_id: req.body.win_id,
        stclassify_id: req.body.stclassify_id,
        menu_id: req.body.menu_id,
        user_id: req.body.users_id
    }
    for (let key in result) {
        if (result[key] == "" || result[key] == undefined || result == null) {
            return res.json({
                ok: "0",
                state: {
                    code: "400",
                    msg: `${key}的数据为${result[key]}`
                }
            })
        }
    }
    let sql = `insert into win_menu set ?`;
    conn.query(sql, result, (error, data) => {
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
                    msg: "添加中间表数据成功",
                }
            })
        }
    })
})



// 删除菜品
router.delete('/win_menu_id/:id(\\d+)', (req, res) => {
    let id = req.params.id;
    let win_menu_id = req.body.win_menu_id;
    let sql = `delete from menu where id =? ;`;
    conn.query(sql, [id], (error, data) => {
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
            conn.query(`delete from menu where id =${win_menu_id}`, (error1, data1) => {
                if (error1) {
                    res.json({
                        ok: "0",
                        state: {
                            code: "400",
                            msg: "出现错误",
                            'error': error1
                        }
                    })
                    return console.log(error1);
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

        }
    })

})
// 修改菜品
router.put('/menu_st_ht/:id(\\d+)', (req, res) => {
    let id = req.params.id;
    let resulte = {
        name: req.body.name,
    }
    let sql = `update stclassify set ? where id = ? ;`;
    conn.query(sql, [resulte, id], (error, data) => {
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




module.exports = router;