const sql = require('mssql');
const parser = require('mssql-connection-string');

const connectionString = process.argv[2];
const knexDb = parser(connectionString);
const config = {
	user: knexDb.user,
	password: knexDb.password,
	server: knexDb.server,
	database: knexDb.database,
	port: +knexDb.options.port
};
//++
module.exports.getData = async function(id, filter, userId, techFilter,count) {
	return new Promise(function(resolve, reject) {
		let usQuery;
		// filter ++ TODO: если нам передали тек фильтр то вызвать функцию с ним, когда у нас 1 вывод записей идёт, могут применить фильтр и надо выдать список
		sql.connect(config).then(function() {
			if(id == 'undefined') {
				usQuery = `select * from testF0('${userId}','${filter}','${techFilter}',${count}) order by DbAddingDate DESC, Url, position`;
			} else{
				usQuery = `select * from testF1('${id}','${userId}','${filter}','${techFilter}',${count}) order by DbAddingDate DESC, Url, position`;
			}
			let obj = new sql.Request().query(usQuery).then(function (result) {
				resolve(result.recordset);
			}).catch(function(err) {
				console.dir(err);
			});
		})
	})
};

module.exports.getAmount = async function(id, userId) {
	return new Promise(function(resolve, reject) {
		let usQuery;
		sql.connect(config).then(function() {
			usQuery = `select dbo.testF3 ('${id}','${userId}') as count`;
			let obj = new sql.Request().query(usQuery).then(function(result) {
				resolve(result.recordset);
			}).catch(function(err) {
				console.dir(err);
			});
		}).catch(function(err) {
			console.dir(err);
		});
	})
};

module.exports.getAmountLeft = async function(vacId,filter,userId, techFilter) {
	// filter
	return new Promise(function(resolve, reject) {
		sql.connect(config).then(function() {
			let usQuery = `select dbo.testF2 ('${vacId}','${filter}','${userId}','${techFilter}') as count`;
			let obj = new sql.Request().query(usQuery).then(function(result) {
				resolve(result.recordset);
			}).catch(function(err) {
				console.dir(err);
			});
		}).catch(function(err) {
			console.dir(err);
		});
	})
};

module.exports.getNewData = async function(id, userId) {
	return new Promise(function(resolve, reject) {
		let usQuery;
		sql.connect(config).then(function() {
			usQuery = `select * from dbo.testF4('${id}','${userId}') order by DbAddingDate DESC, Position, Url`;
			let obj = new sql.Request().query(usQuery).then(function(result) {
				resolve(result.recordset);
			}).catch(function(err) {
				console.dir(err);
			});
		}).catch(function(err) {
			console.dir(err);
		});
	})
};

module.exports.updateVacancyState = async function(vacancyID,clientId,isViewed,isRemoved,boardStatus,comment) {
	return new Promise(function(resolve, reject) {
		sql.connect(config).then(function() {
			let bs = ''+boardStatus,
				comm = ''+comment;
			let usQuery = `exec updateStateClientVacancy '${clientId}','${vacancyID}',${isViewed},${isRemoved},
				${boardStatus === null ? boardStatus : '\''+bs+'\''}, ${comment === null ? comment : '\''+comm+'\''}`;
			let obj = new sql.Request().query(usQuery).then(function() {
				resolve("Данные успешно обновлены/добавлены.");
			}).catch(function(err) {
				console.dir(err);
			});
		}).catch(function(err) {
			console.dir(err);
		});
	})
};

module.exports.getLastNoteDate = async function() {
	return new Promise(function(resolve, reject) {
		sql.connect(config).then(function() {
			let usQuery = "select top(1) DbAddingDate from Vacancy order by DbAddingDate DESC, Position, Url";
			let obj = new sql.Request().query(usQuery).then(function(result) {
				resolve(result.recordset[0]);
			}).catch(function(err) {
				console.dir(err);
			});
		}).catch(function(err) {
			console.dir(err);
		});
	})
};

module.exports.insertVacations = function(data) {
	sql.connect(config).then(function() {
		new sql.Request().query(`exec InsertNewVacancy '${data}'`).then(function(recordset) {
			console.dir(recordset);
		}).catch(function(err) {
			console.dir(err);
		});
	}).catch(function(err) {
		console.dir(err);
	});
};

module.exports.registrationValidationLogin = async function(login) {
	return new Promise(function(resolve, reject) {
		sql.connect(config).then(function() {
			let usQueryL = `select count(*) as loginCount from Client where login = '${login}'`;
			let objL = new sql.Request().query(usQueryL).then(function(result) {
				resolve(result.recordset[0].loginCount);
			}).catch(function(err) {
				console.dir(err);
			});
		}).catch(function(err) {
			console.dir(err);
		});
	})
};

module.exports.registrationValidationEmail = async function(email) {
	return new Promise(function(resolve, reject) {
		sql.connect(config).then(function() {
			let usQueryE = `select count(*) as emailCount from Client where email = '${email}'`,
				emailCount = +0;
			let objE = new sql.Request().query(usQueryE).then(function(result) {
				resolve(result.recordset[0].emailCount);
			}).catch(function(err) {
				console.dir(err);
			});
		}).catch(function(err) {
			console.dir(err);
		});
	})
};

module.exports.LogInValidation = async function(login, password) {
	return new Promise(function(resolve, reject) {
		sql.connect(config).then(function() {
			let usQuery = `select * from LogInValidation('${login}','${password}')`;
			let obj = new sql.Request().query(usQuery).then(function(result) {
				resolve(result.recordset[0]);
			}).catch(function(err) {
				console.dir(err);
			});
		}).catch(function(err) {
			console.dir(err);
		});
	})
};

module.exports.insertNewClient = async function(login,password,email) {
	return new Promise(function(resolve, reject) {
		sql.connect(config).then(function() {
			let usQuery = `insert into Client(login,password,email) values('${login}','${password}','${email}')`;
			let obj = new sql.Request().query(usQuery).then(function() {
				resolve("Клиент успешно добавлен.");
			}).catch(function(err) {
				console.dir(err);
			});
		}).catch(function(err) {
			console.dir(err);
		});
	})
};

module.exports.getListOfParsers = async function(filter) {
	return new Promise(function(resolve, reject) {
		sql.connect(config).then(function() {
			let usQuery;
			if(filter == 'all')
				usQuery = `select * from Parsers`;
			else
				usQuery = `select * from Parsers where ParserState = 1`;
			let obj = new sql.Request().query(usQuery).then(function(result) {
				resolve(result.recordset);
			}).catch(function(err) {
				console.dir(err);
			});
		}).catch(function(err) {
			console.dir(err);
		});
	})
};

module.exports.insertNewParser = function(token, apiKey, state, description) {
	return new Promise(function(resolve, reject) {
		sql.connect(config).then(function() {
			new sql.Request().query(`exec ParsersInsert '${token}', '${apiKey}', ${state}, '${description}'`).then(function() {
				resolve([{errorCode: 0}]);
			}).catch(function(err) {
				console.dir(err);
				resolve([{errorCode: 4, errorMessage: "DB token adding error"}]);
			});
		}).catch(function(err) {
			console.dir(err);
			resolve([{errorCode: 4, errorMessage: "DB token adding error"}]);
		});
	})
};

module.exports.updateParserState = async function(key,token,state,description) {
	return new Promise(function(resolve, reject) {
		sql.connect(config).then(function() {
			let usQuery = `exec ParsersUpdate '${key}','${token}',${state},'${description}'`;
			let obj = new sql.Request().query(usQuery).then(function() {
				resolve("Данные успешно обновлены.");
			}).catch(function(err) {
				console.dir(err);
				reject(err);
			});
		}).catch(function(err) {
			//console.dir(err);
			reject(err);
		});
	})
};

module.exports.getParserState = async function(token,key) {
	return new Promise(function(resolve, reject) {
		let usQuery;
		// filter ++
		sql.connect(config).then(function() {
			usQuery = `select dbo.getParserState('${token}', '${key}') as state`;
			let obj = new sql.Request().query(usQuery).then(function (result) {
				resolve(result.recordset[0].state);
			}).catch(function (err) {
				console.dir(err);
			});
		}).catch(function(err) {
			console.dir(err);
		});
	})
};

module.exports.deleteParser = async function(parserId) {
	return new Promise(function(resolve, reject) {
		sql.connect(config).then(function() {
			let usQuery = `delete from Parsers where ParserId = '${parserId}'`;
			let obj = new sql.Request().query(usQuery).then(function() {
				resolve("Данные успешно обновлены.");
			}).catch(function(err) {
				console.dir(err);
				reject(err);
			});
		}).catch(function(err) {
			console.dir(err);
			reject(err);
		});
	})
};

module.exports.updateParserReadDate = async function(token, key) {
	return new Promise(function(resolve, reject) {
		sql.connect(config).then(function() {
			let usQuery = `update Parsers set ParserLastReadBdDate = getdate() where ParserToken = '${token}' and ParserKey = '${key}' `;
			let obj = new sql.Request().query(usQuery).then(function() {
				resolve("Данные успешно обновлены.");
			}).catch(function(err) {
				console.dir(err);
				reject(err);
			});
		}).catch(function(err) {
			console.dir(err);
			reject(err);
		});
	})
};

module.exports.updateParserDateStatus = function(key, token, status, date) {
	sql.connect(config).then(function() {
		let usQuery;
		if(date == null)
			usQuery = `update Parsers set ParserStatus = '${status}',ParserLastDate=${date}  where ParserToken = '${token}' and ParserKey = '${key}' `;
		else
			usQuery = `update Parsers set ParserStatus = '${status}',ParserLastDate='${date}'  where ParserToken = '${token}' and ParserKey = '${key}' `;
		let obj = new sql.Request().query(usQuery).catch(function(err) {
			console.dir(err);
		});
	}).catch(function(err) {
		console.dir(err);
	});
};

module.exports.getParserDate = async function(token,key) {
	return new Promise(function(resolve, reject) {
		let usQuery;
		// filter ++
		sql.connect(config).then(function() {
			usQuery = `select ParserLastReadBdDate from Parsers where ParserToken = '${token}' and ParserKey = '${key}'`;
			let obj = new sql.Request().query(usQuery).then(function (result) {
				resolve(result.recordset[0]);
			}).catch(function (err) {
				console.dir(err);
			});
		}).catch(function(err) {
			console.dir(err);
		});
	})
};