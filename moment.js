const moment = require('moment-timezone');
const date = moment.tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");

module.exports = date;