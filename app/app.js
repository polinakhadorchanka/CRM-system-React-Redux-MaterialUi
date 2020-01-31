let express = require("express");
let fs = require("fs");
let bodyParser = require('body-parser')
let mod = require('./dbModule')

let app = express();
let myJsonDate = { "date": ""};

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});

// ВО ВСЕХ ЗАПРОСАХ НЕ ЗАБУДЬ, ЧТО "УДАЛЕННЫЕ" ЗАПИСИ УЧИТЫВАТЬ НЕ НАДО ++

app.get("/api/vacancies", function(req, res){
    let vacancies;
    let filter = req.query.filter;
    mod.getData(10*req.query.site, JSON.stringify(myJsonDate), filter).then(function(result) {
        vacancies = result;
        if(10*req.query.site == 10 && vacancies.length != 0)
            myJsonDate.date = vacancies[0].DBAddingTime;
        res.send(vacancies);
    });
});

// Получение новых вакансий++
app.get("/api/vacancies/new", function(req, res){
    //filter ++
    // ПОЛУЧИТЬ НОВЫЕ ВАКАНСИИ
    let vacancies;
    let filter = req.query.filter;
    mod.getNewData(JSON.stringify(myJsonDate), filter).then(function(result) {
        vacancies = result;
        myJsonDate.date = vacancies[0].DBAddingTime;
        res.send(vacancies);
    });
});

// Получение количества новых вакансий++
app.get("/api/vacancies/new/count", function(req, res){
    //filter ++
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
    //filter ++
    let amount;
    let filter = req.query.filter;
    mod.getAmountLeft(JSON.stringify(myJsonDate), filter).then(function(result) {
        amount = result;
        console.log(amount[0].count - req.query.count);
        //console.log(req.query.count);
        amount[0].count-= req.query.count;
        res.send(amount);
    });
});

app.put("/api/vacancy-status", function (req, res) {
    // Изменение статуса записи, сюда передалется объект конкретной записи
    // Статус назван по типу isFavorite isRemoved (vacancy.isFavorite (равняется 0 или 1))
    // получить объект можешь через req.body++

    // `/api/vacancy-status?isFavorite=true`
    // через необязательные параметры можешь определять, какие именно поля надо изменить
    // ну или можкшь сразу все 4 статуса обновлять, но это такое++
    mod.updateState(req.body.vacancyId,+req.body.isViewed,+req.body.isFavorite,+req.body.isRemoved).then(function(result){
        let message = result;
        res.send(message);
    });
});