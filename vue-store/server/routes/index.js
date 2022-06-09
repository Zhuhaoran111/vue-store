var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

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
        //猜你喜欢
        {
          id: 3,
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
        },

      ]


    }
  })
});


module.exports = router;
