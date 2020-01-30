const sql = require('mssql')
let fs = require("fs");

// const config= {
// 	user: 'nodejs',
// 	password: 'nodejs',
// 	server: 'hyper2',
// 	database: 'BORODICH',
// 	port: 49438
// };

const config= {
	user: 'user001',
	password: '12345',
	server: '127.0.0.1',
	database: 'test',
	port: 1433
};

module.exports.getData = async function(am, date) {
	return new Promise(function(resolve, reject) {
		sql.connect(config).then(function() {
			let myJsonDate = JSON.parse(date);
			if (am == 10){
				let obj = new sql.Request().query(`select top(${am}) Vacancy.Id as vacancyId,url,position,location,Description,CONVERT(nvarchar(10), 
				SiteAddingDate, 104) as SiteAddingTime, Name as company_name,Website,Country as country,Type as type, DbAddingDate as DBAddingTime from Vacancy inner join
				Company on Company.Id = Vacancy.CompanyId order by Vacancy.DbAddingDate DESC, Vacancy.Url`).then(function (result) {
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
				let obj = new sql.Request().query(`select top(${am}) Vacancy.Id as vacancyId,url,position,location,Description,CONVERT(nvarchar(10), 
				SiteAddingDate, 104) as SiteAddingTime, Name as company_name,Website,Country as country,Type as type, DbAddingDate as DBAddingTime from Vacancy,
				Company where Vacancy.CompanyId = Company.Id and DbAddingDate <= \'${myJsonDate.date}\' order by Vacancy.DbAddingDate DESC, 
				Vacancy.Url`).then(function (result) {
					sql.close(function (err) {
						if (err) {
							return console.log("Ошибка: " + err.message);
						}
						let obj = result.recordset.slice(am-10);
						resolve(obj);
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