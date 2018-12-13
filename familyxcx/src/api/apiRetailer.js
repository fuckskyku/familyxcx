import fly from './apiConfigRetailer'

//获取机构首页
export const getBannerAdGood = param => {
    return fly.post('/api/ParentAdLog/getBannerAdGood', param);
}

//获取机构列表
export const getStoreList = param => {
    return fly.post('/api/ParentSetTopLog/selectStoreList', param);
}

//获取行政区
export const getAddress = param => {
    return fly.post('/api/address/getAddress', param);
}

//获取机构详情
export const getStoreInfo= param => {
    return fly.post('/api/storeInfo/StoreInfo', param);
}

//获取课程详情
export const getMobileGoodsInfo= param => {
    return fly.post('/api/goods/getMobileGoodsInfo', param);
}







