const express = require('express')
const socket = require('socket.io')
const http = require('http')
const fs = require('fs')
const app = express()
const server = http.createServer(app)
const io = socket(server)
const mongoose = require('mongoose')
const Message = require('./models/message');
const bannedWordRouter = require('./routers/bannedWordRouter');
const messageRouter = require('./routers/messageRouter');
const messageController = require('./controllers/messageController');

// MongoDB
mongoose.connect('mongodb+srv://qkrehdrb0813:ehdfprl77@cluster0.w9mqdtx.mongodb.net/love_keeper', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected to mongodb'))
  .catch(e => console.error(e))

app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))
app.use('/bannedWord', bannedWordRouter);
app.use('/message', messageRouter);

app.use('/uploads/images', express.static('uploads/images'));
app.use('/uploads/audios', express.static('uploads/audios'));

/* Get 방식으로 / 경로에 접속하면 실행 됨 */
app.get('/', function(request, response) {
  fs.readFile('./static/index.html', function(err, data) {
    if(err) {
      response.send('에러')
    } else {
      response.writeHead(200, {'Content-Type':'text/html'})
      response.write(data)
      response.end()
    }
  })
})

io.sockets.on('connection', function(socket) {
  /* 새로운 유저가 접속했을 경우 */
  socket.on('newUser', function(name) {
    console.log(name + ' 님이 접속하였습니다.')
    /* 이름 저장 */
    socket.name = name
  })

  /* 전송한 메시지 받기 */
  socket.on('message', function(data) {
    /* 받은 데이터에 누가 보냈는지 이름을 추가 */
    data.name = socket.name
    console.log(data)

    /* db 저장 */
    messageController.saveMessage(data);

    /* 나 빼고 상대에게 메시지 전송*/
    socket.broadcast.emit('update', data);
  })

  /* 접속 종료 */
  socket.on('disconnect', function() {
    console.log(socket.name + '님이 나가셨습니다.')
  })
})

app.use((req, res) => {
  res.status(404).send('Not found');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke');
});

/* 4500 포트로 listen */
server.listen(4500, function() {
  console.log('서버 실행 중..')
})
