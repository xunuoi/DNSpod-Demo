var stone = require('../tools/stone'),
	https = require('https'),
	qs = require('querystring');

exports.page = function (req, res) {
	res.render('admin/index.html');
};
exports.do = function(req, res, callback){
	var way = req.param('way');
	exports.REQ[way](req, res, callback);
};
exports._info = {
	'login_email' : 'xunuoi@163.com',
	'login_password': 'wjx7w5l2',
	'format': 'json'
};
exports.REQ = {
	addDomain: function(req, res, callback){
		var pageRes  = res,
			newDomain = req.param('domain');

		var postData = qs.stringify(stone.updateObj(exports._info, {
			'domain': newDomain,
		}));
		var options = {
		  hostname: 'dnsapi.cn',
		  port: 443,
		  path: '/Domain.Create',
		  method: 'POST',
		  headers: {
	          'Content-Type': 'application/x-www-form-urlencoded',
	          'Content-Length': postData.length
	      }
		};

		var req = https.request(options, function(res) {
			// console.log("statusCode: ", res.statusCode);
			// console.log("headers: ", res.headers);
			var data = '';
			res.on('data', function(d) {
				data += d;
				// process.stdout.write(d);
			});
			res.on('end', function(d) {
				pageRes.json(JSON.parse(data));
			});
		});
		//write postData into request
		req.write(postData + "\n");

		req.end();
		req.on('error', function(e) {
			console.error(e);
		});
	},
	DNList: function(req, res, callback){
		var pageRes = res;
		var postData = qs.stringify(exports._info);
		var options = {
		  hostname: 'dnsapi.cn',
		  port: 443,
		  path: '/Domain.List',
		  method: 'POST',
		  headers: {
	          'Content-Type': 'application/x-www-form-urlencoded',
	          'Content-Length': postData.length
	      }
		};

		var req = https.request(options, function(res) {
			var data = '';
			res.on('data', function(d) {
				data += d;
				// process.stdout.write(d);
			});
			res.on('end', function(){
				pageRes.json(JSON.parse(data));
			});
		});
		//write postData into request
		req.write(postData + "\n");

		req.end();
		req.on('error', function(e) {
			console.error(e);
		});

 	},
 	delDomain: function(req, res, callback){
		var pageRes  = res,
			delId = req.param('id');

		var postData = qs.stringify(stone.updateObj(exports._info, {
			'domain_id': delId,
		}) );
		var options = {
		  hostname: 'dnsapi.cn',
		  port: 443,
		  path: '/Domain.Remove',
		  method: 'POST',
		  headers: {
	          'Content-Type': 'application/x-www-form-urlencoded',
	          'Content-Length': postData.length
	      }
		};

		var req = https.request(options, function(res) {
			var data = '';
			res.on('data', function(d) {
				data += d;
				// process.stdout.write(d);
			});
			res.on('end', function(d) {
				pageRes.json(JSON.parse(data));
			});
		});
		//write postData into request
		req.write(postData + "\n");

		req.end();
		req.on('error', function(e) {
			console.error(e);
		});
	},
};