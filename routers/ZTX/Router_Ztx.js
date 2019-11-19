const express = require("express")
const router = express.Router()
const db = require("../../db")
const config = require("../../config")
const md5 = require("md5")
const jsonwebtoken = require('jsonwebtoken')
router.get("/getUserList", (req, res) => {
    let stre = [{
        name: "列表管理",
        childs: [{
            names: "管理列表",
            router: "/userList"
        }]
    }]
    let sql = `select * from user_list ORDER BY username`
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
router.get('/getUserLists', (req, res) => {
    let sql = `select * from user_list`;
    db.query(sql, (er, data) => {
        res.json(data)
    })
})
router.post("/login", (req, res) => {
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
        let token = jsonwebtoken.sign({
            id: data[0].id        
        }, config.key, { expiresIn: 60 * 60 * 24 * 30 * 6 })
        res.json({
            code: "200",
            msg: "成功",
            token
        })
    })
})
module.exports = router;