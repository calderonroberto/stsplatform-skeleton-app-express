var express = require('express');
var sts = require('stsplatform');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();
app.use('/', express.static(__dirname + '/public'));
app.use(cookieParser('averysecretestring-sdfwe1#$%F@!#F'));

app.get('/data', function (req, res) {
  if (!req.cookies.key_id) {
    res.send('You must set your credentials');
  } else {
    var response = sts_data_resource(req).get({beforeE:1}).then(function(response){
      res.send(JSON.stringify(response.data));
    });
  }
});

app.post('/data', urlencodedParser, function(req, res){
  if (!req.cookies.key_id) {
    res.send('You must set your credentials');
  } else {
    var response = sts_data_resource(req).post({value:req.body.value}).then(function(response){
      res.send("Value "+req.body.value+" sent to wotkit, received code "+response.code);
    });
  }
});

app.post('/auth', urlencodedParser, function(req, res){
  var minute=60*1000, hour=minute*60, day=hour*24;
  res.cookie('key_id', req.body.key_id, { maxAge: day });
  res.cookie('key_password', req.body.key_password, { maxAge: day });
  res.cookie('sensor_name', req.body.sensor_name, { maxAge: day });
  res.send('Credentials Set');
});

function sts_data_resource(req){
  var client = new sts.Client(
    {auth:{
      key_id:req.cookies.key_id,
      key_password:req.cookies.key_password
      }
    }
  );
  sensor = new sts.Sensors(client,req.cookies.sensor_name);
  return new sts.Data(sensor);
}

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
