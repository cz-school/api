const express = require("express")
const router = express.Router()
router.get("/", (req, res) => {
    // res.send("aaa123-------------sdas+++++++++++")
    res.json({
        code:"222",
        masg:"dsa"
    })
})
module.exports = router;