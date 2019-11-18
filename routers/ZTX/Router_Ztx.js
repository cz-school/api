const express = require("express")
const router = express.Router()
const db = require("../../db")
router.get("/getUserList", (req, res) => {
    let stre = []
    let sql = `select id,username,childs from user_list ORDER BY username`
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
                        names: x.childs
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
    let sql = `insert into user_list set ?`;
    db.query(sql, { username, childs }, (err, data) => {
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
module.exports = router;