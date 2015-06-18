'use strict';
let co = require('co');
let debug = require('debug')('crawler');
let freshdesk = require('./remotes/freshdesk.js');
let models = require('./models');

co(function *(){

	yield models.sequelize.sync();

	let result = yield freshdesk.getCategories();
	//console.log(result);

	let categories = result.body.map(function(category) {
		return category.category;
	});

	let folderPromises = categories.reduce(function(prev, category, index, array) {
		return prev.concat(category.folders.filter(function(folder) {
			return folder.visibility !== 3;
		}).map(function(folder) {
			return freshdesk.getFolder(folder);
		}));
	}, []);

	let articles = {};
	let folderResults = yield folderPromises;
	folderResults.forEach(function(folderResult) {
		let folder = folderResult.body.folder;
		//console.log(folder);
		folder.articles.forEach(function(article) {
			articles['FreshDesk_categories/' + folder.category_id + '/folders/' + folder.id + '/articles/' + article.id] = article;				
		});
	});

	console.log(articles);

	// let updatePromises = [];
	// for (let id in articles) {
	// 	updatePromises.push(freshdesk.updateArticle(id, articles[id]));
	// }

	// yield updatePromises;

	yield freshdesk.updateArticles(articles);

	console.log('done!!!!!');

}).catch(function(err) {
	console.error(err.stack);
});
