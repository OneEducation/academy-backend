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
    console.log('Downloading: ' + url);

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
    let response = yield this.getArticle(id);
    let article = response.body.article;
    let course = {
      id: id,
      title: article.title,
      content: article.description,
      updatedAt: article.updated_at,
      content_url: null,
      thumbnail_url: null,
      description: null,      
      original_url: response.request.href,
      // tags {
      point: 5,
      category: null,
      type: 'article',
      teacher_only: false,
      action: null
      // }
    };

    console.log('Download done: ' + id);
    console.log(article.tags);
    article.tags.forEach((tag) => {
      let meta = tag.name.split(':');
      console.log(meta);

      switch (meta[0]) {
        case 'point':
        case 'category':
        case 'type':
        case 'action':
          course[meta[0]] = meta[1];
          break;

        case 'teacher_only':
          course[meta[0]] = true;
          break;
      };
    });

    if (course.category) {
      console.log('Category: ' + course.category);
      yield models.Course.upsert(course);
    } else {
      console.log('No Category, skipping it.');
    }
  },

  updateArticles: function *(remoteArticles) {
    let updateNeeds = {};
    let promises = [];
    let localCourses = yield models.Course.findAll();

    localCourses.forEach(function(localCourse) {
      let remoteArticle = remoteArticles[localCourse.id];
      if (remoteArticle) {
        delete remoteArticles[localCourse.id];

        let localUpdateAt = localCourse.get('updatedAt');
        let remoteUpdateAt = remoteArticle.updated_at;
        console.log('Article: ' + localCourse.id);
        console.log('Local: ' + localUpdateAt + ' / remote: ' + remoteUpdateAt);
        
        if (Date.parse(localUpdateAt) === Date.parse(remoteUpdateAt)) {
          console.log('No need to update, skipping it.');
          return;
        }
        promises.push(this.updateArticle(localCourse.id));
        
      } else {
        promises.push(models.Course.destroy({
          where: {
            id: localCourse.id
          }
        }));
      }

      console.log('----------------------');

    }.bind(this));

    for (let id in remoteArticles) {
      promises.push(this.updateArticle(id));
    }

    yield promises;
  }
};