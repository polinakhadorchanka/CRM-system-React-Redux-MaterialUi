let express = require("express");
let fs = require("fs");
let bodyParser = require('body-parser')
let mod = require('./dbModule')

let app = express();
let curentAmount = +0;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});

app.get("/api/vacancies", function(req, res){
    let vacancies;
    let id = req.query.id;
    let filter = req.query.filter;
    mod.getData(id, filter).then(function(result) {
        res.send(result);
    });
});

// Получение новых вакансий++
app.get("/api/vacancies/new", function(req, res){
    let vacancies;
    let id = req.query.id;
    let filter = req.query.filter;
    mod.getNewData(id, filter).then(function(result) {
        res.send(result);
        console.log(result);
    });
});

// Получение количества новых вакансий++
app.get("/api/vacancies/new/count", function(req, res){
    let id = req.query.id;
    let filter = req.query.filter;
    mod.getAmount(id, filter).then(function(result) {
        console.log(result);
        res.send(result);
    });
});

// Получение количества оставшихся вакансий++
// Пример вызова `/api/vacancies/next?count=${this.state.nextCount}` , где count - количество отображаемых вакансий
app.get("/api/vacancies/next", function(req, res){
    let filter = req.query.filter;
    let id = req.query.id;
    mod.getAmountLeft(id, filter).then(function(result) {
        console.log(result);
        res.send(result);
    });
});

app.put("/api/vacancy-status", function (req, res) {
    mod.updateState(req.body.vacancyId,+req.body.isViewed,+req.body.isFavorite,+req.body.isRemoved,req.body.boardStatus, req.body.position).then(function(result){
        let message = result;
        res.send(message);
    });
});

app.get("/vacancies", function(req, res){
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/login", function(req, res) {
    let type = req.query.type,
        login = req.query.login,
        password = req.query.password;

    if(type === 'Registration')
        res.redirect('/registration');
    else if(type === 'Login') {
        // валидация
    }
    else res.sendFile(__dirname + "/public/index.html");
});

app.get("/registration", function(req, res){
    res.sendFile(__dirname + "/public/index.html");
});