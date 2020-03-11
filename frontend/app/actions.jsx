let addVacancy = function (vacancy, filter) {
    return {
        type: "ADD_VACANCY",
        filter: filter,
        vacancy
    }
};

let changeVacancy = function (vacancy) {
    return {
        type: "CHANGE_VACANCY",
        vacancy
    }
};

let changeNewVacanciesCount = function (count) {
    return {
        type: "CHANGE_COUNT",
        count
    }
};

let setUser = function(user) {
    return {
        type: 'ADD_USER',
        user
    }
};

let addParsers = function (parsers) {
    return {
        type: "ADD_PARSERS",
        parsers
    }
};

module.exports = {addVacancy, changeVacancy, changeNewVacanciesCount, setUser, addParsers};