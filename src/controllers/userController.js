const User = require("../models/User");


exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        const count = await User.countDocuments({});
  
        res
          .status(200)
          .json({ users: users, count });
      } catch (err) {
        next(err);
      }
};

exports.getUser = async (req, res, next) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });
        if (!user) {
            throw { status: 404, message: "유저를 찾을 수 없습니다." };
          }
  
        res.status(200).json({ user: user });
      } catch (err) {
        next(err);
      }
}

exports.updateUser = async (req, res, next) => {
    try {
        const { emails } = req.params;
        const user = await User.findOne({ email: emails });
  
        if (!user) {
          throw { status: 404, message: "유저를 찾을 수 없습니다." };
        }

        const {
            nickname,
            email,
            password,
            phone,
            age,
            bloodType,
            imageUrl,
            starteddate,
            birthday,
            connectCode } = req.body;

          
            // 비밀번호 업데이트를 원할 경우
            // if (password) {
            //   await props.updatePassword(props.password);
            // }
          
            user.nickname = nickname?? undefined;
            user.email = email?? undefined;
            user.password = password?? undefined;
            user.phone = phone?? undefined;
            user.age = age?? undefined;
            user.bloodType = bloodType?? undefined;
            user.imageUrl = imageUrl?? undefined;
            user.starteddate = starteddate?? undefined;
            user.birthday = birthday?? undefined;
            user.connectCode = connectCode?? undefined;
          
            await user.save();
  
        res.status(200).json({ message: '유저 정보가 변경되었습니다.' });
      } catch (err) {
        next(err);
      }
}

exports.checkCouple = async(req,res,next) => {
    try{
    const { code } = req.params;
    const users = await User.find({ connectCode: code });

    if (!users || users.length === 0) {
      throw { status: 404, message: "연결된 유저를 찾을 수 없습니다." };
    }

    const userDTOs = users.map((user) => ({
      nickname: user.nickname,
      email: user.email,
      password: user.password,
      phone: user.phone,
      age: user.age,
      bloodType: user.bloodType,
      imageUrl: user.imageUrl,
      starteddate: user.starteddate,
      birthday: user.birthday,
      connectCode: user.connectCode,
    }));
  
    res.status(200).json({ message: '커플이 연결되어있습니다.', users: userDTOs });

}catch(err){
    next(err);
}
}

exports.deleteCouple = async(req,res,next) => {
    try{
        const { connectCode } = req.params;
  
        const couple = await User.find({ connectCode: connectCode });
        if (!couple || couple.length < 2) {
          const error = new Error("커플을 찾을 수 없거나 커플의 구성원이 2명 미만입니다.");
          error.status = 404;
          throw error;
        }
  
      // 커플의 첫 번째 구성원(user1)의 `connectCode`를 `null`로 업데이트합니다.
      await User.findByIdAndUpdate(couple[0]._id, { $set: { connectCode: null } });
  
      // 커플의 두 번째 구성원(user2)의 `connectCode`를 `null`로 업데이트합니다.
      await User.findByIdAndUpdate(couple[1]._id, { $set: { connectCode: null } });
  
  
        res.status(200).json({ message: '커플 연결이 해제되었습니다.'})
      } catch(err){
        next(err);
      }
}
