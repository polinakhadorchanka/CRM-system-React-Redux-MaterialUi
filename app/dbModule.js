const sql = require('mssql')
let fs = require("fs");

const config= {
	user: 'nodejs',
	password: 'nodejs',
	server: 'DBServer1',
	database: 'BORODICH',
	port: 50100
};

module.exports.getData = async function(id, filter) {
	return new Promise(function(resolve, reject) {
		let usQuery;
		// filter ++
		sql.connect(config).then(function() {
			if(id == 'undefined') {
				if(filter == `all`){
					usQuery = `select top(10) Vacancy.Id as vacancyId, url, position, location, Description as description,convert(nvarchar(10),SiteAddingDate,104) as siteAddingDate,
	 				 Name as companyName, website, Country as country,Type as type, DbAddingDate as DBAddingTime, isViewed, isFavorite, isRemoved from Vacancy, Company
	  				  where Company.Id = Vacancy.CompanyId and isRemoved = 0 order by Vacancy.DbAddingDate DESC, Vacancy.Url, position`;
				} else if(filter == `unviewed`) {
					usQuery = `select top(10) Vacancy.Id as vacancyId, url, position, location, Description as description,convert(nvarchar(10),SiteAddingDate,104) as siteAddingDate,
	 				 Name as companyName, website, Country as country,Type as type, DbAddingDate as DBAddingTime, isViewed, isFavorite, isRemoved from Vacancy, Company
	  				  where Company.Id = Vacancy.CompanyId and isRemoved = 0 and isViewed = 0 order by Vacancy.DbAddingDate DESC, Vacancy.Url, position`;
				} else {
					usQuery = `select top(10) Vacancy.Id as vacancyId, url, position, location, Description as description,convert(nvarchar(10),SiteAddingDate,104) as siteAddingDate,
	 				 Name as companyName, website, Country as country,Type as type, DbAddingDate as DBAddingTime, isViewed, isFavorite, isRemoved from Vacancy, Company
	  				  where Company.Id = Vacancy.CompanyId and isRemoved = 0 and isFavorite = 1 order by Vacancy.DbAddingDate DESC, Vacancy.Url, position`;
				}
			} else{
				if(filter == `all`){
					usQuery = `select * from testF1(\'${id}\') where isRemoved = 0 order by DBAddingTime DESC, url, position`;
				} else if(filter == `unviewed`) {
					usQuery = `select * from testF1(\'${id}\') where isRemoved = 0 and isViewed = 0 order by DBAddingTime DESC, url, position`;
				} else {
					usQuery = `select * from testF1(\'${id}\') where isRemoved = 0 and isFavorite = 1 order by DBAddingTime DESC, url, position`;
				}
			}
			let obj = new sql.Request().query(usQuery).then(function (result) {
				sql.close(function (err) {
					if (err) {
						return console.log("Ошибка: " + err.message);
						reject("Ошибка: " + err.message);
					}
					resolve(result.recordset);
					console.log("Подключение закрыто");
				});
			}).catch(function (err) {
				console.dir(err);
			});
		}).catch(function(err) {
			console.dir(err);
		});
	})
};

module.exports.getAmount = async function(id, filter) {
	// filter ++
	return new Promise(function(resolve, reject) {
		let usQuery;
		sql.connect(config).then(function() {
			if(filter == `all`){
				usQuery = `select dbo.testF3 (\'${id}\',\'all\') as count`;
			} else if(filter == `unviewed`) {
				usQuery = `select dbo.testF3 (\'${id}\',\'unviewed\') as count`;
			} else {
				usQuery = `select dbo.testF3 (\'${id}\',\'favorite\') as count`;
			}
			let obj = new sql.Request().query(usQuery).then(function(result) {
				sql.close(function(err) {
					if (err) {
						return console.log("Ошибка: " + err.message);
						reject("Ошибка: " + err.message);
					}
					console.log(result);
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

module.exports.getAmountLeft = async function(id,filter) {
	// filter
	return new Promise(function(resolve, reject) {
		let usQuery;
		sql.connect(config).then(function() {
			console.log(id);
			if(filter == `all`){
				usQuery = `select dbo.testF2 (\'${id}\',\'all\') as count`;
			} else if(filter == `unviewed`) {
				usQuery = `select dbo.testF2 (\'${id}\',\'unviewed\') as count`;
			} else {
				usQuery = `select dbo.testF2 (\'${id}\',\'favorite\') as count`;
			}
			let obj = new sql.Request().query(usQuery).then(function(result) {
				sql.close(function(err) {
					if (err) {
						return console.log("Ошибка: " + err.message);
						reject("Ошибка: " + err.message);
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

module.exports.getNewData = async function(date,filter) {
	return new Promise(function(resolve, reject) {
		let usQuery;
		sql.connect(config).then(function() {
			let myJsonDate = JSON.parse(date);
			if(filter == `all`){
				usQuery = `select * from testF4(\'${id}\') where isRemoved = 0 order by DBAddingTime DESC, url, position`;
			} else if(filter == `unviewed`) {
				usQuery = `select * from testF4(\'${id}\') where isRemoved = 0 and isViewed = 0 order by DBAddingTime DESC, url, position`;
			} else {
				usQuery = `select * from testF4(\'${id}\') where isRemoved = 0 and isFavorite = 1 order by DBAddingTime DESC, url, position`;
			}
			let obj = new sql.Request().query(usQuery).then(function(result) {
				sql.close(function(err) {
					if (err) {
						return console.log("Ошибка: " + err.message);
						reject("Ошибка: " + err.message);
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

module.exports.updateState = async function(vacancyID,isViewed,isFavorite,isRemoved) {
	return new Promise(function(resolve, reject) {
		sql.connect(config).then(function() {
			console.log(`update Vacancy set isViewed = ${isViewed}, isFavorite = ${isFavorite}, isRemoved = ${isRemoved}
			 where Id = \'${vacancyID}\'`);
			let obj = new sql.Request().query(`update Vacancy set isViewed = ${isViewed}, isFavorite = ${isFavorite}, isRemoved = ${isRemoved}
			 where Id = \'${vacancyID}\'`).then(function() {
				sql.close(function(err) {
					if (err) {
						return console.log("Ошибка: " + err.message);
						reject("Ошибка: " + err.message);
					}
					resolve("Данные успешно обновлены.");
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