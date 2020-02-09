const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

// Create connection
// const db = mysql.createConnection({
//     host: 'localhost',
//     user : 'root',
//     password : '',
//     database : 'klimadaten'
// });

const db = mysql.createConnection({
    host: '64.227.57.177',
    user : 'root',
    password : 'guitarra5',
    database : 'klimadaten'
});

//Connect
db.connect((err) => {
    if(err){
       console.log(err);
    } else {
        console.log("mysql connected")
    }
});

const app = express();

const allowedOrigins = [
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100'
  ];

  // Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    }
  }

  
// Enable preflight requests for all routes
app.options('*', cors(corsOptions));


app.get('/getparameter',cors(corsOptions), (req, res) => {
    let sql = 'SELECT * from parameter_klima';
    db.query(sql, (err, result) => {
        if(err){
            // console.log(err);
            // console.log('Database Nou get');
            // res.send('Database No get');
            res.send(err);
        } else{
            // console.log(result);
            // console.log('Database get');
            // res.send('Database we get');
            res.send(result);
        }
    })
})

app.get('/getparameter/txk',cors(corsOptions), (req, res) => {
    let sql = 'SELECT b.stationsname,a.txk, DATE_FORMAT(a.mess_datum, "%d.%m.%Y  ") as mess_datum from produkt_klima_tag a join stationsname b on a.stations_id = b.stations_id';
    db.query(sql, (err, result) => {
        if(err){
            res.send(err);
        } else{
            console.log(result);
            res.send(result);
        }
    })
});

app.get('/getparameter/txk/:von_datum',cors(corsOptions), (req, res) => {
    var id = req.params.von_datum;
    
    console.log(id)
    console.log("nur eins")
    let sql = `SELECT b.stationsname,a.txk, DATE_FORMAT(a.mess_datum, "%d-%m-%Y  ") as mess_datum 
    from produkt_klima_tag a 
    join stationsname b on a.stations_id = b.stations_id
    where a.mess_datum >= '`+id + `'`;
    db.query(sql, (err, result) => {
        if(err){
            res.send(err);
        } else{
            // console.log(result);
            res.send(result);
        }
    })
});


app.get('/getparameter/txk/between/:von_datum/:bis_datum',cors(corsOptions), (req, res) => {
    var von_datum = req.params.von_datum;
    
    var bis_datum = req.params.bis_datum;
    console.log(von_datum)
    console.log(bis_datum)
    console.log("bisDatum")
    let sql = `SELECT b.stationsname,a.txk, DATE_FORMAT(a.mess_datum, "%d-%m-%Y  ") as mess_datum 
    from produkt_klima_tag a 
    join stationsname b on a.stations_id = b.stations_id
    where a.mess_datum >= '`+von_datum + `'
    and a.mess_datum <='`+bis_datum +`'` ;
    db.query(sql, (err, result) => {
        if(err){
            res.send(err);
        } else{
            // console.log(result);
            res.send(result);
        }
    })
});

app.get('/getparameter/txk/parameters/:params/:von_datum/:bis_datum',cors(corsOptions), (req, res) => {
    console.log("bisDatum")
    console.log(req.params.params)
    let stringRestQuery = "";
    let stringRestQueryColumn = "";
    let selectedParams = JSON.parse(req.params.params);
    selectedParams.forEach(function(data) {
        console.log(data);
        stringRestQueryColumn += `,a.`+ data+ ``;
        // stringRestQuery += ` and a.`+ data+ `=`;
    })
    
    var von_datum = req.params.von_datum;
    
    var bis_datum = req.params.bis_datum;
    console.log(req.params.params);

    let sql = `SELECT b.stationsname, DATE_FORMAT(a.mess_datum, "%d-%m-%Y ") as mess_datum `+stringRestQueryColumn +`
    from produkt_klima_tag a 
    join stationsname b on a.stations_id = b.stations_id
    where a.mess_datum >= '`+von_datum + `'
    and a.mess_datum <='`+bis_datum +`'` ;
    db.query(sql, (err, result) => {
        if(err){
            res.send(err);
        } else{
            // console.log(result);
            res.send(result);
        }
    })
});

// $data = DB::table('produkt_klima_tag')
                
// ->join('stationsname', 'produkt_klima_tag.stations_id', '=', 'stationsname.stations_id')
// ->select('produkt_klima_tag.*','stationsname.stationsname')
// ->where('produkt_klima_tag.TXK','>=',0)
// ->whereDate('produkt_klima_tag.mess_datum','>=',$request->von_Datum)
// ->whereDate('produkt_klima_tag.mess_datum','<=',$request->bis_Datum)->paginate(10);


app.listen('3000', () =>{
    console.log("Server started in port 3000");
})