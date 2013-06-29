define(function(){
var exports = {};
exports.init = function(){
	$(function(){	
		exports.initFunc().DNList();
	});
};

exports.DNList = function(){
	$.ajax({
		url: '/do?way=DNList',
		success: function(data){
			// console.log(data);
			exports.setDNList(data);
		},
		type: 'POST',
		error: function(){
			alert('Get DNList Error!');
		}
	})
};

exports.setDNList = function(data){
	var tmpl = '<div class="row-fluid inner-well">\
                    <div class="span4 x-dntips">\
                        <a href="javascript:;" >%{dname}%</a>\
                        <span class="x-dntype">%{dstatus}%</span>\
                    </div>\
                    <div class="btn-group offset6">\
                        <button data-id="%{dnid}%" class="button black mini x_del">\
                          <i class="icon-remove">\
                          </i>\
                          Delete\
                        </button>\
                    </div>\
                </div>';
	var rsHtml = '';
	stone.each(data.domains, function(){
		var obj = this;
		rsHtml += stone.renderTmpl(tmpl, {
			dname: obj.name,
			dnid: obj.id,
			dstatus: stone.getUpper( obj.status, 0)
		});
	});
	var $listCtn = $('.x_dnlist_ctn');
	$listCtn[0].innerHTML = rsHtml;
	exports.initList($listCtn);
};

exports.initList = function($listCtn){
	$listCtn.delegate('.x_del', 'click', function(event){
		stone.killEvent(event);
		var did = $(this).attr('data-id');
		exports.delDomain(did);
	});
	exports.initList = stone.noop;
};

exports.delDomain = function(did){
	$.ajax({
		url: '/do?way=delDomain',
		data: {
			id: did
		},
		type: 'GET',
		success: function(data){
			console.log(data);
			//if success , refresh list
			data.status.code == 1 ? exports.DNList() : '';
			data.domain = {domain: did};
			//notice
			Notifications.push({
	          imagePath: "/static/admin/images/cloud.png",
	          text: "<p><b>"+data.status.message+"</b></p><div>Domain: "+data.domain.domain+"&nbsp;&nbsp;Code: "+data.status.code+"</div>",
	          autoDismiss: 5
	        });
		},
		error: function(){
			alert('Add Domain Error!');
		}
	});

	return this;	
};
exports.addDomain = function(domainName){
	$.ajax({
		url: '/do?way=addDomain',
		data: {
			domain: domainName
		},
		type: 'GET',
		success: function(data){
			console.log(data);
			//if success , refresh list
			data.status.code == 1 ? exports.DNList() : (data.domain = {domain: domainName}) ;
			//notice
			Notifications.push({
	          imagePath: "/static/admin/images/cloud.png",
	          text: "<p><b>"+data.status.message+"</b></p><div>Domain: "+data.domain.domain+"&nbsp;&nbsp;Code: "+data.status.code+"</div>",
	          autoDismiss: 5
	        });
		},
		error: function(){
			alert('Add Domain Error!');
		}
	});

	return this;
};

exports.initFunc = function(){
	$('#x_addDomain_btn').bind('click', function(event){
		// stone.killEvent(event);
		$(this).prev().trigger('click');
		var dn = $('.x_dname_ctn>input').val();
		exports.addDomain(dn);
	});

	return this;
};


return exports;
});