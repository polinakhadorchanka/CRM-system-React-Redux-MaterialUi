const sql = require('mssql');
let fs = require("fs");

const config= {
	user: 'nodejs',
	password: 'nodejs',
	server: 'DBServer1',
	database: 'BORODICH',
	port: 50100
};

// const config= {
// 	user: 'user001',
// 	password: '12345',
// 	server: '127.0.0.1',
// 	database: 'test',
// 	port: 1433
// };

module.exports.getData = async function(am, date, filter) {
	return new Promise(function(resolve, reject) {
		let usQuery;
		// filter ++
		sql.connect(config).then(function() {
			let myJsonDate = JSON.parse(date);
			if (am == 10){
				if(filter == `all`){
					usQuery = `select top(${am}) Vacancy.Id as vacancyId, url, position, location, description, CONVERT(nvarchar(10),SiteAddingDate, 104) as siteAddingDate,
					 Name as companyName, website, Country as country,Type as type, DbAddingDate as DBAddingTime, isViewed, isFavorite, isRemoved from Vacancy, Company where
					  Company.Id = Vacancy.CompanyId and isRemoved = 0 order by Vacancy.DbAddingDate DESC, Vacancy.Url, position`;
				} else if(filter == `unviewed`) {
					usQuery = `select top(${am}) Vacancy.Id as vacancyId, url, position, location, description, CONVERT(nvarchar(10),SiteAddingDate, 104) as siteAddingDate,
					 Name as companyName, website, Country as country,Type as type, DbAddingDate as DBAddingTime, isViewed, isFavorite, isRemoved from Vacancy, Company where
					  Company.Id = Vacancy.CompanyId and isRemoved = 0 and isViewed = 0 order by Vacancy.DbAddingDate DESC, Vacancy.Url, position`;
				} else {
					usQuery = `select top(${am}) Vacancy.Id as vacancyId, url, position, location, description, CONVERT(nvarchar(10),SiteAddingDate, 104) as siteAddingDate,
					 Name as companyName, website, Country as country,Type as type, DbAddingDate as DBAddingTime, isViewed, isFavorite, isRemoved from Vacancy, Company where
					  Company.Id = Vacancy.CompanyId and isRemoved = 0 and isFavorite = 1 order by Vacancy.DbAddingDate DESC, Vacancy.Url, position`;
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
			}
			else {
				if(filter == `all`){
					usQuery = `select top(${am}) Vacancy.Id as vacancyId, url, position, location, description, CONVERT(nvarchar(10),SiteAddingDate, 104) as siteAddingDate,
					 Name as companyName, website, Country as country,Type as type, DbAddingDate as DBAddingTime, isViewed, isFavorite, isRemoved from Vacancy, Company where
					  Vacancy.CompanyId = Company.Id and DbAddingDate <= \'${myJsonDate.date}\' and isRemoved=0 order by Vacancy.DbAddingDate DESC, Vacancy.Url,position`;
				} else if(filter == `unviewed`) {
					usQuery = `select top(${am}) Vacancy.Id as vacancyId, url, position, location, description, CONVERT(nvarchar(10),SiteAddingDate, 104) as siteAddingDate,
					 Name as companyName, website, Country as country,Type as type, DbAddingDate as DBAddingTime, isViewed, isFavorite, isRemoved from Vacancy, Company where
					  Vacancy.CompanyId = Company.Id and DbAddingDate <= \'${myJsonDate.date}\' and isRemoved = 0 and isViewed = 0 order by Vacancy.DbAddingDate DESC, Vacancy.Url, position`;
				} else {
					usQuery = `select top(${am}) Vacancy.Id as vacancyId, url, position, location, description, CONVERT(nvarchar(10),SiteAddingDate, 104) as siteAddingDate,
					 Name as companyName, website, Country as country,Type as type, DbAddingDate as DBAddingTime, isViewed, isFavorite, isRemoved from Vacancy, Company where
					  Vacancy.CompanyId = Company.Id and DbAddingDate <= \'${myJsonDate.date}\' and isRemoved = 0 and isFavorite = 1 order by Vacancy.DbAddingDate DESC, Vacancy.Url, position`;
				}
				let obj = new sql.Request().query(usQuery).then(function (result) {
					sql.close(function (err) {
						if (err) {
							return console.log("Ошибка: " + err.message);
							reject("Ошибка: " + err.message);
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

module.exports.getAmount = async function(date, filter) {
	// filter ++
	return new Promise(function(resolve, reject) {
		let usQuery;
		sql.connect(config).then(function() {
			let myJsonDate = JSON.parse(date);
			if(filter == `all`){
				usQuery = `select count(*) as count from Vacancy where DbAddingDate>\'${myJsonDate.date}\' and isRemoved = 0`;
			} else if(filter == `unviewed`) {
				usQuery = `select count(*) as count from Vacancy where DbAddingDate>\'${myJsonDate.date}\' and isRemoved = 0 and isViewed = 0`;
			} else {
				usQuery = `select count(*) as count from Vacancy where DbAddingDate>\'${myJsonDate.date}\' and isRemoved = 0 and isFavorite = 1`;
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

module.exports.getAmountLeft = async function(date,filter) {
	// filter
	return new Promise(function(resolve, reject) {
		let usQuery;
		sql.connect(config).then(function() {
			let myJsonDate = JSON.parse(date);
			if(filter == `all`){
				usQuery = `select count(*) as count from Vacancy where DbAddingDate<=\'${myJsonDate.date}\' and isRemoved = 0`;
			} else if(filter == `unviewed`) {
				usQuery = `select count(*) as count from Vacancy where DbAddingDate<=\'${myJsonDate.date}\' and isRemoved = 0 and isViewed = 0`;
			} else {
				usQuery = `select count(*) as count from Vacancy where DbAddingDate<=\'${myJsonDate.date}\' and isRemoved = 0 and isFavorite = 1`;
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
				usQuery = `select Vacancy.Id as vacancyId, url, position, location, Description,CONVERT(nvarchar(10), SiteAddingDate, 104) as SiteAddingTime,
					 Name as company_name, Website, Country as country, Type as type, DbAddingDate as DBAddingTime, isViewed, isFavorite, isRemoved from Vacancy, Company
					  where Vacancy.CompanyId = Company.Id and DbAddingDate > \'${myJsonDate.date}\' and isRemoved = 0 order by Vacancy.DbAddingDate DESC, Vacancy.Url, position`;
			} else if(filter == `unviewed`) {
				usQuery = `select Vacancy.Id as vacancyId, url, position, location, Description,CONVERT(nvarchar(10), SiteAddingDate, 104) as SiteAddingTime,
					 Name as company_name, Website, Country as country, Type as type, DbAddingDate as DBAddingTime, isViewed, isFavorite, isRemoved from Vacancy, Company
					  where Vacancy.CompanyId = Company.Id and DbAddingDate > \'${myJsonDate.date}\' and isRemoved = 0 and isViewed = 0 order by Vacancy.DbAddingDate DESC, Vacancy.Url, position`;
			} else {
				usQuery = `select Vacancy.Id as vacancyId, url, position, location, Description, CONVERT(nvarchar(10), SiteAddingDate, 104) as SiteAddingTime,
					 Name as company_name, Website, Country as country, Type as type, DbAddingDate as DBAddingTime, isViewed, isFavorite, isRemoved from Vacancy, Company
					  where Vacancy.CompanyId = Company.Id and DbAddingDate > \'${myJsonDate.date}\' and isRemoved = 0 and isFavorite = 1 order by Vacancy.DbAddingDate DESC, Vacancy.Url, position`;
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