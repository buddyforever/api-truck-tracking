var express = require("express");
var router = express.Router();

var db = require("../db");

router.get("/get", (req, res) => {
  //   var companyId = req.body.companyId;
  //   console.log(req.body);
  var query =
    "SELECT *, DATE_FORMAT(startDateTime, '%Y-%m-%d %H:%i:%s') as startDateTime, DATE_FORMAT(finishDateTime, '%Y-%m-%d %H:%i:%s') as finishDateTime FROM deals";
  //if (companyId != 0) query = query + " WHERE deals.companyId=" + companyId;
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0) res.send({ status: 200, result: results });
    else res.send({ status: 404 });
  });
});
router.get("/get/:id", (req, res) => {
  //   var companyId = req.body.companyId;
  //   console.log(req.body);
  var dealId = req.params.id;
  var query =
    "SELECT *, DATE_FORMAT(startDateTime, '%Y-%m-%d %H:%i:%s') as startDateTime, DATE_FORMAT(finishDateTime, '%Y-%m-%d %H:%i:%s') as finishDateTime FROM deals WHERE id=" +
    dealId;
  //if (companyId != 0) query = query + " WHERE deals.companyId=" + companyId;
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0) res.send({ status: 200, result: results });
    else res.send({ status: 404 });
  });
});
router.post("/add", (req, res) => {
  var deal = {
    userId: req.body.userId,
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
    startDateTime: req.body.startDateTime,
    borderNumber: req.body.borderNumber,
    receiptNumber: req.body.receiptNumber,
    description: req.body.description,
    newDescription: req.body.newDescription,
    status: 1,
  };
  var query =
    "INSERT INTO deals (companyId, driverName, driverPhone, truckPlate, trailerPlate, secondPlate, transporterId, firstWeight, secondWeight, netWeight, newNetWeight, quantity, newQuantity, alertTime, startDateTime, borderNumber, receiptNumber, description, newDescription, status) VALUES (" +
    deal.companyId +
    ", '" +
    deal.driverName +
    "', '" +
    deal.driverPhone +
    "', '" +
    deal.truckPlate +
    "', '" +
    deal.trailerPlate +
    "', '" +
    deal.secondPlate +
    "', " +
    deal.transporterId +
    ", '" +
    deal.firstWeight +
    "', '" +
    deal.secondWeight +
    "', '" +
    deal.netWeight +
    "', '" +
    deal.newNetWeight +
    "', '" +
    deal.quantity +
    "', '" +
    deal.newQuantity +
    "', '" +
    deal.alertTime +
    "', '" +
    deal.startDateTime +
    "', '" +
    deal.borderNumber +
    "', '" +
    deal.receiptNumber +
    "', '" +
    deal.description +
    "', '" +
    deal.newDescription +
    "', " +
    deal.status +
    ")";
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    var insertId = results.insertId;
    if (deal.companyId == 1)
      query =
        "INSERT INTO submit_logs (userId, dealId, amount, dealStatus, submitDateTime) VALUES (" +
        deal.userId +
        ", " +
        insertId +
        ", " +
        deal.netWeight +
        ", 1, '" +
        deal.startDateTime +
        "')";
    else if (deal.companyId == 2)
      query =
        "INSERT INTO submit_logs (userId, dealId, quantity, dealStatus, submitDateTime) VALUES (" +
        deal.userId +
        ", " +
        insertId +
        ", " +
        deal.quantity +
        ", 1, '" +
        deal.startDateTime +
        "')";
    db.query(query, function (error, results, fields) {
      if (error) throw error;
    });
    db.query(
      "SELECT *, DATE_FORMAT(startDateTime, '%Y-%m-%d %H:%i:%s') as startDateTime, DATE_FORMAT(finishDateTime, '%Y-%m-%d %H:%i:%s') as finishDateTime FROM deals",
      function (error, results, fields) {
        if (error) throw error;
        res.send({ status: 200, result: results });
      }
    );
  });
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
  var deal = {
    id: req.body.id,
    userId: req.body.userId,
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
    status: req.body.status,
    submitted: req.body.submitted,
  };
  var query =
    "UPDATE deals SET companyId=" +
    deal.companyId +
    ", driverName='" +
    deal.driverName +
    "', driverPhone='" +
    deal.driverPhone +
    "', truckPlate='" +
    deal.truckPlate +
    "', trailerPlate='" +
    deal.trailerPlate +
    "', secondPlate='" +
    deal.secondPlate +
    "', transporterId=" +
    deal.transporterId +
    ", firstWeight=" +
    deal.firstWeight +
    ", secondWeight=" +
    deal.secondWeight +
    ", netWeight=" +
    deal.netWeight +
    ", newNetWeight=" +
    deal.newNetWeight +
    ", quantity=" +
    deal.quantity +
    ", newQuantity=" +
    deal.newQuantity +
    ", alertTime=" +
    deal.alertTime +
    ", startDateTime='" +
    deal.startDateTime +
    (deal.status != 1 ? "', finishDateTime='" + now : "") +
    "', borderNumber=" +
    deal.borderNumber +
    ", receiptNumber=" +
    deal.receiptNumber +
    ", description='" +
    deal.description +
    "', newDescription='" +
    deal.newDescription +
    "', status=" +
    deal.status + // if finished, change status to 3(on route), else still 2(loading)
    " WHERE id=" +
    deal.id;
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    if (deal.submitted) {
      query = "";
      if (deal.companyId == 1)
        query =
          "INSERT INTO submit_logs (userId, dealId, amount, dealStatus, submitDateTime) VALUES (" +
          deal.userId +
          ", " +
          deal.id +
          ", " +
          deal.netWeight +
          ", " +
          deal.status +
          ", '" +
          now +
          "')";
      else if (deal.companyId == 2)
        query =
          "INSERT INTO submit_logs (userId, dealId, quantity, dealStatus, submitDateTime) VALUES (" +
          deal.userId +
          ", " +
          deal.id +
          ", " +
          deal.quantity +
          ", " +
          deal.status +
          ", '" +
          now +
          "')";
      if (query != "") {
        db.query(query, function (error, results, fields) {
          if (error) throw error;
        });
      }
    }
    db.query(
      "SELECT *, DATE_FORMAT(startDateTime, '%Y-%m-%d %H:%i:%s') as startDateTime, DATE_FORMAT(finishDateTime, '%Y-%m-%d %H:%i:%s') as finishDateTime FROM deals",
      function (error, results, fields) {
        if (error) throw error;
        res.send({ status: 200, result: results });
      }
    );
  });
});
module.exports = router;
