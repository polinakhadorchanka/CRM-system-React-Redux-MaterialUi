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

module.exports = {addVacancy, changeVacancy, changeNewVacanciesCount};