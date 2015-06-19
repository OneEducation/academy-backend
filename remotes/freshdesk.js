'use strict';

let request = require('co-request');
let models = require('../models');
let AUTH_TOKEN = 'Basic ' + new Buffer("bMy69uRNurJKkeOtVg:x").toString('base64');

module.exports = {
	getCategories: function () {
    
    let options = {
      uri: 'https://oneedu.freshdesk.com/solution/categories.json',
      method: 'GET',
      json: true,
      headers: {
        'Authorization': AUTH_TOKEN
      }
    };

    console.log(options);

    return request(options);
	},

	getFolder: function (folder) {

		let options = {
      uri: 'https://oneedu.freshdesk.com/solution/categories/' + folder.category_id + '/folders/' + folder.id + '.json',
      method: 'GET',
      json: true,
      headers: {
        'Authorization': AUTH_TOKEN
      }
    };

    console.log(options);

    return request(options);
	},

	getArticle: function (id) {
		let url = id.replace('FreshDesk_', 'https://oneedu.freshdesk.com/solution/') + '.json';
		console.log(url);

		let options = {
      uri: url,
      method: 'GET',
      json: true,
      headers: {
        'Authorization': AUTH_TOKEN
      }
    };

    return request(options);
	},

	updateArticle: function *(id) {
		console.log('Downloading: ' + id);
		let response = yield this.getArticle(id);
		let article = response.body.article;

		console.log('Updating: ' + response.request.href + ' / ' + article.title);

		let course = {
	    id: id,
	    title: article.title,
	    content: article.description,
	    updatedAt: article.updated_at,
	    content_url: null,
	    thumbnail_url: null,
	    description: null,
	    point: 5,
	    category: null,
	    type: 'article',
	    original_url: response.request.href
		};

		console.log(article.tags);
		article.tags.forEach((tag) => {
			let meta = tag.name.split(':');
			console.log(meta);

			if (meta[0] in course) {
				course[meta[0]] = meta[1];
			}
		});

		console.log(course.category);
		if (course.category) {
			
			yield models.Course.upsert(course);
		}
	},

	updateArticles: function *(remoteArticles) {
		let updateNeeds = {};
		let promises = [];
		let localCourses = yield models.Course.findAll();

		localCourses.forEach((localCourse) => {
			let remoteArticle = remoteArticles[localCourse.id];
			if (remoteArticle) {
				delete remoteArticles[localCourse.id];

				console.log('Local: ' + localCourse.get('updatedAt') + ' / remote: ' + remoteArticle.updated_at);
				
				if (Date.parse(localCourse.get('updatedAt')) === Date.parse(remoteArticle.updated_at)) {
					console.log('Skip');
					return;
				}
				promises.push(this.updateArticle(localCourse.id, remoteArticle));
				
			} else {
				promises.push(models.Course.destroy({
					where: {
						id: localCourse.id
					}
				}));
			}
		});

		for (let id in remoteArticles) {
			promises.push(this.updateArticle(id));
		}

		yield promises;
	}
};