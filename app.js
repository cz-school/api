const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const fs = require("fs");
// 路由前缀
const { server } = require("./config");

app.use(require("cors")())

app.use(express.static('./public'));


app.use(bodyParser.urlencoded({
    extended: false
}));
// 允许接口 application/json 格式的数据
app.use(bodyParser.json())

app.use(server.prefix, require("./routers/BJW/Router_Bjw"));
app.use(server.prefix, require("./routers/CMX/Router_Cmx"));
app.use(server.prefix, require("./routers/GH/Router_Gh"));
app.use(server.prefix, require("./routers/LYF/Router_Lyf"));
app.use(server.prefix, require("./routers/SWB/Router_Swb"));
app.use(server.prefix, require("./routers/WHL/Router_Whl"));
app.use(server.prefix, require("./routers/XKB/Router_Xkb"));
app.use(server.prefix, require("./routers/ZCT/Router_Zct"));
app.use(server.prefix, require("./routers/ZTX/Router_Ztx"));
app.use(server.prefix, require("./routers/ZCT/Router_xkb"))

// #region 食堂购物车路由
    // 购物车
    app.use(server.prefix, require("./routers/ZCT/myCart_Zct"))
    // 显示订单
    app.use(server.prefix, require("./routers/ZCT/order"))
// #endregion
// 公共部位
app.use(server.prefix, require("./routers/common/index"))
app.listen(server.port, () => {
    console.log(`Server run in http:/127.0.0.1:${server.port}/api/v1`);
})