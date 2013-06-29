var index = require('./controller/index');

module.exports = {
	'/': index.page,
    '/do': index.do,


    //404==============================
    // '*': admin.error_404
};