const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
   cors({
      origin: true,
      credentials: true,
   })
);

const indexRouter = require("./routes/index");
app.use("/api", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
   next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
   // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get("env") === "development" ? err : {};

   // render the error page
   res.status(err.status || 500);
   res.render("error");
});

app.listen(port, () => {
   console.log(`Example app listening at http://localhost:${port}`);
});
