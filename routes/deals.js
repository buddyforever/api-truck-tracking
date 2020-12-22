var express = require("express");
var router = express.Router();

var db = require("../db");

router.get("/get", (req, res) => {
  db.query(
    "SELECT *, deals.id as id FROM deals JOIN transporters ON users.transporterId=transporters.id",
    function (error, results, fields) {
      if (error) throw error;
      if (results.length > 0) res.send({ status: 200, result: results });
      else res.send({ status: 404 });
    }
  );
});
router.post("/add", (req, res) => {
  var dt = new Date();
  var now =
    dt.getFullYear() +
    "-" +
    (dt.getMonth() + 1) +
    "-" +
    dt.getDate() +
    " " +
    dt.getHours() +
    ":" +
    dt.getMinutes() +
    ":" +
    dt.getSeconds();
  console.log(req.body);
  var deal = {
    companyId: req.body.companyId,
    driverName: req.body.driverName,
    driverPhone: req.body.driverPhone,
    truckPlate: req.body.truckPlate,
    trailerPlate: req.body.trailerPlate,
    secondPlate: req.body.secondPlate,
    transporterId: req.body.transporterId,
    firstWeight: req.body.firstWeight,
    secondWeight: req.body.secondWeight,
    netWeight: req.body.netWeight,
    newNetWeight: req.body.newNetWeight,
    quantity: req.body.quantity,
    newQuantity: req.body.newQuantity,
    alertTime: req.body.alertTime,
    startDateTime: now,
    borderNumber: req.body.borderNumber,
    receiptNumber: req.body.receiptNumber,
    description: req.body.description,
    newDescription: req.body.newDescription,
    status: 1,
  };
  console.log(deal);
  //   var query =
  //     "INSERT INTO users (firstname, lastname, email, phone, password, companyId, type, status, created_at) VALUES ('" +
  //     user.firstname +
  //     "', '" +
  //     user.lastname +
  //     "', '" +
  //     user.email +
  //     "', '" +
  //     user.phone +
  //     "', '" +
  //     user.password +
  //     "', '" +
  //     user.companyId +
  //     "', '" +
  //     user.type +
  //     "', '" +
  //     user.status +
  //     "', '" +
  //     user.created_at +
  //     "')";
  //   con.query(query, function (error, results, fields) {
  //     if (error) throw error;
  //     con.query(
  //       "SELECT *, users.id as id FROM users JOIN companies ON users.companyId=companies.id",
  //       function (error, results, fields) {
  //         if (error) throw error;
  //         res.send({ status: 200, result: results });
  //       }
  //     );
  //   });
});
router.post("/update", (req, res) => {
  var dt = new Date();
  var now =
    dt.getFullYear() +
    "-" +
    (dt.getMonth() + 1) +
    "-" +
    dt.getDate() +
    " " +
    dt.getHours() +
    ":" +
    dt.getMinutes() +
    ":" +
    dt.getSeconds();
  var user = {
    id: req.body.id,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
    companyId: req.body.companyId,
    type: req.body.type,
    status: req.body.status,
    password: req.body.password,
  };
  var query =
    "UPDATE users SET firstname='" +
    user.firstname +
    "', lastname='" +
    user.lastname +
    "', email='" +
    user.email +
    "', phone='" +
    user.phone +
    "', password='" +
    user.password +
    "', companyId=" +
    user.companyId +
    ", type=" +
    user.type +
    ", status=" +
    user.status +
    ", updated_at='" +
    now +
    "' WHERE id=" +
    user.id;
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    db.query(
      "SELECT *, users.id as id FROM users JOIN companies ON users.companyId=companies.id",
      function (error, results, fields) {
        if (error) throw error;
        res.send({ status: 200, result: results });
      }
    );
  });
});
router.post("/delete/:id", (req, res) => {
  var userId = req.params.id;
  console.log(userId);
  var query = "DELETE FROM users WHERE id=" + userId;
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    db.query(
      "SELECT *, users.id as id FROM users JOIN companies ON users.companyId=companies.id",
      function (error, results, fields) {
        if (error) throw error;
        res.send({ status: 200, result: results });
      }
    );
  });
});
router.get("/:id", (req, res) => {
  var userId = req.params.id;
  var query =
    "SELECT *, users.id as id FROM users JOIN companies ON users.companyId=companies.id WHERE users.id=" +
    userId;
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    res.send({ status: 200, result: results });
  });
});
module.exports = router;
