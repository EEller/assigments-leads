const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
const port = 3000; //porta padrão
const mysql = require('mysql');
const ipify = require('ipify');
const nodemailer = require('nodemailer');

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//seto a pasta public para pegar os arquivos internos da aplicação
app.use(express.static(__dirname + '/public'));
//app.use('/css', express.static(__dirname + '/public'));

const getClientAddress = require('client-address')

//definindo as rotas
const router = express.Router();
//router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);
// DEFININDO NOSSA ROTA PARA O ANGULARJS/FRONT-END =========
router.get('/', function(req, res) {
	// Carrega nossa view index.html que será a única da nossa aplicação
	// O Angular irá lidar com as mudanças de páginas no front-end
	res.sendFile(__dirname + '/public/index.html');
});
router.get('/contatos', (req, res) =>{
	execSQLQuery('SELECT * FROM Contatos', res);
});
router.post('/contatos', (req, res) =>{
	const nome = req.body.nome.substring(0,150);
	const email = req.body.email.substring(0,150);
	const ip = req.body.ip.substring(0,20);
	const data = req.body.data;
	execSQLQuery(`INSERT INTO Contatos(Nome, Email, IP, Data) VALUES('${nome}','${email}','${ip}', '${data}')`, res);
	sendMail(email, nome, req.body.idEbook);
})

//inicia o servidor
app.listen(port);
console.log('API funcionando!');

function execSQLQuery(sqlQry, res){
	const connection = mysql.createConnection({
		host     : 'mysql857.umbler.com',
		port     : 41890,
		user     : 'gamaroot',
		password : 'greenforcegama',
		database : 'moeda'
	});

	connection.query(sqlQry, function(error, results, fields){
		if(error) 
		res.json(error);
		else
		res.json(results);
		connection.end();
	});
}

function sendMail(dest, nome, id_ebook){
	//moedainteligente@gmail.com
	//senha: greenforcerocks
	
	// Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing
	nodemailer.createTestAccount((err, account) => {

		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			pool: true,
			host: 'smtp.gmail.com',
			port: 465,
			secure: true, // use TLS
			auth: {
				user: 'moedainteligente', // generated ethereal user
				pass: 'wedrgvszhdqdubtn'  // generated ethereal password
			}
		});

		if(id_ebook == 1){
			var anexo = {
				filename: 'E-book_moeda_inteligente.pdf',
				path: 'pdf/E-book_moeda_inteligente.pdf',
				contentType: 'application/pdf'
			}
		} else {
			var anexo = {
				filename: 'E-book_guia_bolso.pdf',
				path: 'pdf/E-book_guia_bolso.pdf',
				contentType: 'application/pdf'
			}
		}

		// setup email data with unicode symbols
		let mailOptions = {
			from: 'moedainteligente@gmail.com', // sender address
			to: dest, // list of receivers
			subject: 'Aqui está o seu Ebook ✔', // Subject line
			text: 'Hello world?', // plain text body
			html: '<div style="text-align: center"><h1>'+ nome +' Gostou do E-book?</h1><h2>Então convide seus amigos para visitar nosso <a href="https://www.moedainteligente.com.br">Blog</a></h2></div>', // html body
			attachments: [anexo]
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: %s', info.messageId);
			// Preview only available when sending through an Ethereal account
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

			// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
			// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
		});
	});
}