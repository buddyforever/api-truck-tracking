var cron2 = require("node-cron");
let nodemailer = require("nodemailer");
var db = require("./db");

const padLeft = function (num) {
  return num >= 10 ? num : "0" + num;
};

const formatDateTime = function (timestamp) {
  if (timestamp) {
    var d = new Date(timestamp),
      dformat =
        [d.getFullYear(), padLeft(d.getMonth() + 1), padLeft(d.getDate())].join(
          "-"
        ) +
        " " +
        [
          padLeft(d.getHours()),
          padLeft(d.getMinutes()),
          padLeft(d.getSeconds()),
        ].join(":");
  } else {
    var dformat = "";
  }
  return dformat;
};

async function sendMail(trucks) {
  console.log("sending email....");
  let email_content = "<h2>Here are total trucks summary of today</h2>";
  email_content += "<table style='width: 100%; border: 1px solid black'>";
  email_content += "<tr style='border: 1px solid black'>";
  email_content += "<th style='border: 1px solid black'>Truck#</th>";
  email_content += "<th style='border: 1px solid black'>Supplier</th>";
  email_content += "<th style='border: 1px solid black'>Driver</th>";
  email_content += "<th style='border: 1px solid black'>Driver Phone</th>";
  email_content += "<th style='border: 1px solid black'>Loading</th>";
  email_content += "<th style='border: 1px solid black'>On route</th>";
  email_content += "<th style='border: 1px solid black'>Arrived</th>";
  email_content += "<th style='border: 1px solid black'>Unloading</th>";
  email_content += "</tr>";
  for (let i = 0; i < trucks.length; i++) {
    let truck = trucks[i];
    email_content +=
      "<tr style='border: 1px solid black'>" +
      "<td style='border: 1px solid black' align='center'>" +
      truck.truckPlate +
      "</td>" +
      "<td style='border: 1px solid black' align='center'>" +
      truck.transporter +
      "</td>" +
      "<td style='border: 1px solid black' align='center'>" +
      truck.driverName +
      "</td>" +
      "<td style='border: 1px solid black' align='center'>" +
      truck.driverPhone +
      "</td>" +
      "<td style='border: 1px solid black' align='center'>" +
      (truck.startLoadingAt ? "status_OK" : "NO") +
      "</td>" +
      "<td style='border: 1px solid black' align='center'>" +
      (truck.finishLoadingAt ? "status_OK" : "NO") +
      "</td>" +
      "<td style='border: 1px solid black' align='center'>" +
      (truck.startUnloadingAt ? "status_OK" : "NO") +
      "</td>" +
      "<td style='border: 1px solid black' align='center'>" +
      (truck.finishUnloadingAt ? "status_OK" : "NO") +
      "</td>" +
      "</tr>";
  }
  email_content += "</table>";
  var mailOptions = {
    from: process.env.SUPPORT_EMAIL_USER,
    to: [process.env.ADMIN_EMAIL_USER, "buddyforever.dev@gmail.com"],
    subject: "Daily report",
    html: email_content,
  };

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SUPPORT_EMAIL_USER,
      pass: process.env.SUPPORT_EMAIL_PASS,
    },
  });

  await transporter.sendMail(mailOptions);
}

function getDailyTrucksReport() {
  return new Promise((resolve, reject) => {
    let today = new Date();
    let nowDate =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    let query =
      "SELECT d.*, t.*, p.productName, d.id as id FROM deals d JOIN transporters t ON t.id=d.transporterId JOIN products p ON d.productId=p.id WHERE DATE(d.finishLoadingAt)='" +
      nowDate +
      "'";
    db.query(query, function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
}

cron2.schedule("0 22 * * *", async () => {
  console.log("cronjob2 started.....");

  getDailyTrucksReport()
    .then(function (results) {
      let count = results.length;
      if (count > 0) {
        sendMail(results).catch(console.error);
      }
    })
    .catch((e) => {
      throw e;
    });
});

module.exports = cron2;
