var express = require('express');
var app = express();
var path = require('path');
var apnagent = require('apnagent');

var agent = new apnagent.Agent();

agent.set('cert file', path.join(__dirname, 'certs/RobertKuoCert.pem')).set('key file', path.join(__dirname, 'certs/RobertKuoKey.pem'));

agent.enable('sandbox');

agent.connect(function (err) {

  if (err && err.name === 'GatewayAuthorizationError') {
    console.log('Authentication Error: %s', err.message);
    process.exit(1);
  }

  else if (err) {
    throw err;
  }

  var env = agent.enabled('sandbox')? 'sandbox' : 'production';

  console.log('apnagent [%s] gateway connected', env);

});

agent.on('message:error', function (err, msg) {
    console.log('the error is [%s]',msg);
});

var notification = agent.createMessage()
  .device('9156af6693cab6f4b6c0d1a73432fea9cde30e6e825f2be33b814f99c2e42dbb')
  .sound('default')
  .alert('Heck yeah!');

app.get('/', function(req,res) {

    res.send('sent!');

    notification.send();

});

var server = app.listen(1338, function() {
    console.log('Listening on port %d', server.address().port);
});
