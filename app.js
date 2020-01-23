var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
let mod = require('./dbModule')
 
var app = express();
var jsonParser = bodyParser.json();
 
app.use(express.static(__dirname + "/public"));


app.get("/api/getVacancies/:count", function(req, res){
    let vacancies;

    mod.getData().then(function(result) {
        vacancies = result;
        let myJson = { "date": vacancies[0].DBAddingTime};
        let myJsonString = JSON.stringify(myJson);
        fs.writeFile("lastNoteDateTime.json", myJsonString, function(error){
            if(error) throw error; // если возникла ошибка
            console.log("Асинхронная запись файла завершена. Содержимое файла:");
            let data = fs.readFileSync("lastNoteDateTime.json", "utf8");
            console.log(data);  // выводим считанные данные
            /*let myJson1 = JSON.parse(data);
            console.log(myJson1);
            console.log(myJson1.date);
            ПОЛУЧЕНИЕ ДАТЫ ЗАПИСИ ПОТОМ НАДО БУДЕТ СРАВНИТЬ С ДАТОЙ В БД*/
        });
        res.send(vacancies);
    });
});

// Получение новых вакансий
app.get("/api/getNewVacancies", function(req, res){
    // ПОЛУЧИТЬ НОВЫЕ ВАКАНСИИ

    let vacancies;

    mod.getData().then(function(result) {
        vacancies = result;
        console.log(vacancies);
        res.send(vacancies);
    });
});

// Получение количества новых вакансий
 app.get("/api/getNewVacanciesCount", function(req, res){
     let amount;

     mod.getAmount().then(function(result) {
         console.log(result);
         amount = result;
         res.send(amount);
     });
});
 
app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});