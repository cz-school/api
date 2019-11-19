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
                    if (!datalist[`${item.id}`].menu1||datalist[`${item.id}`].menu1 == undefined ) {
                        datalist[`${item.id}`].menu1 = {
                            menu_name: item.menu_name,
                            Menu_price: item.Menu_price,
                            Menu_describe: item.Menu_describe,
                            Menu_img: item.Menu_img,
                            Menu_unit: item.Menu_unit
                        }
                        return;
                    }
                    if (!datalist[`${item.id}`].menu2||datalist[`${item.id}`].menu2 == undefined) {
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
    let pagesize = req.query.pagesize  || 10;
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
    b.menu_name , b.menu_describe , b.menu_price , b.menu_img , b.menu_unit , b.recommend
    from 
    stclassify a, menu b, win_menu c
    ${where} `;
    // console.log(sql)
    conn.query(sql,[id], (error, data) => {
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
            data.forEach((item,index)=>{
               if(classify.indexOf(item.classify_name)== -1){
                classify.push(item.classify_name)
                menu.push([item]);
               }else{
                menu[classify.indexOf(item.classify_name)].push(item);
               }
            console.log(classify);
            console.log(menu);
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


module.exports = router;