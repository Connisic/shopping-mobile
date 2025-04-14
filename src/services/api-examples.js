/**
 * 本文件包含各API接口响应数据的示例，仅供参考
 * 实际开发中请以后端返回的真实数据为准
 */

// 商品列表查询响应示例
const productListResponse = {
  "code": 200,
  "message": "操作成功",
  "data": {
    "goodsPage": {
      "records": [
        {
          "id": 1,
          "goodsName": "iPhone 13",
          "caption": "Apple最新款手机",
          "price": 5999.00,
          "headerPic": "http://image-url.com/iphone13.jpg",
          "brand": "Apple",
          "tags": ["手机", "苹果", "电子产品"],
          "productType": ["电子产品", "手机", "智能手机"],
          "specification": {
            "颜色": ["黑色", "白色", "蓝色"],
            "内存": ["128GB", "256GB", "512GB"]
          }
        }
        // 更多商品...
      ],
      "total": 100,
      "size": 10,
      "current": 1
    },
    "goodsSearchParam": {
      "keyword": "手机",
      "brand": "",
      "highPrice": null,
      "lowPrice": null,
      "specificationOption": {},
      "sortFiled": "",
      "sort": "",
      "page": 1,
      "size": 10
    },
    "brands": ["Apple", "Samsung", "Xiaomi"],
    "productType": ["电子产品", "手机", "智能手机"],
    "specifications": {
      "颜色": ["黑色", "白色", "蓝色", "红色"],
      "内存": ["64GB", "128GB", "256GB", "512GB"]
    }
  }
}

// 商品详情响应示例
const productDetailResponse = {
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "goodsName": "iPhone 13",
    "caption": "Apple最新款手机",
    "price": 5999.00,
    "headerPic": "http://image-url.com/iphone13.jpg",
    "isMarketable": true,
    "introduction": "iPhone 13是Apple推出的最新一代iPhone，搭载A15仿生芯片...",
    "brand": {
      "id": 1,
      "name": "Apple",
      "image": "http://image-url.com/apple-logo.jpg"
    },
    "productType1": { "id": 1, "name": "电子产品" },
    "productType2": { "id": 2, "name": "手机" },
    "productType3": { "id": 3, "name": "智能手机" },
    "images": [
      {
        "id": 1,
        "imageTitle": "iPhone 13正面",
        "imageUrl": "http://image-url.com/iphone13-front.jpg"
      },
      {
        "id": 2,
        "imageTitle": "iPhone 13背面",
        "imageUrl": "http://image-url.com/iphone13-back.jpg"
      }
    ],
    "specifications": [
      {
        "id": 1,
        "specName": "颜色",
        "specificationOptions": [
          { "id": 1, "optionName": "黑色" },
          { "id": 2, "optionName": "白色" },
          { "id": 3, "optionName": "蓝色" }
        ]
      },
      {
        "id": 2,
        "specName": "内存",
        "specificationOptions": [
          { "id": 4, "optionName": "128GB" },
          { "id": 5, "optionName": "256GB" },
          { "id": 6, "optionName": "512GB" }
        ]
      }
    ],
    "sales": 1000,
    "rating": 4.8,
    "createTime": "2023-01-01T00:00:00"
  }
}

// 购物车列表响应示例
const cartListResponse = {
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "goodId": 1,
      "goodsName": "iPhone 13",
      "price": 5999.00,
      "headerPic": "http://image-url.com/iphone13.jpg",
      "num": 1,
      "checked": true
    },
    {
      "id": 2,
      "goodId": 2,
      "goodsName": "MacBook Pro",
      "price": 12999.00,
      "headerPic": "http://image-url.com/macbook-pro.jpg",
      "num": 1,
      "checked": true
    }
  ]
}

// 订单列表响应示例
const orderListResponse = {
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "202304110001",
      "payment": 5999.00,
      "paymentType": 2,
      "postFee": 0,
      "status": 1,
      "createTime": "2023-04-11T10:00:00",
      "paymentTime": null,
      "consignTime": null,
      "endTime": null,
      "closeTime": null,
      "shippingName": null,
      "shippingCode": null,
      "userId": 10001,
      "buyerMessage": "请尽快发货",
      "buyerNick": "测试用户",
      "receiverAreaName": "北京市朝阳区xxx小区",
      "receiverMobile": "13800138000",
      "receiverZipCode": "100000",
      "receiver": "张三",
      "expire": "2023-04-11T10:30:00"
    }
  ]
}

// 秒杀商品列表响应示例
const seckillProductsResponse = {
  "code": 200,
  "message": "操作成功",
  "data": {
    "records": [
      {
        "id": 1,
        "goodsId": 1,
        "title": "iPhone 13 秒杀",
        "introduction": "iPhone 13限时秒杀活动",
        "headerPic": "http://image-url.com/iphone13.jpg",
        "price": 5999.00,
        "costPrice": 4999.00,
        "startTime": "2023-04-11T10:00:00",
        "endTime": "2023-04-11T22:00:00",
        "num": 100,
        "stockCount": 50
      }
    ],
    "total": 10,
    "size": 10,
    "current": 1
  }
}

// 用户登录响应示例
const loginResponse = {
  "code": 200,
  "message": "操作成功",
  "data": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEwMDAxLCJ1c2VybmFtZSI6InRlc3QiLCJleHAiOjE2ODExNzI4MDB9.t7JvcItDQPTaJeSBVuLg1ortiB6vCK-kSZvfwk5aXXX"
}

export {
  productListResponse,
  productDetailResponse,
  cartListResponse,
  orderListResponse,
  seckillProductsResponse,
  loginResponse
} 