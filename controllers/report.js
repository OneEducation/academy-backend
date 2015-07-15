"use strict";

let api_key = 'key-0819284b44d9c7fea77483dd3ea5e422';
let domain = 'mg.one-education.org';
let mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
let request = require('co-request');
var debug = require('debug')('report_controller');
var Models = require('../models');
var Report = Models.Report;
var ReportItem = Models.Item;
var ReportVerifier = Models.Verifier;
var Reporter = Models.Reporter;

let Teacher = require('../models/xo_id').Teacher;

function sendMail(recipients, subject, body) {

  let data = {
    //Specify email data
    from: 'One_Academy <academy@one-education.org>',
    //The email to contact
    to: recipients,
    //Subject and text data  
    subject: subject,
    html: body
  }

  console.log(data);

  //Invokes the method to send emails given the above data with the helper library
  mailgun.messages().send(data, function (err, body) {
    //If there is an error, render the error page
    if (err) {
      //res.render('error', { error : err});
      console.log("got an error: ", err);
    }
    //Else we can greet    and leave
    else {
      //Here "submitted.jade" is the view file for this landing page 
      //We pass the variable "email" from the url parameter in an object rendered by Jade
      //res.render('submitted', { email : req.params.mail });
      console.log(body);
    }
  });
}

function *sendMailToVerifiers(verifiers) {
  let teachers = yield verifiers.map((verifier) => {
    return Teacher.findById(verifier.get('xo_uuid').split('_')[1]);
  });

  console.log(teachers);
  
  teachers.forEach((teacher) => {
    teacher && sendMail(teacher.get('email'), 'Academy task verification requested.', '<strong> \
      <span style="font-size: 14px;">Hi, ' + teacher.get('first_name') + ' ' + teacher.get('last_name') + '</span>\
      </strong>\
      <br/>\
      <br/>\
      <p style="font-size: 14px;">You have received requests to verify for Academy tasks.\
      <br/>\
      <br/>\
      </p>\
      <p style="font-size: 14px;">Use Academy app to verify them on your XO.</p>'
    );
  });  
}

module.exports = {
  create: function *(next) {
    let data = this.request.body;
    debug(data);

    let report = yield Report.create(data);

    let reporter = yield Reporter.findOrCreate({
      where: {
        xo_uuid: data.Reporter.xo_uuid
      },
      defaults: data.Reporter
    });
    yield report.setReporter(reporter[0]);

    let verifiers = (yield data.verifiers.map(verifier => 
      ReportVerifier.findOrCreate({where: {xo_uuid: verifier.xo_uuid}})
    )).map(result => result[0]);

    debug(verifiers);

    let items = yield data.report_items.map(item => ReportItem.create(item));

    // set verifiers for each items
    yield items.map(item => item.setVerifiers(verifiers));

    debug(items);
    yield report.setItems(items);

    this.body = report;

    let options = {
      uri: 'https://gcm-http.googleapis.com/gcm/send',
      method: 'POST',
      json: true,
      headers: {
        'Authorization': 'key= AIzaSyBwfQhNExkKKIxgVhZAWLu2mJ_d1zdj1gg'
      },
      body: {
        data: {
            "title": "Verification request",
            "text": reporter[0].name + ' requested ' + items.length + ' items.'
        },
        registration_ids: verifiers.map(verifier => verifier.gcm_token)
      }
    };
    console.log(options);

    let result = yield request(options);
    //console.log('GCM result: ', result);
    console.log('Body: ', result.body);

    //yield sendMailToVerifiers(verifiers);

    yield next;
  }
}