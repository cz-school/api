const express = require("express")
const router = express.Router()
const db = require("../../db")
// 查询广场
router.get("/plaza", (req, res) => {
    let sql = `select 
    u.id user_id,u.username,u.head_img,
    a.id plazaUser_id,a.add_time,a.content,
    b.plaza_img,
    a.IsSolook,
    (select count(*) from plazalike f where f.plaza_id=a.id) likefill 
    from plaza a, plazaimg b, users u 
    where  u.id = a.Me_id and b.plaza_id = a.id`
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        data.forEach(v => {
            v.plaza_img = v.plaza_img.split(",")
        });

        res.json({
            'code': 200,
            'data': data
        })
    })
})

// 根据广场帖子id查询广场详情
router.get(`/plaza_details/:plaza_id`, (req, res) => {
    let id = req.params.plaza_id
    // console.log(id)
    let sql = `select  distinct
    u.id user_id,u.username,u.head_img,
    a.id plazaUser_id,a.add_time,a.content,
    b.plaza_img,
    (select count(*) from plazalike f where f.plaza_id=a.id) likefill 
    from plaza a, plazaimg b, users u 
    where u.id = a.Me_id and b.plaza_id = a.id HAVING plazaUser_id=?`
    db.query(sql, id, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        // data[0].plaza_img = JSON.parse(data[0].plaza_img)
        // console
        data.forEach(v => {
            v.plaza_img = v.plaza_img.split(",")
        });
        res.json({
            'code': 200,
            'data': data
        })

    })
})


// 根据广场帖子id获取评论
router.get('/getSpeak', (req, res) => {
    let id = req.query.id
    // console.log(id)
    let sql = `select * from plazareview where plaza_id = ?`
    db.query(sql, id, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        // console.log(data)
        let info = {
            idArr: [],
            data: []
        }
        data.forEach(v => {
            info.idArr.push(v.commont_id)
            info.data.push(v)
        })
        // console.log(info)
        sql = `select id,username,head_img from users where id in (?)`
        db.query(sql, [info.idArr], (err, data) => {
            if (err) {
                console.log(err)
                return
            }
            // console.log(data)
            info.data.forEach((v, i) => {
                v.isClick = false
                data.forEach(v1 => {
                    if (v.commont_id == v1.id) {
                        v.username = v1.username
                        v.head_img = v1.head_img
                    }
                })
            })

            res.json(info.data)
        })
    })
})

// 添加评论
router.post('/addSpeak', (req, res) => {
    let info = req.body
    // console.log(info)
    let sql = `insert into plazareview values(?,?,?,?,?,?)`
    db.query(sql, [null, info.plaza_id, info.commont_id, info.message, info.beCommont_id, info.plaza_time], (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        // console.log(data)
    })
})

// 发表帖子
router.post('/addPlaza', (req, res) => {
    let info = req.body
    // plaza表
    let plaza = {
        content: info.textareaAValue,
        IsSolook: info.radio,
        add_time: info.time,
        me_id: info.user_id
    }
    // console.log(plaza)
    let sql = `insert into plaza set ?`
    let sql1 = `insert into plazaimg set ?`
    db.query(sql, plaza, (err, data) => {
        if (err) {
            console.log(err)
            return
        } else {
            let image = {
                plaza_img: info.basic,
                plaza_id: data.insertId
            }
            db.query(sql1, image, (err, data1) => {
                if (err) {
                    console.log(err)
                    return
                }
                // console.log(data1)
            })
        }
    })
})


// 根据用户id查询所有动态
router.get('/plaza_fill/:id', (req, res) => {
    let id = req.params.id
    console.log(id)
    let sql = `select
    u.id user_id,u.username,u.head_img,
    a.me_id plazaUser_id,a.add_time,a.content,
    b.plaza_img,
    (select count(*) from plazalike f where f.plaza_id=a.id) likefill 
    from plaza a, plazaimg b, users u 
    where u.id = a.Me_id and b.plaza_id = a.id HAVING plazaUser_id=?`
    db.query(sql, id, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        data.forEach(v => {
            v.plaza_img = v.plaza_img.split(",")
        });
        res.json({
            'code': 200,
            'data': data
        })
        console.log(data)

    })
})


module.exports = router;