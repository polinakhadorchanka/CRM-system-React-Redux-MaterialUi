let express = require("express");
let bodyParser = require("body-parser");
let fs = require("fs");
let mod = require('./dbModule')

let app = express();
let jsonParser = bodyParser.json();
let myJsonDate = { "date": ""};

app.use(express.static(__dirname + "/public"));


app.get("/api/vacancies", function(req, res){
    let vacancies;

    mod.getData(req.query.count*req.query.site, JSON.stringify(myJsonDate)).then(function(result) {
        vacancies = result;
        if(req.query.count*req.query.site == 10)
            myJsonDate.date = vacancies[0].DBAddingTime;
        res.send(vacancies);
    });
});

// Получение новых вакансий
app.get("/api/vacancies/new", function(req, res){
    // ПОЛУЧИТЬ НОВЫЕ ВАКАНСИИ
    let vacancies;
    mod.getNewData(JSON.stringify(myJsonDate)).then(function(result) {
        vacancies = result;
        myJsonDate.date = vacancies[0].DBAddingTime;
        res.send(vacancies);
    });
});

// Получение количества новых вакансий
app.get("/api/vacancies/new/count", function(req, res){
    let amount;
    mod.getAmount(JSON.stringify(myJsonDate)).then(function(result) {
        amount = result;
        res.send(amount);
    });
});

// Получение количества оставшихся вакансий
// Пример вызова `/api/vacancies/next?count=${this.state.nextCount}` , где count - количество отображаемых вакансий
app.get("/api/vacancies/next", function(req, res){
    let amount;
    mod.getAmountLeft(JSON.stringify(myJsonDate)).then(function(result) {
        amount = result;
        console.log(amount[0].count - req.query.count);
        console.log(req.query.count);
        amount[0].count-= req.query.count;
        res.send(amount);
    });
});

app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});