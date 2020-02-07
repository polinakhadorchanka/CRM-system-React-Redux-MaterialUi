let express = require("express");
let fs = require("fs");
let bodyParser = require('body-parser')
let mod = require('./dbModule')

let app = express();
let myJsonDate = { "date": ""};
let curentAmount = +0;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});

app.get("/api/vacancies", function(req, res){
    let vacancies;
    let filter = req.query.filter;
    console.log(`${curentAmount+10} - it's cureamount+10`);
    mod.getData(10*req.query.site, JSON.stringify(myJsonDate), filter).then(function(result) {
        console.log(curentAmount);
        vacancies = result;
        if(10*req.query.site == 10 && vacancies.length != 0)
            myJsonDate.date = vacancies[0].DBAddingTime;
        res.send(vacancies);
    });
});

// Получение новых вакансий++
app.get("/api/vacancies/new", function(req, res){
    let vacancies;
    let filter = req.query.filter;
    mod.getNewData(JSON.stringify(myJsonDate), filter).then(function(result) {
        vacancies = result;
        myJsonDate.date = vacancies[0].DBAddingTime;
        res.send(vacancies);
        console.log(vacancies);
    });
});

// Получение количества новых вакансий++
app.get("/api/vacancies/new/count", function(req, res){
    let amount;
    let filter = req.query.filter;
    mod.getAmount(JSON.stringify(myJsonDate), filter).then(function(result) {
        amount = result;
        res.send(amount);
    });
});

// Получение количества оставшихся вакансий++
// Пример вызова `/api/vacancies/next?count=${this.state.nextCount}` , где count - количество отображаемых вакансий
app.get("/api/vacancies/next", function(req, res){
    let amount;
    let filter = req.query.filter;
    mod.getAmountLeft(JSON.stringify(myJsonDate), filter).then(function(result) {
        amount = result;
        console.log(amount[0].count - req.query.count);
        curentAmount = +req.query.count;
        console.log(curentAmount);
        amount[0].count-= req.query.count;
        res.send(amount);
    });
});

app.put("/api/vacancy-status", function (req, res) {
    mod.updateState(req.body.vacancyId,+req.body.isViewed,+req.body.isFavorite,+req.body.isRemoved).then(function(result){
        let message = result;
        res.send(message);
    });
});