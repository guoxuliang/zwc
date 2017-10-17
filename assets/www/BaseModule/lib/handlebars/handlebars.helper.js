//注册一个Handlebars Helper,扩展条件表达式
(function(undefined) {
  'use strict';

  var registerIfCondHelper = function(hbs) {
    hbs.registerHelper('ifCond', function(v1, operator, v2, options) {
      switch (operator) {
        case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
          break;
        case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
          break;
        case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
          break;
        case '!==':
        	return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        	break;
        case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
          break;
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
          break;
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
          break;
        case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
          break;
        default:
          return options.inverse(this);
          break;
      }
      return options.inverse(this);
    });
  };
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = registerIfCondHelper;
  }

  this.Handlebars && registerIfCondHelper(this.Handlebars);
}).call(this);

//注册一个Handlebars Helper,用来将索引+1，因为默认是从0开始的
(function(undefined) {
  'use strict';
  
  var registerAddIndexHelper = function(hbs) {
	hbs.registerHelper("add",function(index, options){ 
	  return parseInt(index)+1;
    });
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = registerAddIndexHelper;
  }

  this.Handlebars && registerAddIndexHelper(this.Handlebars);
}).call(this);

//注册一个Handlebars Helper,用来内容HTML转义
(function(undefined) {
  'use strict';
  
  var registerSafeStringHelper = function(hbs) {
	hbs.registerHelper("saftString",function(text){ 
		return new Handlebars.SafeString(text);
    });
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = registerSafeStringHelper;
  }

  this.Handlebars && registerSafeStringHelper(this.Handlebars);
}).call(this);

//注册一个Handlebars Helper,用来格式化日期
(function(undefined) {
'use strict';

var registerFormatDateHelper = function(hbs) {
	hbs.registerHelper("formatDate",function(datetime, format){ 
		if(format == 'yyyy-mm-dd'){
			var date = new Date(datetime);
			var mm = date.getMonth() + 1; // getMonth() is zero-based
			var dd = date.getDate();

			return [date.getFullYear(), mm, dd].join('-'); // padding

		}
		return datetime;
  });
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = registerFormatDateHelper;
}

this.Handlebars && registerFormatDateHelper(this.Handlebars);
}).call(this);

