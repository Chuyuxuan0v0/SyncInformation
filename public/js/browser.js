var socket = io();

$(".myButtonf").on('click', () => {
    //清屏
    $('#message').html(`<p id="cons">
                        
       </p>`);
})
$(".myButtonf1").on('click', () => {

    $('#message').html(`<h5>这里是Chuyuxuan,一个用于网络同步的剪切板，你可以在这里粘贴任何文本，复制到任何能上网的地方。具体使用方法请移步<a href="#">Readme</a></h5><p id="cons">
                        
    </p>`);
})

//点击提交到数据库
$('#submit').on('click', () => {

    var input_value = $('#input').val().trim();
    if (input_value == null || input_value == undefined || input_value == '') {
        alert('请输入要存的消息！');
    }
    else {
        $('#input').val('');
        var times = new Date().toLocaleTimeString();
        var datee = new Date().toLocaleDateString();
        console.log(datee + " " + times);
        socket.emit('datas', {
            date: datee + " " + times,
            message: input_value
        });
    }


});

//将收到的广播信息直接渲染到页面上
socket.on('infos', data => {

    console.log(data.message + data.date)

    $('#cons').prepend(
        `<a class="context">${data.message}</a>
            <br>
            <a class="times">${data.date}</a><br>`
    );


});


//点击一次获取历史记录
$('#getinfo').one('click', () => {
    var a = '点击获取历史记录'

    console.log("获取按钮点下.");
    socket.emit('get_Message', a);

    socket.on('show_Message', datas => {
        var i = 0;
        var length = datas.length;

        //清屏
        $('#message').html(" ");


        //倒叙遍历
        for (length; length > i; length--) {
            console.log(length);
            console.log('>>>>>' + datas[length - 1].message);
            $('#message').append(
                `<a class="context">${datas[length - 1].message}</a>
               <br>
               <a class="times">${datas[length - 1].date}</a><br>`
            );

        }

    });

});
