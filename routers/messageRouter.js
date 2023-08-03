const controller = require('./controller');

// Create: 메시지 저장
app.post('/message', controller.saveMessage);

// Read: 특정 메시지 읽어오기(ID를 경로 파라미터로 받음)
app.get('/message/:id', controller.getMessage);

// Delete: 특정 메시지 삭제 (ID를 경로 파라미터로 받음)
app.delete('/message/:id', controller.deleteMessage);

app.use(controller.errorHandler);
