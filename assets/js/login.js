$(function() {

    // 点击“去注册账号”的连接
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击“去登录”的连接
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })


    // 只要导入了jQuery，这里就可以使用：$
    // 同理，只要导入了layui的js文件，这里就可以使用：layui这一对象
    // 从layui中获取form对象
    var form = layui.form

    // 这里的layer是用于后面的弹出层
    var layer = layui.layer

    // layui里规定了form.verify()函数可以自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'
        ],
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val()
            if (pwd != value) {
                return '两次密码不一致！'
            }
        }
    })

    // 监听注册表单的提交事件，调用接口发起注册用户的请求
    $('#form_reg').on('submit', function(e) {
        // 1、阻止默认的提交行为
        e.preventDefault();
        // 2、发起Ajax的Post请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data,
            function(res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功，请登录！')
                    // 成功后自动去登录界面
                $('#link_login').click()
            })
    })

    // 监听登录表单的提交事件，这里为什么不能用on('submit',function),
    // ？？？？？？而是用submit
    // 答：可以用，但submit()是on('submit',function)的简写形式
    $('#form_login').submit(function(e) {
        // 阻止表单默认提交行为
        e.preventDefault()

        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的所有数据用serialize函数,即序列化表单值
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('登陆失败！')
                }
                layer.msg('登陆成功！')

                // ？？？？？token是什么？Token是服务器自动生成的一串字符串，
                // 可以作为客户端向服务端进行请求时的一个通行令牌，在用户第一次登
                // 录后，服务器就会生成一个token令牌并返回给客户端，客户端将此保
                // 存下来，以后再发送请求时只需带上这个令牌向服务器请求数据即可，
                // 无需再次带上用户名和密码
                console.log(res.token)
                    // 将登录成功得到的token字符串保存到本地存储中
                localStorage.setItem('token', res.token)
                    // 登陆成功后跳转到后台主页
                location.href = '/index.html'
            }

        })
    })

})