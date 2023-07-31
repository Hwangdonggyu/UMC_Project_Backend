const Message = require('../messageModel');

exports.saveMessage = async function(room, message) {
  const newMessage = new Message({ room, message });
  await newMessage.save();
};

exports.getMessages = async function(room) {
  return await Message.find({ room }).exec();
};
