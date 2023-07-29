const database = require("../../../database");

class UserService {
  // findById, findMany, create, update, delete

  async checkUserByEmail(email) {
    const user = await database.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return false;

    return user;
  }

  async findUserById(id) {
    const user = await database.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw { status: 404, message: "유저를 찾을 수 없습니다." };
    return user;
  }

  async findUsers({ skip, take }) {
    const users = await database.user.findMany({
      where: {},
      skip,
      take, // pagination이지만 지워도 무방?
    });

    const count = await database.user.count();

    return {
      users,
      count,
    };
  }

  async createUser(props) {
    const newUser = await database.user.create({
      data: {
        nickname : props.nickname,
        email : props.email,
        password : props.password,
        phone : props.phone,
        age : props.age,
        bloodType : props.bloodType,
        imageUrl : props.imageUrl,
        started_date : props.started_date,
        birthday : props.birthday,
        connectCode : props.connectCode// 커플 연결 코드
      },
    });

    return newUser.id;
  }

  async updateUser(id, props) {
    const isExist = await database.user.findUnique({
      where: {
        id,
      },
    });

    if (!isExist) throw { status: 404, message: "유저를 찾을 수 없습니다." };
    // if (props.password) {
    //   await props.updatePassword();
    // }

    await database.user.update({
      where: {
        id: isExist.id,
      },
      data: {
        nickname : props.nickname,
        email : props.email,
        password : props.password,
        phone : props.phone,
        age : props.age,
        bloodType : props.bloodType,
        imageUrl : props.imageUrl,
        started_date : props.started_date,
        birthday : props.birthday,
        connectCode : props.connectCode// 커플 연결 코드
      },
    });
  }

  async deleteUser(id) {
    const isExist = await database.user.findUnique({
      where: {
        id,
      },
    });

    if (!isExist) throw { status: 404, message: "유저를 찾을 수 없습니다." };

    await database.user.delete({
      where: {
        id: isExist.id,
      },
    });
  }
}

module.exports = UserService;