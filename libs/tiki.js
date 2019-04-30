let request = require('request');
let _ = require('lodash');
let async = require('async');
let tiki = function(){
  this.deals = function(mongodb, params, cb){
    var db = mongodb.db("topdeal");
    var Product = db.collection('Product');

    let category_ids = params.category_ids || '1789%2C4221%2C1815%2C1846%2C1801';
    let type = params.type || 'now';
    let len = 200;
    let page = 1;
    let total = 0;
    async.whilst(
      function() { return len == 200; },
      function(callback) {
        let url = "https://tiki.vn/api/v2/events/deals/?category_ids="+category_ids+"&type="+type+"&page="+page+"&per_page=200";
        console.log(url);
        request.get({
          url: url
        }, function(error, response, body){
          if (body) {
            console.log("DONE....", url);
            try {
              let data = JSON.parse(body);
              len = data.data.length;
              page++;
              async.forEachLimit(data.data, 10, function(item, cback){
                item.url_path = "https://tiki.vn/" + item.product.url_path;
                Product.save(item, function(err, ok) {
                  if (err) {
                      console.log(err);
                  } else {
                      console.log("OK", ++total, item.product.url_path);
                  }
                  cback();
                })
              }, function(){
                callback(null);
              })
            } catch(ex) {
              len = 0;
              callback(ex);
            }
          } else {
            len = 0;
            callback(null);
          }
        })
      },
      function (err, n) {
        cb(err, total);
      }
    );
  };
}
module.exports = tiki;