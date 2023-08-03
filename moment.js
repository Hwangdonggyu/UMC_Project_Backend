const moment = require('moment-timezone');

module.exports = () => {
    return moment.tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
}