//引入sdk
const AlipaySdk=require('alipay-sdk').default
const alipaySdk = new AlipaySdk({
    appId: '2021000121608518',
    //签名算法
    signType:'RSA2',
    //支付宝网关
    gateway:'https://openapi.alipaydev.com/gateway.do',
    //支付宝公钥
    alipayPublicKey:"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0S0c78zN3tbijGax1w6JQ/pntA5GxEBdDkAUS4QTAf6GYAqMlikmOY0UmB0dxed3x+ODQn+jSPLxIfd1u0wsotNhhHJklqgB5N7JglgMoSXK4WkcnkeFA0GebSohE9Zn1v7dD86AKZ5QeuQm6vjOd4MyZJbxE/X7aXuFILcLy40nh60MpJls4SNKPxfoe9gW/2kinoIIvxkWeoOgz/rbsW6Wf2PucYrZLOknnNJSL5teD1nDV1/mca5IxTPVenmRgtKDtziX1z0jaJTc+AAt2DGp8eCE+pMZnQLfNt9xRPvzKnb55uNnONgeX8MM/4s2DOPsfcey6B4gOWaVqOf64wIDAQAB",
     //应有私钥
    privateKey:'MIIEpAIBAAKCAQEAysLVWkJdsE4fxZ72B5oRtI4AW0qzNkNaHHlCgD5QDD2KeU9u960+8gEkpC2xDlTa+7IdMXcHjjnij+d4xqQ/DaeTFjaPcAQKsl2++NER1jWqIh0fi2DEiaes70QQyzomYWIMhWBzNBxBn8ZCl2aXV2Te8Cc81RFWzfvoisenkXshirTxizA8E2lKd1HCb4oaDhxoJKNOkkLDq5wfNYFh/MFHJIb8N4iU8XW35OmPVvgbGTarpJmsUiRTipYvwARjsBPJwbclasqa1UkNYbxpe0VfBSZPrw1euEtLaIY2AWqYOtDP9+WcHF0k+tYX8CuwBLF4vuBjGdW05FMQLF60BwIDAQABAoIBAGRXsWA+scDbmMujFFzEuXhiQfjr6e6zvDeVJvzyWYkFN687SU5XNWxsdmatmg7enZSsG9hr8JhJOz8+LT4Y8H9ga+E1VRz5UxXcYPMf/DTHUBAb242NcRYyndm3FJyOhYnyDQJAriKezTc11aS5h7IfYFj3AhrrvsqnnPh5QAs1QpZQvhQdZG4p958hD4VJlvLUtxQodVBqNdT4eDwmSGx+UoiLrJjXH+JvmgVz5wj+jNV0ljkrj567CzVu87XQ4Zap0Z5XIeME4j7Ge17bSDnF9+Dte6m4VfT1LbBjJwQhEO+umdG5Kw7NwPUkeAj4iIaZP54ZNt5z/OQC36Rag3kCgYEA/h4USXXgYZkAMB2bxZUYJnwRWWco0Q/Dju0TcCFOv2yTls8HvHnaaLezWFycAs+LweBOgYOwQ2PwqTegJ+WcTJDMxtwjfPXMTdTjf4P6mcF/liw/fhRMXIy79Yalhl03hxGpHy1M84sv8JHGOQzfitF9lCR3H0TFeREbt7ZXid0CgYEAzENb/ZVeDo+byW27BLhWdymaZA0Bjg4NZmYgtIk97PdaONUAidSOmiZUjTGzCy8cC2U1RJCWHVnP+YlR+jUoa618YgQ0UHhptZTIdGp4yG6SlYrVx9TE2NzdGh5VOddUuR05ZB1FDjM5sZLYX0hzv9u1Wv+UYLtdQrtLNSMf4TMCgYEAu0gX03wYflVwmgV4REn5noNZlfY9Ura3faKj7MPfcZznuQGjxfhYS0z31GuMX1Xuvlg+A522TjRdrZjdZAoJAzTEdtrPHM1aYRJBCD2Qd7jv+xFpSdZT4PGnpPAzFa+luNn/NocAa41tK3OED4+5QGncj03ArT7V+r/tGZw9L9ECgYEAg/t6Mw4SakIsnSiD0PbzF6gQFFm7CXjW+7U9qKmNE9J3v4USBf0L71qZA2p7j9xuuIY6twTdmjVwBoLOL2etqHW+iu7AhsZnN2bdZytsw8V+fZXpsGcwkheT3c5/rxINslbJwICRIC3FN5H0sQx1jiB+vD+sNhyalAXFAJ6jeLUCgYBMUSkK2mNF4rs+6uecUl/LhD455eP0RQNKEdFf+KHVHer7e4Xyb0wzSU/JgrzU1G5ipfW9zecgaSv17g6+X74rwfgiHIvgHRCkHiwGixnSpH1s4/GJ0+x6EgPd8homXW3g6aGYwCQKCA3J+cb6RcwSAKzixvfdkF7jOTU0gIEhKg==',
  });

  module.exports=alipaySdk;