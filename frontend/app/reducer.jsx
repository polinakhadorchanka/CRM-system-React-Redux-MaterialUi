const initialUserState = {
    allVacancies: [],
    unviewedVacancies: [],
    boardVacancies: [],
    parsers: [],
    newVacanciesCount: 0,
    user: null,
    updateNextCount: true
};

const reducer = function(state = initialUserState, action) {
    switch(action.type) {
        case 'SET_NEXTCOUNT': {
            return Object.assign({}, state, { updateNextCount: action.updateNextCount });
        }
        case 'ADD_VACANCY':
            switch(action.filter) {
                case 'all':
                    return Object.assign({}, state, { allVacancies: action.vacancy });
                case 'unviewed':
                    return Object.assign({}, state, { unviewedVacancies: action.vacancy });
                case 'board':
                    return Object.assign({}, state, { boardVacancies: action.vacancy });
                default: return state;
            }
        case 'CHANGE_VACANCY':
            let allVacancies = state.allVacancies,
                unviewedVacancies = state.unviewedVacancies,
                boardVacancies = state.boardVacancies;

            let el = allVacancies.filter((el) => el.VacancyId === action.vacancy.VacancyId)[0];
            if(allVacancies.indexOf(el) >= 0) {
                allVacancies[allVacancies.indexOf(el)] = action.vacancy;
            }

            el = unviewedVacancies.filter((el) => el.VacancyId === action.vacancy.VacancyId)[0];
            if(unviewedVacancies.indexOf(el) >= 0) {
                unviewedVacancies[unviewedVacancies.indexOf(el)] = action.vacancy;
            }

            el = boardVacancies.filter((el) => el.VacancyId === action.vacancy.VacancyId)[0];
            if(boardVacancies.indexOf(el) >= 0) {
                boardVacancies[boardVacancies.indexOf(el)] = action.vacancy;
            }

            return Object.assign({}, state, { allVacancies: allVacancies,
                unviewedVacancies: unviewedVacancies,
                boardVacancies: boardVacancies});
        case 'CHANGE_COUNT': return Object.assign({}, state, { newVacanciesCount: action.count });
        case 'ADD_USER':
            if(action.user) localStorage.setItem('user', JSON.stringify(action.user));
            else localStorage.removeItem('user');
            return Object.assign({}, state, { user: action.user });
        case 'ADD_PARSERS': return Object.assign({}, state, { parsers: action.parsers });
        case 'CHANGE_PARSER':
            let parsers = state.parsers;

            el = parsers.filter((el) => el.ParserId === action.parser.ParserId)[0];
            if(parsers.indexOf(el) >= 0) {
                parsers[parsers.indexOf(el)] = action.parser;
            }
            return Object.assign({}, state, { parsers: parsers});
        default: return state;
    }
};

module.exports = reducer;
