const express = require("express")
const router = express.Router()
const conn = require('../../db')

// 根据用户登录id获取个人用户信息
router.get('/self_info/:id(\\d+)', (req, res) => {
    let useId = req.params.id
    // console.log(useId)
    let sql = `select * from users where id= ?`
    conn.query(sql, useId, (error, data) => {
        if (error) {
            res.json({
                ok: 0,
                error: error
            })
        }
        res.json({
            ok: 1,
            data: data[0]
        })
    })
})

// 获取所有的我的tag标签
router.get('/our_tag/:id(\\d+)', (req, res) => {
    let id = req.params.id
    let sql = `select tag_our_name from self_tag where id=?`
    conn.query(sql, id, (error, data) => {
        if (error) {
            res.json({
                ok: 0,
                error: error
            })
            return
        }
        res.json({
            ok: 1,
            data: data[0]
        })
        return
    })
})
// 通过用户id来更新我的标签
router.post('/add_our_tag/:id(\\d+)', (req, res) => {
    let data = JSON.parse(req.body.tags)
    let data1 = []
    data.forEach(v => {
        data1.push(v.tag_name)
    });
    let aa = data1.join(',')

    let id = req.body.id
    let sql = `UPDATE self_tag set tag_our_name =? where user_id =?`
    conn.query(sql, [aa, id], (error, data) => {
        if (error) {
            res.json({
                ok: 0,
                error: error
            })
            return
        }
        res.json({
            ok: 1,
        })
    })
})
// 获取所有运动标签
router.get('/our_sports/:id(\\d+)', (req, res) => {
    let id = req.params.id
    let sql = `select tag_sport_name from self_tag where id=?`
    conn.query(sql, id, (error, data) => {
        if (error) {
            res.json({
                ok: 0,
                error: error
            })
        }
        res.json({
            ok: 1,
            data: data[0]
        })
    })
})
// 通过用户id来更新运动标签
router.post('/add_sports_tag/:id(\\d+)', (req, res) => {
    let data = req.body.tags
    let id = req.body.id
    let sql = `UPDATE self_tag set tag_sport_name =? where user_id =?`
    conn.query(sql, [data, id], (error, data) => {
        console.log(data)
        if (error) {
            res.json({
                ok: 0,
                error: error
            })
            return
        }
        res.json({
            ok: 1,
        })
    })
})
// // 获取所有音乐标签
router.get('/our_music/:id(\\d+)', (req, res) => {
    let id = req.params.id
    let sql = `select tag_music_name from self_tag where id=? `
    conn.query(sql, id, (error, data) => {
        if (error) {
            res.json({
                ok: 0,
                error: error
            })
        }
        res.json({
            ok: 1,
            data: data[0]
        })
    })
})
// 通过用户id来更新音乐标签
router.post('/add_music_tag/:id(\\d+)', (req, res) => {
    let data = JSON.parse(req.body.tags)
    let data1 = []
    data.forEach(v => {
        data1.push(v.tag_name)
    });
    let aa = data1.join(',')

    let id = req.body.id
    let sql = `UPDATE self_tag set tag_music_name =? where user_id =?`
    conn.query(sql, [aa, id], (error, data) => {
        if (error) {
            res.json({
                ok: 0,
                error: error
            })
            return
        }
        res.json({
            ok: 1,
        })
    })
})

// // 获取所有食物标签
router.get('/our_foods/:id(\\d+)', (req, res) => {
    let id = req.params.id
    let sql = `select tag_foods_name from self_tag where id=? `
    conn.query(sql, id, (error, data) => {
        // console.log(data)
        if (error) {
            res.json({
                ok: 0,
                error: error
            })
        }
        res.json({
            ok: 1,
            data: data[0]
        })
    })
})
// 通过用户id来更新食物标签
router.post('/add_foods_tag/:id(\\d+)', (req, res) => {
    let data = JSON.parse(req.body.tags)
    let data1 = []
    data.forEach(v => {
        data1.push(v.tag_name)
    });
    let aa = data1.join(',')
    let id = req.body.id
    let sql = `UPDATE self_tag set tag_foods_name =? where user_id =?`
    conn.query(sql, [aa, id], (error, data) => {
        if (error) {
            res.json({
                ok: 0,
                error: error
            })
            return
        }
        res.json({
            ok: 1,
        })
    })
})
// 获取所有游戏标签
router.get('/our_games/:id(\\d+)', (req, res) => {
    let id = req.params.id
    let sql = `select tag_games_name from self_tag where id =?`
    conn.query(sql, id, (error, data) => {
        if (error) {
            res.json({
                ok: 0,
                error: error
            })
        }
        res.json({
            ok: 1,
            data: data[0]
        })
    })
})
// 通过用户id来更新运动标签
router.get('/our_sports/:id(\\d+)', (req, res) => {
    let id = req.params.id
    let sql = `select tag_sport_name from self_tag where id =?`
    conn.query(sql, id, (error, data) => {
        if (error) {
            res.json({
                ok: 0,
                error: error
            })
        }
        res.json({
            ok: 1,
            data: data[0]
        })
    })
})
// 更新用户更改信息
router.put('/update_info/:id(\\d+)', (req, res) => {
    let id = req.params.id
    let data = req.body.data
    console.log(data)
    let sql = 'update users set `username` =?,`head_img`=?,sex=?,`school`=?,`birthday`=?,sign=? where id=?'
    conn.query(sql, [data.username, data.head_img, data.sex, data.school, data.birthday, data.sign, id], (error, data) => {
        if (error) {
            return res.json({
                ok: 0,
                error: error
            })
        } else {
            res.json({
                ok: 1
            })
        }

    })
})

module.exports = router;