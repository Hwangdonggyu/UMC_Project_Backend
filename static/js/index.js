const socket = io()

//접속 되었을 때
socket.on('connect', function() {
  //이름 입력 받기
  var name = prompt('반갑습니다!', '')

  if(!name) {
    name = '익명'
  }

  // 서버에 새로운 유저가 왔다고 알림
  socket.emit('newUser', name)
})

// 서버로부터 데이터 받으면
socket.on('update', function(data) {
  var chat = document.getElementById('chat')
  var message = document.createElement('div')
  var node = document.createTextNode(`${data.name}: ${data.message}`)
  var className = ''

  // 타입에 따라 적용할 클래스를 다르게 지정
  switch(data.type) {
    case 'message':
      className = 'other'
      break

    case 'connect':
      className = 'connect'
      break

    case 'disconnect':
      className = 'disconnect'
      break
  }

  message.classList.add(className)
  message.appendChild(node)
  chat.appendChild(message)
})
//For image
// function upload(files) {
//   socket.emit("upload", files[0], (status) => {
//     console.log(status);
//   });
// }

// 메세지 전송
function send() {
  // 입력되어있는 데이터 가져오기
  var message = document.getElementById('test').value
  
  // 빈칸으로 변경
  document.getElementById('test').value = ''

  // 내가 전송할 메시지 클라이언트에게 표시
  var chat = document.getElementById('chat')
  var msg = document.createElement('div')
  var node = document.createTextNode(message)
  msg.classList.add('me')
  msg.appendChild(node)
  chat.appendChild(msg)

  // 서버로 이벤트 전달
  socket.emit('message', {type: 'message', message: message})
}
