class CreateUserDTO {
  // 생각을 해보니 이건 로컬 로그인이 더 적합한거 같다... 로그인이 확정되면 유저를 진행시키자!
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

  module.exports = {CreateUserDTO}