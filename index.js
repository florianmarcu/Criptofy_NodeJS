// Node file
// TODO:
// Cerinte Minimale:
/*
-fisier separat JavaScript;		OK
-modificarea stilului unui element sau al unui grup de elemente;	OK
-manevrarea DOM-ului (selectare dupa id, tag, clasa, selectorCSS);  OK
-creare/stergere de elemente;	OK
-folosirea evenimentelor generate de mouse/tastatura;	OK
-modificare de proprietati;	OK
-inputuri functionale (de exemplu: input de tip text/range/number/radio/checkbox, select, textarea); OK
-setTimeout, setInterval. OK
-folosirea localStorage. OK
-elementele de JavaScript sa fie integrate cu sens in cadrul proiectului	OK
*/

var url = require('url');
var getIP = require('ipware')().get_ip;
var formidable = require('formidable');
var rp = require('request-promise');
var path = require('path');
var express = require('express');
var session = require('express-session');
var crypto=require("crypto"); 
var http = require('http');
var fs = require('fs');
var querystring=require('querystring')
var app = express();

app.set('view engine','ejs');
app.use(session({
	secret:"cheie_sesiune",
	resave: true,
	saveUninitialized:false
}))


console.log(__dirname);

app.use(express.static(path.join(__dirname , 'res')));  
app.use(express.static(path.join(__dirname,'uploaded_pics')));

app.get('/', async function(req,res){
	let data = await fetch();
	console.log(data.data);
  	res.render('html/index',{cryptoData: data, user: req.session.user, ip: req.session.ip});
});

app.get('/index', async function(req,res){
	let data = await fetch();
	console.log(data.data);
  	res.render('html/index',{cryptoData: data, user: req.session.user, ip: req.session.ip });
});
// ------

app.get("/signout", function(req,res){
	req.session.destroy();
	res.redirect("/");
})


app.post("/signin", function(req,res){
	//preiau obiectul de tip formular
	var form=new formidable.IncomingForm();
	form.parse(req, function(err, fields, files){

		//proprietatile din fields sunt valorile atributelor name din inputurile formularului
		var continutFisier= fs.readFileSync("users.json");
		var usersJson=JSON.parse(continutFisier);
		var parolaCriptata;
		var algoritmCriptare= crypto.createCipher("aes-128-cbc", "parola_pentru_criptare");
		parolaCriptata=algoritmCriptare.update(fields.password, "utf-8", "hex");
		parolaCriptata+=algoritmCriptare.final("hex");
		//find returneaza primul element pentru care functia data ca parametru returneaza true (e indeplinita conditia de cautare)
		//daca nu gaseste un element cu conditia ceruta returneaza null
		var utiliz = usersJson.users.find(function(user){
			return user.username == fields.username && user.password == fields.password;
		});
		if(utiliz){
			utiliz.logTimes = utiliz.logTimes+1;
			utiliz.lastLog = new Date();
			var newJson= JSON.stringify(usersJson)//opusul lui parse
			fs.writeFileSync("users.json",newJson);
			//aici stim ca s-a logat
			console.log(utiliz.username + "is now logged in");
			req.session.user=utiliz;
			req.session.ip =  getIP(req).clientIp;
			//parametrul al doilea al lui render  contine date de transmis catre ejs
			res.redirect("/index");
		}
	})	
});

app.post('/find',function(req,res){
	var form = formidable.IncomingForm();
	form.parse(req, function(err, fields, files){
		var coinSlug = fields.coinSlug;
		res.redirect("/coin?id="+coinSlug);
	});
})

app.post("/add-to-favorites", function(req,res){
	var form = formidable.IncomingForm();
	form.parse(req, function(err, fields, files){
		var ok = (req.session ? (req.session.user? req.session.user.username :null) : null);
		if(ok){
			
			var urlParsat=url.parse(req.session.current_url);
			var queryiedCoin=querystring.parse(urlParsat.query);
			var fisUseri=fs.readFileSync("users.json");
			var usersJson=JSON.parse(fisUseri);
			var utiliz = usersJson.users.find(function(user){
				return user.id == req.session.user.id;
			});
			if(utiliz){
				utiliz.favorites.push(queryiedCoin.id);
			}
			var newJson= JSON.stringify(usersJson)//opusul lui parse
			fs.writeFileSync("users.json",newJson);
			console.log('DAAAAAAAAAAAAAAAAAAAAAAAAA');
			res.redirect(req.session.current_url);
		}
	});
})

app.post("/register", function(req, res){

	var form=formidable.IncomingForm();
	// req - requestul 
	//parse primeste o functie callback care se executa la finalul parsarii
	form.parse(req, function(err, fields, files){
		var username;
		var path= files.poza? files.poza.name: "";
		console.log(fields)
		//in fields am datele din inputurile de tip text, range, number etc... mai putin file
		//in files am campurile de tip fisier din <input type="file" />
		// in fields o sa avem pe post de campuri(proprietati) valorile din atributele name ale inputurilor din formular
		var fisUseri=fs.readFileSync("users.json");
		var usersJson=JSON.parse(fisUseri);
		var parolaCriptata;
		var algCriptare= crypto.createCipher("aes-128-cbc", "parola_criptare");
		parolaCriptata=algCriptare.update(fields.password, "utf-8", "hex")
		parolaCriptata+=algCriptare.final("hex");
		var newUser={ id: usersJson.usersCount, username:fields.username, password:fields.password, dateCreated:new Date() ,
			lastLog: new Date(), logTimes: 0, path: path, favorites: []}	
		usersJson.usersCount++;
		usersJson.users.push(newUser);
    //opus parse
		var newJson= JSON.stringify(usersJson)//opusul lui parse
		fs.writeFileSync("users.json",newJson);
		req.session.user= newUser;
		res.redirect("/");
	});
	form.on("field", function(name, field){
		if(name=="username")
			username=field;
	});
	form.on('fileBegin', function(name, file){
		//ca sa salvam la locatia dorita setam campul path al lui file
		console.log(file.size);
		if(file && file.name!=""){
			if(!fs.existsSync(__dirname+"/uploaded_pics/"+username)){
				fs.mkdirSync(__dirname+"/uploaded_pics/"+username);
			}
			file.path=__dirname+"/uploaded_pics/"+username+"/"+file.name
			console.log(file.path)
		}
	})
	form.on('file',function(name, file){
		console.log("UPLOAD CONFIRMED");
	} )
})


app.get("/coin", async function(req, res) {
	//var coin=(req.session? (req.session.utilizator? req.session.utilizator.username: null) :null);

	//if(req.session && req.session.utilizator && req.session.utilizator.rol=="admin"){
		//console.log(req.url)
	var ok = (req.session ? (req.session.user? req.session.user.username :null) : null);
	if(ok){
		var urlParsat=url.parse(req.url);
		var queryiedCoin=querystring.parse(urlParsat.query)
		console.log(urlParsat)	
		console.log("----------------")
		//console.log(obQuery)
		//afiseJSaza(render) pagina folosind ejs (deoarece este setat ca view engine)
		console.log("pagina generata:" ,req.url);
		//de aici populam pagina cu datele userului
			//fisUseri --- continutul lui useri.json
		//var obUseri=JSON.parse(fisUseri);
		var cryptoData = await fetch();
		var coin=cryptoData.data.find(function(elem){
			return elem.slug==queryiedCoin.id;
		});
		console.log(coin);
		req.session.current_url = req.url.toString();
		res.render('html/coin',{coin:coin});
	}
	else{
		res.redirect('html/error');
	}	
	
});



function similar_text(first, second, occs) {
  
	if (first === null || second === null || typeof first === 'undefined' || typeof second === 'undefined') {
	  return 0;
	}
	
	var counter = 0;
	for(let i = 0; i <first.length; i++)
		for(let j = i; j<second.length; j++){
			if(first[i] == second[j])
				counter += 1;

		}
	return counter; 
  }

app.get("/*",function(req, res){
	
	console.log("============================");
	console.log(req.url);
	//err este null daca randarea s-a terminat cu succes, si contine eroarea in caz contrar (a survenit o eroare)
	//rezRandare - textul in urma randarii (compilarii din ejs in html)
	var un= req.session? (req.session.utilizator? req.session.utilizator.username: null)  :  null; 

	res.render("html"+req.url, {username: un}, function(err, rezRandare){
		if (err){
			if(err.message.includes("Failed to lookup view")){
				var pageQueryied = fs.readdirSync(__dirname+"/views/html");
				console.log(pageQueryied+"NUUUUUUUUUUUUUU");
				var text ="";
				var newUrl = req.url.slice(1);
				for(let file of pageQueryied)
					if(similar_text(newUrl, file.substr(0,file.length-5)) >=4 ){
						text += file.substr(0,file.length-4) + ' ';
					}
				console.log(text);
				res.status(404).render("html/error", {username: un,text: text});
			}
			else{
				throw err;
			}
		}
		else{
			res.send(rezRandare);
		}
	});
})


const server = http.createServer(app);

/// TODO: Rezolvat problema cu view urile
/// TODO: Inteles ejs, si app.set,get, etc

app.listen(8080);

function fetch(){
  const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    qs: {
      'start': '1',
      'limit': '50',
      'convert': 'USD'
    },
    headers: {
      'Accepts': 'application/json',
      'X-CMC_PRO_API_KEY': '3f4e05bd-c7ca-4420-8f9e-77853130e4cf'
    },
    json: true,
    gzip: true
  };

  var apiResponse;

  return rp(requestOptions).then(response => {
    console.log('API call response:', response);
    return response;
  }).catch((err) => {
    console.log('API call error:', err.message);
    return err.message;
  });
}


