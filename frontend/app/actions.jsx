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

module.exports = {addVacancy, changeVacancy};