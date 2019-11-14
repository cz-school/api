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


app.use(server.prefix, require("./routers/Router_Bjw"));
app.use(server.prefix, require("./routers/Router_Cmx"));
app.use(server.prefix, require("./routers/Router_Gh"));
app.use(server.prefix, require("./routers/Router_Lyf"));
app.use(server.prefix, require("./routers/Router_Swb"));
app.use(server.prefix, require("./routers/Router_Whl"));
app.use(server.prefix, require("./routers/Router_Xkb"));
app.use(server.prefix, require("./routers/Router_Zct"));
app.use(server.prefix, require("./routers/Router_Ztx"));
app.listen(server.port, () => {
    console.log(`Server run in http://127.0.0.1:${server.port}`);
})