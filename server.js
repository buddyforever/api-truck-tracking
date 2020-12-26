var express = require("express"); // call express
var app = express(); // define our app using express
var bodyParser = require("body-parser");
var cors = require("cors");

var job = require("./cronjob");

var authRouter = require("./routes/auth");
var usersRouter = require("./routes/users");
var companiesRouter = require("./routes/companies");
var dealsRouter = require("./routes/deals");
var transportersRouter = require("./routes/transporters");
var reportRouter = require("./routes/report");

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.use(function (req, res, next) {
  //set headers to allow cross origin request.
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var port = process.env.PORT || 8080; // set our port

//cronjob s tart
//job.start();

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/companies", companiesRouter);
app.use("/api/deals", dealsRouter);
app.use("/api/transporters", transportersRouter);
app.use("/api/report", reportRouter);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log("Magic happens on port " + port);
