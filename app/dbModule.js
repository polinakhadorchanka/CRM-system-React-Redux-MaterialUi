const sql = require('mssql')
let fs = require("fs");

const config= {
	user: 'nodejs',
	password: 'nodejs',
	server: 'hyper2',
	database: 'BORODICH',
	port: 49438
};

module.exports.getData = async function(am, date) {
	return new Promise(function(resolve, reject) {
		sql.connect(config).then(function() {
			let myJsonDate = JSON.parse(date);
			if (am == 10){
				let obj = new sql.Request().query(`select * from getData(${am})`).then(function (result) {
					sql.close(function (err) {
						if (err) {
							return console.log("Ошибка: " + err.message);
						}
						resolve(result.recordset);
						console.log("Подключение закрыто");
					});
				}).catch(function (err) {
					console.dir(err);
				});
			}
			else {
				let obj = new sql.Request().query(`select * from getDataDate(${am},\'${myJsonDate.date}\')`).then(function (result) {
					sql.close(function (err) {
						if (err) {
							return console.log("Ошибка: " + err.message);
						}
						let obj = result.recordset.splice(0,am-10);
						resolve(result.recordset);
						console.log("Подключение закрыто");
					});
				}).catch(function (err) {
					console.dir(err);
				});
			}
		}).catch(function(err) {
			console.dir(err);
		});
	})
};

module.exports.getAmount = async function(date) {
	return new Promise(function(resolve, reject) {
		sql.connect(config).then(function() {
			let myJsonDate = JSON.parse(date);
			let obj = new sql.Request().query(`select count(*) as count from Vacancy where DbAddingDate>\'${myJsonDate.date}\'`).then(function(result) {
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

module.exports.getAmountLeft = async function(date) {
	return new Promise(function(resolve, reject) {
		sql.connect(config).then(function() {
			let myJsonDate = JSON.parse(date);
			console.log(date);
			console.log(myJsonDate);
			let obj = new sql.Request().query(`select count(*) as count from Vacancy where DbAddingDate<\'${myJsonDate.date}\'`).then(function(result) {
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

module.exports.getNewData = async function(date) {
	return new Promise(function(resolve, reject) {
		sql.connect(config).then(function() {
			let myJsonDate = JSON.parse(date);
			let obj = new sql.Request().query(`select * from getNewData(\'${myJsonDate.date}\')`).then(function(result) {
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