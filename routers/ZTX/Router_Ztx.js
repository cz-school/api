const express = require("express")
const router = express.Router()
const db = require("../../db")
const config = require("../../config")
const md5 = require("md5")
const jsonwebtoken = require('jsonwebtoken')
router.post("/setUserList", (req, res) => {
    // console.log(req.body);
    let token = req.body.token;
    try {
        var decoded = jsonwebtoken.verify(token, config.key);
    } catch (err) {
        if(err){
            res.json({
                code:400,
                msg:"令牌错误"
            })
            return
        }
    }
    // 判断 是否到期
    let thisTime = parseInt(new Date().getTime() / 1000);
    if(thisTime>decoded.exp){
        res.json({
            code:400,
            msg:"令牌失效"
        })
        return
    }
    // 去权限用户表中查找属于什么身份
    db.query(`select * from user_auth where user_id = ?`,decoded.id,(err,data)=>{
        if(err){
            res.json({
                code:400,
                msg:"服务器错误" + err
            })
            return
        }
        // 没有这个人就返回失败
        if(data.length == 0){
            res.json({
                code:400,
                msg:"登录失败1" 
            })
            return
        }
        // id 为一是管理员
        if(data[0].auth_id == 1){
            let stre = [{
                name: "列表管理",
                childs: [{
                    names: "管理列表",
                    router: "userList"
                }]
            }]
            let sql = `select * from user_list`
            db.query(sql, (err, data) => {
                if(err){
                    res.json({
                        code:400,
                        msg:"服务器错误" + err
                    })
                    return
                }
                data.forEach(v => {
                    let name = v.username;
                    let obj = {}
                    obj["name"] = name;
                    // let id = id;
                    obj["childs"] = [];
                    data.forEach(x => {
                        if (x.username == name) {
                            // console.log(x);
                            obj["childs"].push({
                                id: x.id,
                                names: x.childs,
                                router: x.router
                            })
                        }
                    })
                    stre.push(obj)
                });
                let newArr = [];
                let newName = [];
                stre.forEach(v => {
                    if (newName.indexOf(v.name) == -1) {
                        newName.push(v.name);
                        newArr.push(v)
                    }
                })
                res.json({
                    code:"200",
                    data:newArr
                })
            })
        }else if(data[0].auth_id == 2){   // id 为 2 是老板
            db.query(`select * from user_list where childs = "食堂管理"`,(err,data)=>{
                if(err){
                    res.json({
                        code:400,
                        msg:"服务器错误" + err
                    })
                    return
                }
                let stre = [{
                    name: data[0].childs,
                    childs: [{
                        names: data[0].childs,
                        router: data[0].router
                    }]
                }]
                if(data.length == 0){
                    res.json({
                        code:"400",
                        msg:"数据库错误"
                    })
                }else {
                    res.json({
                        code:"200",
                        data:stre
                    })
                }
               
            })
        }
    })

    // 这里代码存根  -- 获取左边栏目列表
    // return;
    // let stre = [{
    //     name: "列表管理",
    //     childs: [{
    //         names: "管理列表",
    //         router: "userList"
    //     }]
    // }]
    // let sql = `select * from user_list`
    // db.query(sql, (err, data) => {
    //     data.forEach(v => {
    //         let name = v.username;
    //         let obj = {}
    //         obj["name"] = name;
    //         // let id = id;
    //         obj["childs"] = [];
    //         data.forEach(x => {
    //             if (x.username == name) {
    //                 // console.log(x);
    //                 obj["childs"].push({
    //                     id: x.id,
    //                     names: x.childs,
    //                     router: x.router
    //                 })
    //             }
    //         })
    //         stre.push(obj)
    //     });
    //     let newArr = [];
    //     let newName = [];
    //     stre.forEach(v => {
    //         if (newName.indexOf(v.name) == -1) {
    //             newName.push(v.name);
    //             newArr.push(v)
    //         }
    //     })
    //     res.json(newArr)
    // })
})
router.get("/getUserList", (req, res) => {
    let stre = [{
        name: "列表管理",
        childs: [{
            names: "管理列表",
            router: "/userList"
        }]
    }]
    let sql = `select * from user_list`
    db.query(sql, (err, data) => {
        data.forEach(v => {
            let name = v.username;
            let obj = {}
            obj["name"] = name;
            // let id = id;
            obj["childs"] = [];
            data.forEach(x => {
                if (x.username == name) {
                    // console.log(x);
                    obj["childs"].push({
                        id: x.id,
                        names: x.childs,
                        router: x.router
                    })
                }
            })
            stre.push(obj)
        });
        let newArr = [];
        let newName = [];
        stre.forEach(v => {
            if (newName.indexOf(v.name) == -1) {
                newName.push(v.name);
                newArr.push(v)
            }
        })
        res.json(newArr)
    })
})
router.get('/getUserList/:id', (req, res) => {
    let id = req.params.id;
    let sql = `select * from user_list where id = ${id}`;
    db.query(sql, (err, data) => {
        // console.log(data);
        res.json(data[0])
    })
})
router.post("/getUserList", (req, res) => {
    let username = req.body.username;
    let childs = req.body.childs;
    let router = req.body.router;
    let sql = `insert into user_list set ?`;
    db.query(sql, { username, childs, router }, (err, data) => {
        if (err) {
            res.json({
                code: "400",
                msg: '服务器错误'
            })
        } else {
            res.json({
                code: "200",
                msg: '成功'
            })
        }

    })
})
router.put("/getUserList/:id", (req, res) => {
    let id = req.params.id;
    let childs = req.body.childs;
    let sql = `UPDATE   user_list  SET ? WHERE id =?`;
    db.query(sql, [childs, id], (req, res) => {
        if (err) {
            res.json({
                code: "400",
                msg: '服务器错误'
            })
        } else {
            res.json({
                code: "200",
                msg: '成功'
            })
        }
    })
})
router.delete("/getUserList/:id", (req, res) => {
    let sql = `DELETE FROM user_list WHERE id=?`;
    db.query(sql, req.params.id, (err, data) => {
        if (err) {
            res.json({
                code: "400",
                msg: '服务器错误'
            })
        } else {
            res.json({
                code: "200",
                msg: '成功'
            })
        }
    })
})
router.post("/BeLogin", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let sql = `select * from users where username = ? and password = ?`;
    db.query(sql, [username, md5(password + config.key)], (err, data) => {
        if (err) {
            res.json({
                code: "400",
                msg: "服务器错误" + err
            })
            return
        }
        if (data.length == 0) {
            res.json({
                code: "400",
                msg: "登录失败"
            })
            return
        }
        db.query(`select * from user_auth where user_id = ?`,data[0].id,(err,data2)=>{
            if (err) {
                res.json({
                    code: "400",
                    msg: "服务器错误" + err
                })
                return
            }
            if (data.length == 0) {
                res.json({
                    code: "400",
                    msg: "权限不够"
                })
                return
            }
            let token = jsonwebtoken.sign({
                id: data[0].id
            }, config.key, { expiresIn: 60 * 60 * 24 * 30 * 6 })
            res.json({
                code: "200",
                msg: "成功",
                token,
                qxId:data2[0].auth_id
            })
        })
    })
})
module.exports = router;