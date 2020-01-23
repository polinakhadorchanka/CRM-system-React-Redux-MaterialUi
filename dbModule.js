const sql = require('mssql')
let fs = require("fs");

const config= {
	user: 'nodejs',
	password: 'nodejs',
	server: 'hyper2',
	database: 'BORODICH',
	port: 49438
};

module.exports.getData = async function() {
	return new Promise(function(resolve, reject) {
		sql.connect(config).then(function() {
			let obj = new sql.Request().query('select * from getData()').then(function(result) {
				sql.close(function(err) {
					if (err) {
						return console.log("Ошибка: " + err.message);
					}
					resolve(result.recordset);
					console.log("Подключение закрыто");
				});
			}).catch(function(err) {
				console.dir(err);
			});
		}).catch(function(err) {
			console.dir(err);
		});
	})
};

module.exports.getAmount = async function() {
	return new Promise(function(resolve, reject) {
		sql.connect(config).then(function() {
			let data = fs.readFileSync("lastNoteDateTime.json", "utf8");
			let myJson1 = JSON.parse(data);
			console.log(myJson1.date);
			let obj = new sql.Request().query('select count(*) as count from Vacancy where DbAddingDate>\''+myJson1.date+'\'').then(function(result) {
				sql.close(function(err) {
					if (err) {
						return console.log("Ошибка: " + err.message);
					}
					console.log(result.recordset);
					resolve(result.recordset);
					console.log("Подключение закрыто");
				});
			}).catch(function(err) {
				console.dir(err);
			});
		}).catch(function(err) {
			console.dir(err);
		});
	})
};