const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

class UpdateUserDTO {
  nickname;
  email;
  password;
  phone;
  age;
  bloodType;
  imageUrl;
  started_date;
  birthday;
  connectCode; // 커플 연결 코드

  constructor(user) {
    this.nickname = user.nickname ?? undefined;
    this.email = user.email ?? undefined;
    this.password = user.password ?? undefined;
    this.phone = user.phone ?? undefined;
    this.age= user.age ?? undefined; 
    this.bloodType = user.bloodType ?? undefined;
    this.imageUrl = user.imageUrl ?? undefined;
    this.started_date = user.started_date ?? undefined;
    this.birthday = user.birthday ?? undefined;
    this.connectCode = user.connectCode ?? undefined;
  }

  async updatePassword() {
    this.password = await bcrypt.hash(password, process.env.PASSWORD_SALT);
  }
}

module.exports = {UpdateUserDTO};