var cron1 = require("node-cron");
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
  let email_content =
    "<h2>Here are the trucks which are still on route and exceed the alert time.</h2>";
  email_content += "<table style='width: 100%; border: 1px solid black'>";
  email_content += "<tr style='border: 1px solid black'>";
  email_content += "<th style='border: 1px solid black'>Transport</th>";
  email_content += "<th style='border: 1px solid black'>Driver</th>";
  email_content += "<th style='border: 1px solid black'>Driver Phone</th>";
  email_content += "<th style='border: 1px solid black'>Truck Plate</th>";
  email_content += "<th style='border: 1px solid black'>Product</th>";
  email_content += "<th style='border: 1px solid black'>Start Loading At</th>";
  email_content += "<th style='border: 1px solid black'>Finish Loading At</th>";
  email_content += "<th style='border: 1px solid black'>Alert Time</th>";
  email_content += "</tr>";
  for (let i = 0; i < trucks.length; i++) {
    let truck = trucks[i];
    email_content +=
      "<tr style='border: 1px solid black'>" +
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
      truck.truckPlate +
      "</td>" +
      "<td style='border: 1px solid black' align='center'>" +
      truck.productName +
      "</td>" +
      "<td style='border: 1px solid black' align='center'>" +
      formatDateTime(truck.startLoadingAt) +
      "</td>" +
      "<td style='border: 1px solid black' align='center'>" +
      formatDateTime(truck.finishLoadingAt) +
      "</td>" +
      "<td style='border: 1px solid black' align='center'>" +
      truck.alertTime / 60 +
      " hr" +
      "</td>" +
      "</tr>";
  }
  email_content += "</table>";
  var mailOptions = {
    from: process.env.SUPPORT_EMAIL_USER,
    to: [
      //process.env.ADMIN_EMAIL_USER,
      "buddyforever.dev@gmail.com",
    ],
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

function getLateTrucks() {
  return new Promise((resolve, reject) => {
    let today = new Date();
    let nowDate =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    let now =
      nowDate +
      " " +
      today.getHours() +
      ":" +
      today.getMinutes() +
      ":" +
      today.getSeconds();
    let query =
      "SELECT d.*, t.*, p.productName, d.id as id FROM deals d JOIN transporters t ON t.id=d.transporterId JOIN products p ON d.productId=p.id WHERE d.status=2 AND DATE_ADD(d.finishLoadingAt, INTERVAL d.alertTime MINUTE) < '" +
      now +
      "' AND DATE(d.finishLoadingAt)='" +
      nowDate +
      "'";
    db.query(query, function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
}

cron1.schedule("* * * * *", async () => {
  console.log("cronjob1 started.....");

  getLateTrucks()
    .then(function (results) {
      let count = results.length;
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
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          let truck = results[i];
          let query =
            "INSERT INTO notifications (userId, notification, type, status, created_at) VALUES (1, 'The truck(" +
            truck.truckPlate +
            ") from " +
            truck.transporter +
            " is still on route and exceed the alert time.', 1, 0, '" +
            now +
            "')";
          db.query(query, function (error, results, fields) {
            if (error) throw error;
          });
        }
        sendMail(results).catch(console.error);
      }
    })
    .catch((e) => {
      throw e;
    });
});

module.exports = cron1;
