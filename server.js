var express = require("express");
var app = express();
var port = process.env.PORT || 5000;

app.use("/", express.static("./build"));
app.use("/about", express.static("./build"));
app.use("/directory", express.static("./build"));
app.use("/group/:group_id", express.static("./build"));
app.use("/dm/:user_id", express.static("./build"));
app.use("/callback", express.static("./build"));
app.use("/logout", express.static("./build"));
app.use((req, res, next) => {
    res.redirect("/");
});
app.listen(port, () => {
    console.log("Listening on port " + port);
});

exports = module.exports = app;