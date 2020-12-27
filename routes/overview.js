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
  var year = new Date().getFullYear();
  var query = "";
  if (companyId == 1)
    query =
      "SELECT YEAR(finishUnloadingAt) as year, SUM(netWeight-newNetWeight) as netLoss FROM deals WHERE companyId=1 AND status=4 AND YEAR(finishUnloadingAt)='" +
      year +
      "' GROUP BY YEAR(finishUnloadingAt)";
  if (companyId == 2)
    query =
      "SELECT YEAR(finishUnloadingAt) as year, SUM(quantity-newQuantity) as netLoss FROM deals WHERE companyId=2 AND status=4 AND YEAR(finishUnloadingAt)='" +
      year +
      "' GROUP BY YEAR(finishUnloadingAt)";
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
      "SELECT t.transporter as supplier, SUM(d.netWeight-d.newNetWeight) as netLoss FROM deals d JOIN transporters t ON d.transporterId=t.id WHERE d.status>=3 AND d.companyId=1 GROUP BY t.id";
  if (companyId == 2)
    query =
      "SELECT t.transporter as supplier, SUM(d.quantity-d.newQuantity) as netLoss FROM deals d JOIN transporters t ON d.transporterId=t.id WHERE d.status>=3 AND d.companyId=2 GROUP BY t.id";
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
module.exports = router;
