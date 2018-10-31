'use strict';
var path       = require("path");
var fs         = require("fs");
var myRule = require("./myRule");
var localPng = fs.readFileSync(path.join(__dirname, './1.png'));

var isRootCAFileExists = require("./certMgr.js").ifRootCAFileExists(),
    interceptFlag      = false;

module.exports = {

  summary: function() {
        var tip = "the default rule for AnyProxy.";
        if(!isRootCAFileExists){
            tip += "\nRoot CA does not exist, will not intercept any https requests.";
        }
        return tip;
  },

  /**
   *
   *
   * @param {object} requestDetail
   * @param {string} requestDetail.protocol
   * @param {object} requestDetail.requestOptions
   * @param {object} requestDetail.requestData
   * @param {object} requestDetail.response
   * @param {number} requestDetail.response.statusCode
   * @param {object} requestDetail.response.header
   * @param {buffer} requestDetail.response.body
   * @returns
   */
  *beforeSendRequest(requestDetail) {
    return null;
  },


  /**
   *
   *
   * @param {object} requestDetail
   * @param {object} responseDetail
   */
  *beforeSendResponse(requestDetail, responseDetail) {
    // return null;
    const newResponse = responseDetail.response;
    //test case 
    if (requestDetail.url === 'http://xxx.cn/user-agent') {
          newResponse.body += '--from anyproxy--';
          // return null
      }
      
      // newResponse.body = '- AnyProxy Hacked!';
      var res = newResponse;
      
      var callback = function(e) {
        console.log("callback")
      }
      var serverResData = newResponse.body;

      if (/profile_ext.+__biz/.test(requestDetail.url)){
            myRule.getProfile(requestDetail,res,serverResData,callback);
        // 获取点赞量、阅读量、打赏情况等数据
        } else if (/getappmsgext/.test(requestDetail.url)) {
            myRule.getReadAndLikeNum(requestDetail, res, serverResData, callback);
        // 文章页，注入js脚本使自动翻页
        } else if (/\/s\?__biz/.test(requestDetail.url)){
            myRule.insertJsForRefresh(requestDetail, res, serverResData, callback);
        } else if (/mp\/appmsg\/show/.test(requestDetail.url)) {
            myRule.insertJsForRefresh(requestDetail, res, serverResData, callback);
        } else {
            callback(serverResData);
        }
      // return new Promise((resolve, reject) => {
      //   setTimeout(() => { // delay
      //     resolve({ response: newResponse });
      //   }, 5000);
      // });
      return {
        response: newResponse
      };
    
  },


  /**
   * default to return null
   * the user MUST return a boolean when they do implement the interface in rule
   *
   * @param {any} requestDetail
   * @returns
   */
  *beforeDealHttpsRequest(requestDetail) {
    return null;
  },

  /**
   *
   *
   * @param {any} requestDetail
   * @param {any} error
   * @returns
   */
  *onError(requestDetail, error) {
    return null;
  },


  /**
   *
   *
   * @param {any} requestDetail
   * @param {any} error
   * @returns
   */
  *onConnectError(requestDetail, error) {
    return null;
  },
};
