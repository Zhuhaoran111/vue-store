var express = require('express');
var router = express.Router();
var connection = require('../db/sql');
//引入手机号和密码的查询语句
var user=require('../db/userSql.js');

//引入短信验证码的sdk
var QcloudSms = require("qcloudsms_js");
        //引入token包
let jwt=require('jsonwebtoken');

//引入支付宝配置文件
const alipaySdk=require('../db/alipay.js')
const AlipayFormData=require('alipay-sdk/lib/form').default;
//引入axios
const axios= require('axios')

function getTimeToken( exp ){
    
  let getTime = parseInt(  new Date().getTime() / 1000 );
  
  if(  getTime - exp  >  60 ){
      return true;
  }
  
} 

/* GET home page. */
router.get('/', function (req, res, next) {
  res.r
  ender('index', { title: 'Express' });
});



//支付状态
router.post('/api/successPayment',function(req,res,next){
    //token
    let token = req.headers.token;
    let tokenObj = jwt.decode(token);
    //订单号
    let out_trade_no = req.body.out_trade_no;
    let trade_no = req.body.trade_no;
    //支付宝配置
    const formData = new AlipayFormData();
    // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
    formData.setMethod('get');
       //支付时信息
       formData.addField('bizContent', {
        out_trade_no,
        trade_no
      });
      //返回promise
    const result = alipaySdk.exec(
      'alipay.trade.query',
      {},
      { formData: formData },
    );
    //后端请求支付宝
    result.then(resData=>{
      axios({
        method:'GET',
        url:resData
      }).then(data=>{
        let responseCode = data.data.alipay_trade_query_response;
        if(  responseCode.code == '10000' ){
            switch(responseCode.trade_status){
              case 'WAIT_BUYER_PAY':
              res.send({
                data:{
                    code:0,
                    data:{
                        msg:'支付宝有交易记录，没付款'
                    }
                }
            })
            break;
            case 'TRADE_CLOSED':
              res.send({
                  data:{
                      code:1,
                      data:{
                          msg:'交易关闭'
                      }
                  }
              })
          break;
          case 'TRADE_FINISHED':
            connection.query(`select * from user where tel = ${tokenObj.tel}`,function(error,results){
                //用户id
                let uId = results[0].id;
                connection.query(`select * from store_order where uId = ${uId} and order_id = ${out_trade_no}`,function(err,result){
                    let id = result[0].id;
                    //订单的状态修改掉2==》3
                    connection.query(`update store_order set order_status = replace(order_status,'2','3') where id = ${id}`,function(){
                        res.send({
                            data:{
                                code:2,
                                data:{
                                    msg:'交易完成'
                                }
                            }
                        })
                    })
                })
            })
        break;

        case 'TRADE_SUCCESS':
                        connection.query(`select * from user where tel = ${tokenObj.tel}`,function(error,results){
                            //用户id
                            let uId = results[0].id;
                            connection.query(`select * from store_order where uId = ${uId} and order_id = ${out_trade_no}`,function(err,result){
                                //这是订单号的id
                              let id = result[0].id;
                                //订单的状态修改掉2==》3
                                connection.query(`update store_order set order_status = replace(order_status,'2','3') where id = ${id}`,function(){
                                    res.send({
                                        data:{
                                            code:2,
                                            data:{
                                                msg:'交易完成'
                                            }
                                        }
                                    })
                                })
                            })
                        })
                   break;
            }
        }else if( responseCode.code == '40004' ){
          res.send({
              data:{
                  code:4,
                  msg:'交易不存在'
              }
          })
      }
      }).catch( err=>{
        res.send({
            data:{
                code:500,
                msg:'交易失败',
                err
            }
        })
     })
    })

})



//发起支付
router.post('/api/payment',function(req,res,next){
  console.log('ZOULEMA ')
 //订单号
 let orderId = req.body.orderId;
 //商品总价
 let price = req.body.price;
 //购买商品的名称
 let name = req.body.name;
 //开始对接支付宝API
 const formData = new AlipayFormData();
 // 调用 setMethod 并传入 get，会返回可以跳转到支付页面的 url
 formData.setMethod('get');
     //支付时信息
 formData.addField('bizContent', {
      outTradeNo: orderId,//订单号
      productCode: 'FAST_INSTANT_TRADE_PAY',//写死的
      totalAmount: price,//价格
      subject: name,//商品名称
    });

  //支付成功或者失败跳转的链接
  formData.addField('returnUrl', 'http://localhost:8080/payment');
     //返回promise
     const result = alipaySdk.exec(
      'alipay.trade.page.pay',
      {},
      { formData: formData },
    );
       //对接支付宝成功，支付宝方返回的数据
       result.then(resp=>{
        res.send({
            data:{
                code:200,
                success:true,
                msg:'支付中',
                paymentUrl : resp
            }
        })
    })

})

//修改订单状态
router.post('/api/submitOrder',function(req,res,next){
  //token
  let token = req.headers.token;
  let tokenObj = jwt.decode(token);
  //订单号
  let orderId = req.body.orderId;
  //购物车选中的商品id
  let shopArr = req.body.shopArr;
  //查询用户
  connection.query(`select * from user where tel = ${tokenObj.tel}`,function(error,results){
      //用户id
      let uId = results[0].id;
      connection.query(`select * from store_order where uId = ${uId} and order_id = ${orderId}`,function(err,result){
          //订单的数据库id
          let id = result[0].id;
          //修改订单状态 1==>2
          connection.query(`update store_order set order_status = replace(order_status,'1','2') where id = ${id}`,function(e,r){
              //购物车数据删除
              shopArr.forEach(v=>{
                  connection.query(`delete from goods_cart where id = ${v}`,function(){
                      
                  })
              })
              res.send({
                  data:{
                      code:200,
                      success:true
                  }
              })
          })
      })
  })
  
})


//生成一个订单
router.post('/api/addOrder',function(req,res,next){
         //token
  let token = req.headers.token;
  let tokenObj = jwt.decode(token);

  //前端给后端的arr,就是选中要去结算的
  let goodsArr=req.body.arr;

  //生成订单的order_id 时间戳加6位的随机数
  function setTimeDateFmt(s){
    //补0
         return s<10 ? '0'+ s : s
  }
  function randomNumber(){
    const now=new Date();
    let month=now.getMonth()+1;
    let day=now.getDate();
    let hour=now.getHours();
    let minutes=now.getMinutes();
    let seconds=now.getSeconds();

    //个位数前面补0
    month=setTimeDateFmt(month)
    day=setTimeDateFmt(day)
    hour=setTimeDateFmt(hour)
    minutes=setTimeDateFmt(minutes)
    seconds=setTimeDateFmt(seconds)


  let orderCode=now.getFullYear().toString()+month.toString()+day+hour+minutes+seconds+(Math.round(Math.random()*100000)).toString();
    return orderCode;
}
   /* 
      未支付：1
      待支付：2
      支付成功：3
      支付失败：4或者0
  */
 //商品列表名称
    let goodsName=[];
    //订单商品总金额
    let goodsPrice=0;
    //订单商品总数量
    let goodsNum=0;
    //订单号
    let orderId = randomNumber();

    goodsArr.forEach(v=>{
      goodsName.push(v.goods_name);
      goodsPrice+=v.goods_price*v.goods_num
      goodsNum+=parseInt(v.goods_num);
    })

    //查询当前的用户
    connection.query(`select * from user where tel = ${tokenObj.tel}`,function(error,results){
          //查询是哪个用户id
       
          let uId = results[0].id;
          connection.query(`insert into store_order (order_id,goods_name,goods_price,goods_num,order_status,uId) values ('${ orderId }','${goodsName}','${goodsPrice}','${goodsNum}','1',${uId})`,function(){
              //查询当前的订单号
            connection.query(`select * from store_order where uId = ${uId} and order_id='${orderId}'`,function(err,result){
               res.send({
                data:{
                  success:true,
                  code:200,
                  data:result
                }
               })
            })
          })
    })


  
})



//删除收货地址
router.post('/api/deleteAddress',function(req,res,next){
  let id = req.body.id; //拿到id号
  connection.query(`delete from address where id = ${id}`,function(error,results){
      res.send({
          data:{
              code:200,
              success:true,
              msg:'删除成功'
          }
      })
  })
})


//修改收货地址
router.post('/api/updateAddress',function(req,res,next){
  //token
  let token = req.headers.token;
  let tokenObj = jwt.decode(token);
  //拿到前端给后端传入的数据
  let body = req.body;
  let [id,name,tel,province,city,county,addressDetail,isDefault,areaCode] = [
      body.id,
      body.name,
      body.tel,
      body.province,
      body.city,
      body.county,
      body.addressDetail,
      body.isDefault,
      body.areaCode
  ];
  //查询用户
  connection.query(`select * from user where tel = ${tokenObj.tel}`,function(error,results){
      //查询是哪个用户id
      let uId = results[0].id;
      //对应查询到0 或者 1 有没有默认收货地址
      connection.query(`select * from address where uId = ${uId} and isDefault = ${isDefault}`,function(err,result){
          if( result.length > 0 ){
              let addressId = result[0].id;
              connection.query(`update address isDefault = replace(isDefault,'1','0') where id = ${addressId}`,function(e,r){
                  let updateSql = `update address set uId = ? , name = ? , tel = ? , province = ? , city = ? ,county = ? , addressDetail = ? , isDefault = ? , areaCode = ? where id = ${id}`;
                  connection.query(updateSql,[uId,name,tel,province,city,county,addressDetail,isDefault,areaCode],function(errors,datas){
                      res.send({
                          data:{
                              code:200,
                              success:true,
                              msg:'修改成功'
                          }
                      })
                  })
              })
          }
          else{
              let updateSql = `update address set uId = ? , name = ? , tel = ? , province = ? , city = ? ,county = ? , addressDetail = ? , isDefault = ? , areaCode = ? where id = ${id}`;
              connection.query(updateSql,[uId,name,tel,province,city,county,addressDetail,isDefault,areaCode],function(errors,datas){
                  res.send({
                      data:{
                          code:200,
                          success:true,
                          msg:'修改成功'
                      }
                  })
              })
          }
      })
  })
})



//查询收货地址
router.post('/api/selectAddress',function(req,res,next){
  //token
  let token = req.headers.token;
  let tokenObj = jwt.decode(token);
  
  //查询用户
  connection.query(`select * from user where tel = ${tokenObj.tel}`,function(error,results){
      //用户id
      let uId = results[0].id;
      connection.query(`select * from address where uId = ${uId}`,function(err,result){
          res.send({
              data:{
                  code:200,
                  success:true,
                  msg:'查询成功',
                  data:result
              }
          })
      })
  })
})



//新增收货地址
router.post('/api/addAddress',function(req,res,next){
  //token
  console.log(req.body)
  let token = req.headers.token;
  let tokenObj = jwt.decode(token);
  //拿到前端给后端传入的数据
  let body = req.body;
  let [name,tel,province,city,county,addressDetail,isDefault,areaCode] = [
      body.name,
      body.tel,
      body.province,
      body.city,
      body.county,
      body.addressDetail,
      body.isDefault,
      body.areaCode
    
  ];
  
  //查询用户
  connection.query(`select * from user where tel = ${tokenObj.tel}`,function(error,results){
      //用户id
      let uId = results[0].id;
      //增加一条收货地址  ,这里不懂
      if(isDefault!=1){
        connection.query(`insert into address (uId,name,tel,province,city,county,addressDetail,isDefault,areaCode) values (${uId},"${name}","${tel}","${province}","${city}","${county}","${addressDetail}","${isDefault}","${areaCode}")`,function(err,result){
          res.send({
              data:{
                  code:200,
                  success:true,
                  msg:'收货地址添加成功'
              }
          })
      })
      
      }else{
        connection.query(`select * from address where uId = ${uId} and isDefault = ${isDefault}`,function(err,result){
          if( result.length > 0 ){
              let addressId = result[0].id;
              connection.query(`update address set isDefault = replace(isDefault,'1','0') where id = ${addressId}`,function(){
                  connection.query(`insert into address (uId,name,tel,province,city,county,addressDetail,isDefault,areaCode) values (${uId},"${name}","${tel}","${province}","${city}","${county}","${addressDetail}","${isDefault}","${areaCode}")`,function(e,r){
                      res.send({
                          data:{
                              code:200,
                              success:true,
                              msg:'收货地址添加成功'
                          }
                      })
                  })
              })
          }
          else{
              connection.query(`insert into address (uId,name,tel,province,city,county,addressDetail,isDefault,areaCode) values (${uId},"${name}","${tel}","${province}","${city}","${county}","${addressDetail}","${isDefault}","${areaCode}")`,function(err,result){
                  res.send({
                      data:{
                          code:200,
                          success:true,
                          msg:'收货地址添加成功'
                      }
                  })
              })
          }
      })
      
      }

    })
})


//修改购物车数量(这个忘记写了)
router.post('/api/updateNum',function(req,res,next){
    
  let id = req.body.id;
  let changeNum = req.body.num;
  
  connection.query(`select * from goods_cart where id = ${id}`,function(error,results){
      //原来的数量
      let num = results[0].goods_num;
      connection.query(`update goods_cart set goods_num = replace(goods_num,${num},${changeNum}) where id = ${id}`,function(err,result){
          res.send({
              data:{
                  code:200,
                  success:true
              }
          })
      })
      
  })
  
})


//删除购物车数据
router.post('/api/deleteCart',function(req,res,next){
    
  let arrId = req.body.arrId;
  
  for(let i=0;i<arrId.length;i++){
      connection.query(`delete from goods_cart where id = ${arrId[i]}`,function(error,results){
          res.send({
              data:{
                  code:200,
                  success:true,
                  msg:'删除成功'
              }
          })
      })
  }
})

//查询订单
router.post('/api/selectOrder',function(req,res,next){
  //接收前端给后端的订单号
  let orderId = req.body.orderId;
  connection.query(`select * from store_order where order_id='${orderId}'`,function(err,result){
       res.send({
          data:{
               success:true,
               code:200,
               data:result
          }
       })
  })
})





//查询当前购物车的数据
router.post('/api/selectCart',function(req,res,next){
  let token=req.headers.token;
  let tokenObj=jwt.decode(token)

  connection.query(`select * from user where tel = ${tokenObj.tel}`,function(error,results){
     //上面这是查询用户是的id
     let uId=results[0].id;
     //这是查询加入购物车里面的数据
     connection.query(`select * from goods_cart where uId=${uId}`,function(err,result){
      res.send({
          data:{
            code:200,
            success:true,
            data:result,
          }           
      })
     })

  })
})




//添加购物车的接口
router.post('/api/addCart',function(req,res,next){
  //后端接胡搜前端的采纳数
      let goodsId=req.body.goodsId;
     let token=req.headers.token;
     let tokenObj=jwt.decode(token);  

        //如果执行，就证明token过期了
    if(getTimeToken(tokenObj.exp) ){
      res.send({
          data:{
              code:1000
          }
      })
  }
   

     console.log(tokenObj)
     connection.query(`select * from user where tel = ${tokenObj.tel}`,function(error,results){
          //获取用户的id
       let uId=results[0].id
       //根据id取查询商品
       connection.query(`select * from goods_list where id=${goodsId}`,function(err,result){
        console.log(result[0])  //查询到点击id获取的商品信息
        let goodsName=result[0].name;
        let goodsPrice=result[0].price;
        let goodsImgUrl=result[0].imgUrl;
  //查询当前用户在之前是否添加过本商品
  connection.query(`select * from goods_cart where uId=${uId} and goods_id=${goodsId}`,function(e,r){

        //用户之前是添加过商品到购物车
        if( r.length > 0 ){
          let num = r[0].goods_num;
          connection.query(`update goods_cart set goods_num = replace(goods_num,${num},${parseInt(num) + 1}) where id = ${r[0].id}`,function(e,datas){
              res.send({
                  data:{
                      code:200,
                      success:true,
                      msg:'添加成功'
                  }
              })
          })
      }else{
           //没有
           connection.query(`insert into goods_cart (uId,goods_id,goods_name,goods_price,goods_num,goods_imgUrl) values ("${uId}","${goodsId}","${goodsName}","${goodsPrice}","1","${goodsImgUrl}")`,function(){
            res.send({
                data:{
                    code:200,
                    success:true,
                    msg:'添加成功'
                }
            }) 
         })
      }
  })
})
     })
    })
       




        // connection.query(`insert into goods_cart(uId,goods_id,goods_name,goods_price,goods_num,goods_imgUrl) values  ("${uId}","${goodsId}","${goodsName}","${goodsPrice}","1","${goodsImgUrl}")`,function(e,r){
       
        //   res.send({
        //     data:{
        //       success:true,
        //       msg:'添加成功'
        //     }
        //   })
        // })
//        })
//      })
// })


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

    //
    let userTel=params.userTel;
    let userPwd=params.userPwd ||'66666';

    //引入token包
    let jwt=require('jsonwebtoken');
    //用户信息
      let payload={tel:userTel}
    //口令
    let secret='xiaoluxian'
    //生成token
    let token=jwt.sign(payload,secret,{
        expiresIn:60
    })



    //查询用户手机号是否存在,把手机号密码传入userSql.js中定义好的queryUserTel中
    connection.query(user.queryUserTel(params),function(error,results){
      //手机号存在
      if(results.length>0){
        //记录的id
        let id=results[0].id;

        //手机号存在
        connection.query(user.queryUserPwd(params),function(error,results){
          if(results.length>0){

            connection.query(`update user set token='${token}' where id=${id}`,function(){
              //手机号密码都对
              res.send({
                code:200,
                data:{
                  success:true,
                  msg:'登录成功',
                  data:results[0],
                }
              })
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
