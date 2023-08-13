const User = require("../../../../models/User");


class UserService {

  async checkUserByEmail(email) {
    const user = await User.findOne({ email });
  
    if (!user) {
      throw { status: 404, message: "유저를 찾을 수 없습니다." };
    }
  
    return user;
  }


  async findUserById(id) {
    const user = await User.findById(id);
  
    if (!user) {
      throw { status: 404, message: "유저를 찾을 수 없습니다." };
    }
    return user;
  }

  async checkCoupleConnect(code) {
    const users = await User.find({ connectCode: code });

    if (!users || users.length === 0) {
      throw { status: 404, message: "연결된 유저를 찾을 수 없습니다." };
    }
  
    return users;
  }
  

  async findUsers({ skip, take }) {
    const users = await User.find({}); // find 메서드에 조건을 지정하지 않음
  
    const count = await User.countDocuments({}); // countDocuments 메서드로 변경
  
    return {
      users,
      count,
    };
  }


  async checkDuplicateConnectCode(connectCode) {
    const count = await User.count({ connectCode });
    return count === 2;
  }
  
  async createUser(props) {
    try {
      const { connectCode } = props;
  
      // 이미 같은 connectCode를 가진 유저가 2명일 경우 예외 처리
      const isDuplicateConnectCode = await this.checkDuplicateConnectCode(connectCode);
      if (isDuplicateConnectCode) {
        throw { status: 404, message: "이미 같은 커플 코드를 가진 유저가 2명이 존재합니다." };
      }
  
      const newUser = new User({
        nickname: props.nickname,
        email: props.email,
        password: props.password,
        phone: props.phone,
        age: props.age,
        bloodType: props.bloodType,
        imageUrl: props.imageUrl,
        starteddate: props.starteddate,
        birthday: props.birthday,
        connectCode: props.connectCode,
      });
  
      const savedUser = await newUser.save();
      return savedUser.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  


  async updateUser(email, props) {
    const user = await User.findOne({ email });
  
    if (!user) {
      throw { status: 404, message: "유저를 찾을 수 없습니다." };
    }
  
    // 비밀번호 업데이트를 원할 경우
    if (props.password) {
      await props.updatePassword(props.password);
    }
  
    user.nickname = props.nickname;
    user.email = props.email;
    user.password = props.password;
    user.phone = props.phone;
    user.age = props.age;
    user.bloodType = props.bloodType;
    user.imageUrl = props.imageUrl;
    user.starteddate = props.starteddate;
    user.birthday = props.birthday;
    user.connectCode = props.connectCode;
  
    await user.save();
  }


  async deleteUser(email) {
    const user = await User.findOne({ email });
  
    if (!user) {
      throw { status: 404, message: "유저를 찾을 수 없습니다." };
    }
  
    await user.deleteOne();
  }

  async deleteCouple(connectCode) {
    try {
      // 커플 정보를 가져옵니다.
      const couple = await User.find({ connectCode: connectCode });
      if (!couple || couple.length < 2) {
        throw { status: 404, message: "커플을 찾을 수 없거나 커플의 구성원이 2명 미만입니다." };
      }
  
      // 커플의 첫 번째 구성원(user1)의 `connectCode`를 `null`로 업데이트합니다.
      await User.findByIdAndUpdate(couple[0]._id, { $set: { connectCode: null } });
  
      // 커플의 두 번째 구성원(user2)의 `connectCode`를 `null`로 업데이트합니다.
      await User.findByIdAndUpdate(couple[1]._id, { $set: { connectCode: null } });
  
    } catch (err) {
      throw err;
    }
  }
  
  
  
  
  
  


}

module.exports = UserService;