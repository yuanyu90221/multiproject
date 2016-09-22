//modules/demo
var GameDao = require('../dao/gameDao');
var InningDao = require('../dao/inningDao');
var InningVo = require('../dao/inning');
GameDao.queryByCriteria({ g_p_more: 4},function(err, result){
    if(err)
        throw err;
    console.log(result);
});

InningDao.queryByCriteria({},function(err, result){
    if(err)
        throw err;
    console.log(result);
});
var inningObj = new InningVo();
inningObj.setInning_guid(1234);
console.log(inningObj);
InningDao.insertInning(inningObj, function(err, result){
    if(err)
        throw err;
    console.log(result);
});