const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const { Query } = require('pg')
const port = 3001
var request = require('request');
var MongoClient = require('mongodb').MongoClient;
const Pool = require('pg').Pool

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'timeseries',
  password: 'postgres',
  port: 5432,
})

var cors = require('cors')
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

mongoip ="localhost"
orionip = "localhost"



app.get('/fiware/orion/getentity/:ename',function(req,res){
    const param =req.params.ename
    url ='http://localhost:1026/v2/entities/'+param,
    console.log(url)
    var options = {
      'method': 'GET',
      'url': url,
      'headers':{}
    };

    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
      values = JSON.parse(response.body);
      res.status(200).json(values)
    });
})

app.post('/fiware/orion/createentity',function(req,res){

  console.log(req.body)
  var options = {
    'method': 'POST',
    'url': 'http://137.135.116.1:1026/v2/entities',
    'headers':{'Content-Type': 'application/json'},
    body :JSON.stringify(req.body)
  }

  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
        res.status(201).json(response.body)

  });
})



app.get('/fiware/orion/getdata/:ename',function(req,res){
  const param =req.params.ename
url ='http://localhost:1026/v2/entities/'+param,
  console.log(url)
    var options = {
      'method': 'GET',
      'url': url,
      'headers':{}
    };

    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
values = JSON.parse(response.body);
    res.status(200).json(values)

    });


})





app.get('/fiware/cynus/getdata/:ename',function(req,res){
  const param ='sth_/_'+req.params.ename

  console.log(param)
  var url = "mongodb://"+mongoip+":27017/"

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("sth_default");
  //  var query = { attrName: 'WindSpeed'};
    dbo.collection(param).find().toArray(function(err, result) {
      if (err) throw err;
  console.log(result);
 // values = JSON.parse(result);
  res.status(200).json(result)
      db.close();
    });
  });

})


app.post('/fiware/createentity',function(req,res){
  console.log(req.body)
  let fiware_service_ls ;
  let fiware_servicepath_ls ;
  if(req.body.fiware_service == ''){
    fiware_service_ls = ''
    }else{
       fiware_service_ls = req.body.fiware_service
     }
  if(req.body.fiware_servicepath == ''){
    fiware_servicepath_ls = '/'
   }else{
    fiware_servicepath_ls = req.body.fiware_servicepath
   }
    let bodyJSON = {
     "devices": [
       {
         "device_id":   req.body.device_id,
         "entity_name": req.body.entity_name,
         "entity_type": req.body.entity_type,
         "timezone":   req.body.time_zone,
         "attributes": [
           { "object_id": req.body.atrribute_object, "name":req.body.attribute_name, "type":req.body.attribute_type}
          ],
          "static_attributes": [
             {"name":"refStore", "type": "Relationship","value": "urn:ngsi-ld:Store:001"}
          ]
       }
     ]
    }
    console.log(bodyJSON)
    console.log({'Content-Type': 'application/json','fiware-service': fiware_service_ls,'fiware-servicepath': fiware_servicepath_ls})
    var options = {
      'method': 'POST',
      'url': 'http://'+orionip+':1026/v2/entities',
      'headers':{'Content-Type': 'application/json','fiware-service': fiware_service_ls,'fiware-servicepath': fiware_servicepath_ls},
      body :JSON.stringify(bodyJSON)
    }
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
      res.status(201).json('Created')
    });
  })




  app.post('/fiware/agent/createentity',function(req,res){

    console.log(req.body)
    let fiware_service_ls ;
    let fiware_servicepath_ls ;

     if(req.body.fiware_service == ''){
         fiware_service_ls = ''
     }else{
       fiware_service_ls = req.body.fiware_service
     }

     if(req.body.fiware_servicepath == ''){
       fiware_servicepath_ls = '/'
   }else{
     fiware_servicepath_ls = req.body.fiware_servicepath
   }


    let bodyJSON = {
     "devices": [
       {
         "device_id":   req.body.device_id,
         "entity_name": req.body.entity_name,
         "entity_type": req.body.entity_type,
         "timezone":   req.body.time_zone,
         "attributes": [
           { "object_id": req.body.atrribute_object, "name":req.body.attribute_name, "type":req.body.attribute_type}
          ],
          "static_attributes": [
             {"name":"refStore", "type": "Relationship","value": "urn:ngsi-ld:Store:001"}
          ]
       }
     ]
    }

    console.log(bodyJSON)
    console.log({'Content-Type': 'application/json','fiware-service': fiware_service_ls,'fiware-servicepath': fiware_servicepath_ls})

    var options = {
      'method': 'POST',
      'url': 'http://localhost:4041/iot/devices',
      'headers':{'Content-Type': 'application/json','fiware-service': fiware_service_ls,'fiware-servicepath': fiware_servicepath_ls},
      body :JSON.stringify(bodyJSON)

    }

    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
      res.status(201).json('Created')
    });
  })






app.get('/fiware/getentity',function(req,res){

  var options = {
    'method': 'GET',
    'url': 'http://'+orionip+':1026/v2/entities',
    'headers': {
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  values = JSON.parse(response.body);
    res.status(200).json(values)

  });

})







app.get('/fiware/northweatherstation',function(req,res){

  var options = {
    'method': 'GET',
    'url': 'http://'+orionip+':1026/v2/entities/urn:ngsi-ld:North_WeatherStation',
    'headers': {
      'fiware-service': 'WeatherDepartment',
      'fiware-servicepath': '/'
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    values = JSON.parse(response.body);
    res.status(200).json(values)
  });

})




app.get('/fiware/cynus/temperature',function(req,res){
  var url = "mongodb://"+mongoip+":27017/";

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("sth_weatherdepartment");
    var query = { attrName: 'Temperature'};
    dbo.collection("sth_/_urn:ngsi-ld:North_WeatherStation_WeatherStation").find(query).toArray(function(err, result) {
      if (err) throw err;
  console.log(result);
 // values = JSON.parse(result);
  res.status(200).json(result)
      db.close();
    });
  });

})



app.get('/fiware/cynus/humidity',function(req,res){
  var url = "mongodb://"+mongoip+":27017/"

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("sth_weatherdepartment");
    var query = { attrName: 'Humidity'};
    dbo.collection("sth_/_urn:ngsi-ld:North_WeatherStation_WeatherStation").find(query).toArray(function(err, result) {
      if (err) throw err;
  console.log(result);
 // values = JSON.parse(result);
  res.status(200).json(result)
      db.close();
    });
  });

})


app.get('/fiware/cynus/airquality',function(req,res){
  var url = "mongodb://"+mongoip+":27017/"

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("sth_weatherdepartment");
    var query = { attrName: 'Air Quality'};
    dbo.collection("sth_/_urn:ngsi-ld:North_WeatherStation_WeatherStation").find(query).toArray(function(err, result) {
      if (err) throw err;
  console.log(result);
 // values = JSON.parse(result);
  res.status(200).json(result)
      db.close();
    });
  });

})


app.get('/fiware/cynus/windspeed',function(req,res){
  var url = "mongodb://"+mongoip+":27017/"

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("sth_weatherdepartment");
    var query = { attrName: 'WindSpeed'};
    dbo.collection("sth_/_urn:ngsi-ld:North_WeatherStation_WeatherStation").find(query).toArray(function(err, result) {
      if (err) throw err;
  console.log(result);
 // values = JSON.parse(result);
  res.status(200).json(result)
      db.close();
    });
  });

})




app.get('/fiware/southweatherstation',function(req,res){

  var options = {
    'method': 'GET',
    'url': 'http://52.165.150.86:1026/v2/entities/urn:ngsi-ld:South_WeatherStation',
    'headers': {
      'fiware-service': 'WeatherDepartment',
      'fiware-servicepath': '/'
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    values = JSON.parse(response.body);
    res.status(200).json(values)
  });

})


app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})