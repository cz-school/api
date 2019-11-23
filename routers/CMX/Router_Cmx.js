const express = require("express")
const router = express.Router()
const conn = require('../../db')
const fs = require("fs");
const multer = require('multer')
const upload = multer()
let OSS = require('ali-oss');
const stringRandom = require('string-random');
let client = new OSS({
    // 仓库地域节点
    region: 'oss-cn-beijing',
    //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
    // oss 中 密钥id
    accessKeyId: 'LTAIWRgyQSSukvgN',
    // oss 访问权限代码
    accessKeySecret: 'WCVHiGBQsKmoiIl8Y9DK0NZccT1Gdz',
    //  存储仓库名字
    bucket: 'zhangchaotang',
});
// 获取所有的我的tag标签
router.get('/ourTag/:id(\\d+)', (req, res) => {
    let id = req.params.id
    let sql = `select tag_our_name from self_tag where id=? `
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
// 通过用户id来更新我的标签
router.post('/add_our_tags/:id(\\d+)', (req, res) => {
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
router.post('/add_music_sportstag/:id(\\d+)', (req, res) => {
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
// // 获取所有运动标签
router.get('/our_sports/:id(\\d+)', (req, res) => {
    let id = req.params.id
    let sql = `select tag_sport_name from self_tag where id=? `
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
    let data = JSON.parse(req.body.tags)
    let data1 = []
    data.forEach(v => {
        data1.push(v.tag_name)
    });
    let aa = data1.join(',')
    let id = req.body.id
    let sql = `UPDATE self_tag set tag_sport_name =? where user_id =?`
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
// 通过用户id来更新游戏标签
router.post('/add_games_tag/:id(\\d+)', (req, res) => {
    let data = JSON.parse(req.body.tags)
    let data1 = []
    data.forEach(v => {
        data1.push(v.tag_name)
    });
    let aa = data1.join(',')
    let id = req.body.id
    let sql = `UPDATE self_tag set tag_games_name =? where user_id =?`
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
// 根据用户登录id获取个人用户信息
router.get('/selfInfo/:id(\\d+)', (req, res) => {
    let id = req.params.id
    let sql = `select * from users where id=? `
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
    let data = JSON.parse(req.body.info)
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
// 上传图片
router.post('/upload_phone', upload.single('file'), (req, res) => {
    // 获取名字
    let file_name = req.file.originalname
    // 获取后缀名
    file_name = file_name.replace(/.+\./, "");
    // 生成随机名字
    let randomName = stringRandom(16);
    // 拼接文件名字
    let fileName = randomName + "." + file_name;
    // 创建写入流
    let ws = fs.createWriteStream('./public/uploed/' + fileName);
    // 写入buffer数据
    ws.write(req.file.buffer);
    // 文件写入结束
    ws.end(async function () {
        //     oss仓库地址          要上传文件的地址
        let result = await client.put('/banana/' + fileName, './public/uploed/' + fileName);
        if (result.res.status != 200) {
            res.json({
                code: "400",
                msg: "上传失败"
            })
        } else {
            res.json({
                info: result.url,
                code: 200,
                msg: "上传成功"
            })
        }
    })
})

module.exports = router;