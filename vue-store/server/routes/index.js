var express = require('express');
var router = express.Router();
var connection = require('../db/sql');
//引入手机号和密码的查询语句
var user=require('../db/userSql.js');

//引入短信验证码的sdk
var QcloudSms = require("qcloudsms_js");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.r
  ender('index', { title: 'Express' });
});


//修改密码的接口
router.post('/api/recovery',function(req,res,next){
	let params = {
		userTel : req.body.phone,
		userPwd : req.body.pwd
	}
	//查询用户是否存在
	connection.query( user.queryUserTel( params ) ,function(error,results){
		//某一条记录数id
		let id = results[0].id;
		let pwd = results[0].pwd;
		console.log(  `update user set pwd = replace(pwd,${pwd},${params.userPwd}) where id = ${id}` )
		connection.query(`update user set pwd = replace(pwd,'${pwd}','${params.userPwd}') where id = ${id}`,function(err,result){
			res.send({
				code:200,
				data:{
					success:true,
					msg:'修改成功'
				}
			})
		})
	})
})

//查询用户的手机号是否存在
router.post('/api/selectUser',function(req,res,next){
  //前台给后台传递数据手机号
   let params = {
    userTel : req.body.phone,
   
  }
  connection.query( user.queryUserTel( params ) ,function(error,results){  
     if(results.length>0){
      res.send({
        code:200,
        data:{
          success:true
        }
      })
     }else{
      res.send({
        code:0,
        data:{
          success:false,
          msg:'此用户不存在'
        }
      })
     }
  })
}),




//用户注册的接口
router.post('/api/register',function(req,res,next){
	let params = {
		userTel : req.body.phone,
		userPwd : req.body.pwd
	}
	//查询用户是否存在
	connection.query( user.queryUserTel( params ) ,function(error,results){
		if(error) throw error;
		//用户存在
		if( results.length > 0 ){
			res.send({
				code:200,
				data:{
					success:true,
					msg:'注册成功',
					data:results[0]
				}
			})
		}else{
			//不存在，新增一条数据
			connection.query( user.inserData ( params ),function(err,result){
				connection.query( user.queryUserTel( params ) , function(e,r){
					res.send({
						code:200,
						data:{
							success:true,
							msg:'注册成功',
							data:r[0]
						}
					})
				})
			})
		}
	})
}),




//增加用户的接口
//增加一个用户
router.post('/api/addUser',function(req,res,next){
	
	let params = {
		userTel : req.body.phone
	}
	//查询用户是否存在
	connection.query( user.queryUserTel( params ) ,function(error,results){
		if(error) throw error;
		//用户存在
		if( results.length > 0 ){
			res.send({
				code:200,
				data:{
					success:true,
					msg:'登录成功',
					data:results[0]
				}
			})
		}else{
			//不存在，新增一条数据
			connection.query( user.inserData ( params ),function(err,result){
				connection.query( user.queryUserTel( params ) , function(e,r){
					res.send({
						code:200,
						data:{
							success:true,
							msg:'登录成功',
							data:r[0]
						}
					})
				})
			})
		}
	})
})








//发送短信验证码
router.post('/api/code',function(req,res,next){
	
	let tel = req.body.phone;
	
	// 短信应用SDK AppID
	var appid = 1400187558;  // SDK AppID是1400开头
	
	// 短信应用SDK AppKey
	var appkey = "dc9dc3391896235ddc2325685047edc7";
	
	// 需要发送短信的手机号码
	var phoneNumbers = [tel];
	
	// 短信模板ID，需要在短信应用中申请
	var templateId = 285590;  // NOTE: 这里的模板ID`7839`只是一个示例，真实的模板ID需要在短信控制台中申请
	
	// 签名
	var smsSign = "三人行慕课";  // NOTE: 这里的签名只是示例，请使用真实的已申请的签名, 签名参数使用的是`签名内容`，而不是`签名ID`
	
	// 实例化QcloudSms
	var qcloudsms = QcloudSms(appid, appkey);
	
	// 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
	function callback(err, ress, resData) {
	    if (err) {
	        console.log("err: ", err);
	    } else {
			res.send({
				code:200,
				data:{
					success:true,
					data:ress.req.body.params[0]
				}
			})
	    }
	}
	
	var ssender = qcloudsms.SmsSingleSender();
	//这个变量：params 就是往手机上，发送的短信
	var params = [  Math.floor( Math.random()*(9999-1000))+1000   ];
	ssender.sendWithParam(86, phoneNumbers[0], templateId,
	  params, smsSign, "", "", callback);  // 签名参数不能为空串
	
})







//登陆接口
router.post('/api/login',function(req,res,next){
    //这里接收前端传过来的值
    let params={
      userTel:req.body.userTel,
      userPwd:req.body.userPwd,
    };

    //查询用户手机号是否存在,把手机号密码传入userSql.js中定义好的queryUserTel中
    connection.query(user.queryUserTel(params),function(error,results){
      //手机号存在
      if(results.length>0){
        //手机号存在
        connection.query(user.queryUserPwd(params),function(error,results){
          if(results.length>0){
            //手机号密码都对
            res.send({
              code:200,
              data:{
                success:true,
                msg:'登录成功',
                data:results[0],
              }
            })
          }else{
            //密码不对
            res.send({
              code:302,
              data:{
                success:false,
                msg:'密码不正确'
              }
            })
          }
        })

      }else{
            res.send({
              code:301,
              data:{
                success:false,
                msg:'手机号不存在'
              }
            })
      }
    })
})



//点击猜你喜欢模块跳转到详情页的查询商品的id来更新详情页的数据
router.get('/api/goods/id', function (req, res, next){
  let id=req.query.id;
  connection.query('select * from goods_list where id='+id+'',function(error,result){
     if(error) throw error;
     //这里为啥用res.json
     res.json({
      code:0,
      data:result[0],
     })
  })

})


//分类的接口
router.get('/api/goods/list', function (req, res, next) {
  res.send({
    code: 0,
    data: [
      //一级
      {

        id: 0,
        name: '推荐',
        data: [
          //一级
          {

            id: 0,
            name: '推荐',
            list: [
              //三级
              {
                id: 1,
                name: '铁观音',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 2,
                name: '铁观音',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 3,
                name: '铁观音',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 4,
                name: '铁观音',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 5,
                name: '铁观音',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 6,
                name: '铁观音',
                imgUrl: './images/list1.jpeg'
              }

            ]
          },

        ]
      },

      //第二个一级
      {

        id: 1,
        name: '绿茶',
        data: [
          //一级
          {

            id: 0,
            name: '绿茶',
            list: [
              //三级
              {
                id: 1,
                name: '龙井',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 2,
                name: '黄山毛峰',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 3,
                name: '铁观音',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 4,
                name: '雀舌',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 5,
                name: '碧螺春',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 6,
                name: '安吉白茶',
                imgUrl: './images/list1.jpeg'
              }

            ]
          },

        ]
      },

      //第二个一级
      {

        id: 2,
        name: '乌龙',
        data: [
          //一级
          {

            id: 0,
            name: '乌龙',
            list: [
              //三级
              {
                id: 1,
                name: '龙井',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 2,
                name: '黄山毛峰',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 3,
                name: '铁观音',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 4,
                name: '雀舌',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 5,
                name: '碧螺春',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 6,
                name: '安吉白茶',
                imgUrl: './images/list1.jpeg'
              }

            ]
          },

        ]
      },
      {

        id: 3,
        name: '红茶',
        data: [
          //一级
          {

            id: 0,
            name: '红茶',
            list: [
              //三级
              {
                id: 1,
                name: '龙井',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 2,
                name: '黄山毛峰',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 3,
                name: '铁观音',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 4,
                name: '雀舌',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 5,
                name: '碧螺春',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 6,
                name: '安吉白茶',
                imgUrl: './images/list1.jpeg'
              }

            ]
          },

        ]
      },
      {

        id: 4,
        name: '毛峰',
        data: [
          //一级
          {

            id: 0,
            name: '毛峰',
            list: [
              //三级
              {
                id: 1,
                name: '龙井',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 2,
                name: '黄山毛峰',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 3,
                name: '铁观音',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 4,
                name: '雀舌',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 5,
                name: '碧螺春',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 6,
                name: '安吉白茶',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 7,
                name: '雀舌',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 8,
                name: '碧螺春',
                imgUrl: './images/list1.jpeg'
              },
              {
                id: 9,
                name: '安吉白茶',
                imgUrl: './images/list1.jpeg'
              }

            ]
          },

        ]
      },

    ]

  })
})




//查询搜索列表的数据
router.get('/api/goods/shopList', function (req, res, next) {
  //前端给后端的数据，发送的params参数为什么用query接收
  //下面是ES6的解构赋值。需要去了解。
  //Object.keys是把前面的key值取下来
  //Object.values是把后面的值取下来
  console.log(req.query);   //{ searchName: '红茶', price: 'asc' }
  console.log(Object.keys(req.query)) //[ 'searchName', 'price' ]
  console.log(Object.values(req.query))//[ '红茶', 'asc' ]

  let [searchName, orderName] = Object.keys(req.query);
  let [name, order] = Object.values(req.query);
  console.log(name, orderName, order); //红茶 price asc


  //模糊查询"%' + searchName + '%"'啥符号
  connection.query('select * from goods_list where name like "%' + name + '%" order by ' + orderName + ' ' + order + ' ', function (error, results) {
    /* err是错误信息，result是后台请求的数据 */
    console.log(results)
    res.send({
      code: 0,
      data: results,
    })
  })
})




//首页大红袍的数据
router.get('/api/index_list/1/data01', function (req, res, next) {
  res.send({
    jingxi: 1,
    code: 0,
    data: [
      {
        id: 1,
        type: 'adList',
        data: [
          { id: 1, imgUrl: './images/dhp.jpeg' },
          { id: 2, imgUrl: './images/dhp.jpeg' },
        ],

      },
      {
        id: 2,
        type: 'likeList',
        data: [
          {
            id: 1,
            imgUrl: "./images/like.jpeg",
            name: "茶具套装 红色芝麻毫 12件套",
            price: 399,
          },
          {
            id: 2,
            imgUrl: "./images/like.jpeg",
            name: "茶具套装 红色芝麻毫 12件套",
            price: 399,
          },
          {
            id: 3,
            imgUrl: "./images/like.jpeg",
            name: "茶具套装 红色芝麻毫 12件套",
            price: 399,
          },

        ]
      }

    ],

  })
})

//首页推荐的数据
router.get('/api/index_list/0/data01', function (req, res, next) {
  res.send({
    code: 0,
    data: {
      topBar: [
        { id: 0, label: '推荐' },
        { id: 1, label: '大红袍' },
        { id: 2, label: '铁观音' },
        { id: 3, label: '绿茶' },
        { id: 4, label: '普洱' },
        { id: 5, label: '茶具' },
        { id: 6, label: '花茶' },
      ],
      data: [
        //这是swiper
        {
          id: 0,
          type: 'swiperList',
          data: [
            { id: 0, imgUrl: './images/swiper1.jpeg' },
            { id: 1, imgUrl: './images/swiper2.jpeg' },
            { id: 2, imgUrl: './images/swiper3.jpeg' },

          ]
        },
        //这是icons
        {
          id: 1,
          type: 'iconsList',
          data: [
            {
              id: 1,
              title: "自饮茶",
              imgUrl: "./images/icons1.png",
            },
            {
              id: 2,
              title: "茶具",
              imgUrl: "./images/icons2.png",
            },
            {
              id: 3,
              title: "自饮茶",
              imgUrl: "./images/icons3.png",
            },
            {
              id: 4,
              title: "领福利",
              imgUrl: "./images/icons4.png",
            },
            {
              id: 5,
              title: "官方验证",
              imgUrl: "./images/icons5.png",
            }

          ]
        },
        //爆款推荐
        {
          id: 2,
          type: 'recommendList',
          data: [
            {
              id: 1,
              name: "龙井乳茶",
              content: "鲜美可口",
              price: "68",
              imgUrl: "./images/recommend.jpeg",
            },

            {
              id: 2,
              name: "龙井乳茶",
              content: "鲜美可口",
              price: "68",
              imgUrl: "./images/recommend.jpeg",
            },
            {
              id: 3,
              name: "龙井乳茶",
              content: "鲜美可口",
              price: "68",
              imgUrl: "./images/recommend.jpeg",
            },
            {
              id: 4,
              name: "龙井乳茶",
              content: "鲜美可口",
              price: "68",
              imgUrl: "./images/recommend.jpeg",
            }

          ]
        },
        //首页的猜你喜欢
        {
          id: 3,
          type: 'likeList',
          data: [
            {
              id: 1,
              imgUrl: "./images/goods1.jpg",
              name: "赛事茶-第三届武夷山茶叶交易会暨仙店被杯-优质奖肉桂160g",
              price: 238,
            },
            {
              id: 2,
              imgUrl: "./images/goods2.jpg",
              name: "茶具套装-中式陶瓷茶叶罐 2色可选",
              price: 28,
            },
            {
              id: 3,
              imgUrl: "./images/goods3.jpg",
              name: "绿茶 远致龙井3号 150g 清爽甘醇",
              price: 118,
            },
            {
              id: 4,
              imgUrl: "./images/goods4.jpg",
              name: "明前春茶 绿茶 龙井破春系列80g罐装",
              price:98,
            },
            {
              id: 5,
              imgUrl: "./images/like.jpeg",
              name: "茶具套装 红色芝麻毫 12件套",
              price: 399,
            },
            {
              id: 6,
              imgUrl: "./images/like.jpeg",
              name: "茶具套装 红色芝麻毫 12件套",
              price: 399,
            },
            {
              id: 7,
              imgUrl: "./images/like2.jpeg",
              name: "茶具套装 红色芝麻毫 12件套",
              price: 399,
            },
            {
              id: 8,
              imgUrl: "./images/like3.jpeg",
              name: "茶具套装 红色芝麻毫 12件套",
              price: 399,
            },


          ]
        },

      ]


    }
  })
});


module.exports = router;
