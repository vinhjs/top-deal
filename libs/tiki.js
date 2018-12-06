var request = require('request');
var _ = require('lodash');
var tiki = function(){
  this.deals = function(cb){
    request.get({
      url: "https://tiki.vn/api/v2/events/deals/?category_ids=4221%2C1815%2C1882%2C1883%2C4384%2C2549%2C8322&type=now&page=1&per_page=20"
    }, function(error, response, body){
      if (body) {
        try {
          let data = JSON.parse(body);
          let results = [];
          data.data.forEach(function(item){
            if(item.discount_percent > 50) {
              results.push({
                discount_percent: item.discount_percent,
                name: item.product.name,
                url_path: "https://tiki.vn/" + item.product.url_path,
                price: item.product.price,

              });
            }
          });
          results = _.sortBy(results, [function(o) { return o.discount_percent; }]);
          cb(results);
        } catch(ex) {
          cb(ex);
        }
      } else {
        cb([])
      }
    })
  };
}
module.exports = tiki;