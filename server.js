const app = require('express')();
const http = require('http').Server(app);//这里必须绑定在http实例上而不是app上
const io = require('socket.io')(http);
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/chats";

// express处理静态资源
// 把public目录设置为静态资源目录
app.use(require('express').static('public'));
//这里是路由，路由到根目录
app.get('/', (req, res) => {
  res.sendFile('/index.html', { root: __dirname }, (err) => {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('链接成功，根目录为：' + __dirname);
    }
  });
});



http.listen(9000, () => {
  console.log('监听端口:9000');
});

var cishu =0;
//全局广播噻
io.on('connection', (socket) => {
  cishu++;
  console.log('浏览器'+cishu +'成功连接到服务器');
  //收到浏览器msg事件发出来的消息
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;

    var dbo = db.db('chats');
    console.log("数据库已连接到！");

    //监听提交按钮
    socket.on('datas', (data) => {


      //这个也是全局渲染的
      io.emit('infos',data);

      dbo.collection("use_info").insertOne(data, (err, res) => {
        if (err)
          throw err;
        console.log('数据插入成功！'+ data.date+data.message);
      });
    });


    socket.on('get_Message', a => {
      console.log(a);
      dbo.collection("use_info").find({}).toArray(function (err, result) { // 返回集合中所有数据
        if (err) throw err;

        var dataString = JSON.stringify(result);
        var dbcontents = JSON.parse(dataString);
       
        socket.emit('show_Message', dbcontents);


      });


    });


  });



});


