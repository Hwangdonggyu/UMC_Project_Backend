class UsersDTO {
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
      this.nickname = user.nickname;
      this.email = user.email;
      this.password = user.password;
      this.phone = user.phone;
      this.age = user.age;
      this.bloodType = user.bloodType;
      this.imageUrl = user.imageUrl;
      this.started_date = user.started_date;
      this.birthday = user.birthday;
      this.connectCode = user.connectCode;
    }
  }

module.exports = {UsersDTO};