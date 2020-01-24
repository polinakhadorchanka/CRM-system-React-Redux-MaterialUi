let ReactDOM = require('react-dom');
let React = require('react');
let VacancyList = require('./components/VacancyList.jsx');

function getVacancies() {
    fetch("/api/vacancies?site=1&count=10")
        .then((response) => response.json())
        .then((response) => {
            ReactDOM.render(
                <VacancyList vacancies={response}/>,
                document.getElementById("container")
            );
        });
}

getVacancies();