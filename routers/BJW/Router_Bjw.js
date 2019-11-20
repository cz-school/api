const express = require("express")
const router = express.Router()
const db = require("../../db")
router.get("/plaza", (req, res) => {
    let sql = `select * from plaza a, plazaimg b, plazalike c where a.id = b.plaza_id and a.Me_id = c.Me_id`
    db.query(sql, (err, data) => {
        // console.log(data)
        if (err) {
            res.json({
                'code': 500,
                'error': err
            })
        } else {
            res.json({
                'code': 200,
                'data': data
            })
        }
    })
})
module.exports = router;