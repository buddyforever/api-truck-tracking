var express = require("express");
var router = express.Router();

var db = require("../db");

router.get("/getLoginLogs/:cid/:uid", (req, res) => {
  var companyId = req.params.cid;
  var userId = req.params.uid;
  var query =
    "SELECT l.*, u.firstname, u.lastname FROM users_login l JOIN users u ON u.id=l.userId" +
    (userId != 1
      ? " WHERE u.id=" + userId
      : " WHERE u.companyId=" + companyId + " AND u.id!=1") +
    " ORDER BY l.login_at DESC LIMIT 5";
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    res.send({ status: 200, result: results });
  });
});
router.get("/getYearlyLoss/:cid", (req, res) => {
  var companyId = req.params.cid;
  var query = "";
  if (companyId == 1)
    query =
      "SELECT YEAR(finishUnloadingAt) as year, SUM(netWeight-newNetWeight) as netLoss FROM deals WHERE companyId=1 AND status=4 GROUP BY YEAR(finishUnloadingAt)";
  if (companyId == 2)
    query =
      "SELECT YEAR(finishUnloadingAt) as year, SUM(quantity-newQuantity) as netLoss FROM deals WHERE companyId=2 AND status=4 GROUP BY YEAR(finishUnloadingAt)";
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    res.send({
      status: 200,
      result: results,
    });
  });
});
router.get("/getSupplierNetLoss/:cid", (req, res) => {
  var companyId = req.params.cid;
  var query = "";
  if (companyId == 1)
    query =
      "SELECT t.transporter as supplier, SUM(d.netWeight-d.newNetWeight) as netLoss FROM deals d JOIN transporters t ON d.transporterId=t.id WHERE d.status=4 AND d.companyId=1 GROUP BY t.id";
  if (companyId == 2)
    query =
      "SELECT t.transporter as supplier, SUM(d.quantity-d.newQuantity) as netLoss FROM deals d JOIN transporters t ON d.transporterId=t.id WHERE d.status=4 AND d.companyId=2 GROUP BY t.id";
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    res.send({
      status: 200,
      result: results,
    });
  });
});
router.get("/getSupplierAvgDeliveryTime/:cid", (req, res) => {
  var companyId = req.params.cid;
  var query =
    "SELECT t.transporter as supplier, AVG(TIMESTAMPDIFF(SECOND, d.finishLoadingAt, d.startUnloadingAt)) as avgDeliveryTime FROM deals d JOIN transporters t ON d.transporterId=t.id WHERE d.status>=3 AND d.companyId=" +
    companyId +
    " GROUP BY t.id";
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    res.send({
      status: 200,
      result: results,
    });
  });
});
router.get("/getDailyNumTrucks/:cid", (req, res) => {
  var companyId = req.params.cid;
  var now = new Date();
  var date =
    now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
  var query =
    "SELECT COUNT(*) as numTotalTrucks FROM deals WHERE DATE(startLoadingAt)='" +
    date +
    "' AND companyId=" +
    companyId +
    " GROUP BY DATE(startLoadingAt)";
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0)
      res.send({
        status: 200,
        result: results,
      });
    else res.send({ status: 404 });
  });
});
router.get("/getDailyDeliveryTime/:cid", (req, res) => {
  var companyId = req.params.cid;
  var now = new Date();
  var date =
    now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
  var query =
    "SELECT SUM(TIMESTAMPDIFF(SECOND, finishLoadingAt, startUnloadingAt)) as deliveryTime, COUNT(*) as numTrucks FROM deals WHERE DATE(startUnloadingAt)='" +
    date +
    "' AND status>=3 AND companyId=" +
    companyId +
    " GROUP BY DATE(startUnloadingAt)";
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0)
      res.send({
        status: 200,
        result: results,
      });
    else res.send({ status: 404 });
  });
});
router.get("/getDailyLoss/:cid", (req, res) => {
  var companyId = req.params.cid;
  var now = new Date();
  var date =
    now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
  var query = "";
  if (companyId == 1)
    query =
      "SELECT SUM(netWeight-newNetWeight) as loss, COUNT(*) as numTrucks FROM deals WHERE DATE(startUnloadingAt)='" +
      date +
      "' AND status=4 AND companyId=1 GROUP BY DATE(startUnloadingAt)";
  else if (companyId == 2)
    query =
      "SELECT SUM(quantity-newQuantity) as loss, COUNT(*) as numTrucks FROM deals WHERE DATE(startUnloadingAt)='" +
      date +
      "' AND status=4 AND companyId=2 GROUP BY DATE(startUnloadingAt)";
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0)
      res.send({
        status: 200,
        result: results,
      });
    else res.send({ status: 404 });
  });
});
router.get("/getDailyTotal/:cid", (req, res) => {
  var companyId = req.params.cid;
  var now = new Date();
  var date =
    now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
  var query = "";
  if (companyId == 1)
    query =
      "SELECT SUM(newNetWeight) as unloadedAmount, COUNT(*) as numTrucks FROM deals WHERE DATE(startUnloadingAt)='" +
      date +
      "' AND status=4 AND companyId=1 GROUP BY DATE(startUnloadingAt)";
  else if (companyId == 2)
    query =
      "SELECT SUM(newQuantity) as unloadedAmount, COUNT(*) as numTrucks FROM deals WHERE DATE(startUnloadingAt)='" +
      date +
      "' AND status=4 AND companyId=2 GROUP BY DATE(startUnloadingAt)";
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0)
      res.send({
        status: 200,
        result: results,
      });
    else res.send({ status: 404 });
  });
});

router.get("/getDailyTotalLoadingUnloadingTime/:cid", (req, res) => {
  var companyId = req.params.cid;
  var query =
    "SELECT DATE(finishUnloadingAt) as date, SUM(TIMESTAMPDIFF(SECOND, startLoadingAt, finishLoadingAt)) as loading_time, SUM(TIMESTAMPDIFF(SECOND, startUnloadingAt, finishUnloadingAt)) as unloading_time FROM deals WHERE status=4 AND companyId=" +
    companyId +
    " GROUP BY DATE(finishUnloadingAt)";
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0)
      res.send({
        status: 200,
        result: results,
      });
    else res.send({ status: 404 });
  });
});
router.get("/getMonthlyTotalVsLoss/:cid", (req, res) => {
  var companyId = req.params.cid;
  var year = new Date().getFullYear();
  var query = "";
  if (companyId == 1)
    query =
      "SELECT MONTH(startUnloadingAt) as month, SUM(newNetWeight) as total, SUM(netWeight-newNetWeight) as netLoss FROM deals WHERE YEAR(startUnloadingAt)=" +
      year +
      " AND status=4 AND companyId=1 GROUP BY MONTH(startUnloadingAt)";
  if (companyId == 2)
    query =
      "SELECT MONTH(startUnloadingAt) as month, SUM(newQuantity) as total, SUM(quantity-newQuantity) as netLoss FROM deals WHERE YEAR(startUnloadingAt)=" +
      year +
      " AND status=4 AND companyId=2 GROUP BY MONTH(startUnloadingAt)";

  db.query(query, function (error, results, fields) {
    if (error) throw error;
    res.send({
      status: 200,
      result: results,
    });
  });
});
module.exports = router;
