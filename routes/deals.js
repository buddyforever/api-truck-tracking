var express = require("express");
var router = express.Router();

var db = require("../db");

router.get("/get", (req, res) => {
  var query =
    "SELECT *, deals.id as id FROM deals LEFT JOIN transporters ON deals.transporterId=transporters.id";
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0) res.send({ status: 200, result: results });
    else res.send({ status: 404 });
  });
});
router.get("/get/:id", (req, res) => {
  var dealId = req.params.id;
  var query =
    "SELECT *, deals.id as id FROM deals LEFT JOIN transporters ON deals.transporterId=transporters.id WHERE deals.id=" +
    dealId;
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0) res.send({ status: 200, result: results });
    else res.send({ status: 404 });
  });
});
router.post("/add", (req, res) => {
  var dt = new Date();
  var nowDate =
    dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
  var nowTime = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
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
    borderNumber: req.body.borderNumber,
    receiptNumber: req.body.receiptNumber,
    description: req.body.description,
    newDescription: req.body.newDescription,
    startLoadingAt: req.body.startLoadingAt,
    status: 1,
  };
  var query =
    "INSERT INTO deals (companyId, driverName, driverPhone, truckPlate, trailerPlate, secondPlate, transporterId, firstWeight, secondWeight, netWeight, newNetWeight, quantity, newQuantity, alertTime, borderNumber, receiptNumber, description, newDescription, startLoadingAt, status) VALUES (" +
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
    deal.borderNumber +
    "', '" +
    deal.receiptNumber +
    "', '" +
    deal.description +
    "', '" +
    deal.newDescription +
    "', '" +
    deal.startLoadingAt +
    "', " +
    deal.status +
    ")";
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    var insertId = results.insertId;
    query =
      "INSERT INTO submit_logs (userId, dealId, dealStatus, submitDate, submitTime) VALUES (" +
      deal.userId +
      ", " +
      insertId +
      ", 1, '" +
      nowDate +
      "', '" +
      nowTime +
      "')";
    db.query(query, function (error, results, fields) {
      if (error) throw error;
    });
    db.query(
      "SELECT *, deals.id as id FROM deals LEFT JOIN transporters ON deals.transporterId=transporters.id",
      function (error, results, fields) {
        if (error) throw error;
        res.send({ status: 200, result: results });
      }
    );
  });
});
router.post("/update", (req, res) => {
  var dt = new Date();
  var nowDate =
    dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
  var nowTime = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
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
    borderNumber: req.body.borderNumber,
    receiptNumber: req.body.receiptNumber,
    description: req.body.description,
    newDescription: req.body.newDescription,
    startLoadingAt: req.body.startLoadingAt,
    finishLoadingAt: req.body.finishLoadingAt,
    startUnloadingAt: req.body.startUnloadingAt,
    finishUnloadingAt: req.body.finishUnloadingAt,
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
    ", borderNumber=" +
    deal.borderNumber +
    ", receiptNumber=" +
    deal.receiptNumber +
    ", description='" +
    deal.description +
    "', newDescription='" +
    deal.newDescription +
    "', startLoadingAt='" +
    deal.startLoadingAt +
    (deal.finishLoadingAt
      ? "', finishLoadingAt='" + deal.finishLoadingAt
      : "") +
    (deal.startUnloadingAt
      ? "', startUnloadingAt='" + deal.startUnloadingAt
      : "") +
    (deal.finishUnloadingAt
      ? "', finishUnloadingAt='" + deal.finishUnloadingAt
      : "") +
    "', status=" +
    deal.status + // if finished, change status to 3(on route), else still 2(loading)
    " WHERE id=" +
    deal.id;
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    if (results.affectedRows) {
      if (deal.submitted) {
        query =
          "INSERT INTO submit_logs (userId, dealId, dealStatus, submitDate, submitTime) VALUES (" +
          deal.userId +
          ", " +
          deal.id +
          ", " +
          deal.status +
          ", '" +
          nowDate +
          "', '" +
          nowTime +
          "')";
        db.query(query, function (error, results, fields) {
          if (error) throw error;
        });
      }
    }
    db.query(
      "SELECT *, deals.id as id FROM deals LEFT JOIN transporters ON deals.transporterId=transporters.id",
      function (error, results, fields) {
        if (error) throw error;
        res.send({ status: 200, result: results });
      }
    );
  });
});
module.exports = router;
