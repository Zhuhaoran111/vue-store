
var express = require('express');
var router = express.Router();
var connetcion = require('../db/sql')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});



//点击猜你喜欢模块跳转到详情页的查询商品的id来更新详情页的数据
router.get('/api/goods/id', function (req, res, next){
  let id=req.query.id;
  connetcion.query('select * from goods_list where id='+id+'',function(error,result){
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
  connetcion.query('select * from goods_list where name like "%' + name + '%" order by ' + orderName + ' ' + order + ' ', function (error, results) {
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
