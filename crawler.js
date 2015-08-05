'use strict';
let co = require('co');
let debug = require('debug')('crawler');
let freshdesk = require('./remotes/freshdesk.js');
let models = require('./models');

co(function *(){

	yield models.Course.sync();

	let result = yield freshdesk.getCategories();
	console.log(result.toJSON());

	let categories = result.body.map((category) => {
		return category.category;
	});

	let folderPromises = categories.reduce((prev, category, index, array) => {
		return prev.concat(category.folders.filter((folder) => {
			return folder.visibility !== 3;
		}).map((folder) => {
			return freshdesk.getFolder(folder);
		}));
	}, []);

	let articles = {};
	let folderResults = yield folderPromises;
	folderResults.forEach((folderResult) => {
		let folder = folderResult.body.folder;
		//console.log(folder);
		folder.articles.forEach((article) => {
			articles['FreshDesk_categories/' + folder.category_id + '/folders/' + folder.id + '/articles/' + article.id] = article;
		});
	});

	yield freshdesk.updateArticles(articles);

	console.log('done!!!!!');
	process.exit();

}).catch(function(err) {
	console.error(err.stack);
});
