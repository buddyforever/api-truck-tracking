var cron = require("node-cron");
let nodemailer = require("nodemailer");
var db = require("./db");

async function sendMail(trucks) {
  console.log("sending email....");
  let email_content = "<h1>Here are the trucks which arrived late today</h1>";
  for (let i = 0; i < trucks.length; i++) {
    let truck = trucks[i];
    email_content +=
      "<p>" +
      "The truck(" +
      truck.truckPlate +
      ") from " +
      truck.transporter +
      " arrived " +
      getLateTime(truck) +
      " late." +
      "</p><br/>";
  }
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

function getLateTime(truck) {
  let days = truck.late_days;
  let hours = truck.late_hours - 24 * truck.late_days;
  let minutes = truck.late_minutes - 60 * truck.late_hours;
  let seconds = truck.late_seconds - 60 * truck.late_minutes;
  let result = "";
  if (days) {
    result += days > 1 ? days + " days " : days + " day ";
  }
  if (hours) {
    result += hours > 1 ? hours + " hours " : hours + " hour ";
  }
  if (minutes) {
    result += minutes > 1 ? minutes + " minutes " : minutes + " minute ";
  }
  return result;
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
    let query =
      "SELECT d.*, t.*, d.id as id, TIMESTAMPDIFF(DAY, DATE_ADD(d.finishLoadingAt, INTERVAL d.alertTime MINUTE), d.startUnloadingAt) AS late_days, TIMESTAMPDIFF(HOUR, DATE_ADD(d.finishLoadingAt, INTERVAL d.alertTime MINUTE), d.startUnloadingAt) AS late_hours, TIMESTAMPDIFF(MINUTE, DATE_ADD(d.finishLoadingAt, INTERVAL d.alertTime MINUTE), d.startUnloadingAt) AS late_minutes, TIMESTAMPDIFF(SECOND, DATE_ADD(d.finishLoadingAt, INTERVAL d.alertTime MINUTE), d.startUnloadingAt) AS late_seconds FROM deals d JOIN transporters t ON t.id=d.transporterId WHERE d.status>=3 AND DATE_ADD(d.finishLoadingAt, INTERVAL d.alertTime MINUTE) < d.startUnloadingAt AND DATE(d.startUnloadingAt)='" +
      nowDate +
      "'";
    db.query(query, function (error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
}

cron.schedule("0 22 * * *", async () => {
  console.log("cronjob started.....");

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
            " arrived " +
            getLateTime(truck) +
            " late.', 1, 0, '" +
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

module.exports = cron;
