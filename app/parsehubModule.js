let request = require('request');
const jsdom = require("jsdom");
const dateFormat = require('dateformat');
let abs = dateFormat();
module.exports.getDataFromParseHub = async function(key, token) {
    return new Promise(function(resolve, reject) {
        request({
            uri: `https://parsehub.com/api/v2/projects/${token}/last_ready_run/data`,
            method: 'GET',
            gzip: true,
            qs: {
                api_key: key,
                format: "json"
            }
        }, function(err, resp, body) {
            if(body)
                resolve(JSON.parse(body));
            else
                reject(err);
        });
    }).catch(function(err) {
        console.dir(err);
    });
};

module.exports.getStateFromParseHub = async function(key, token) {
    return new Promise(function(resolve, reject) {
        request({
            uri: `https://parsehub.com/api/v2/projects/${token}`,
            method: 'GET',
            qs: {
                api_key: key,
                offset: "0",
                include_options: "1"
            }
        }, function(err, resp, body) {
            if(body){
                let obj = {"status": (JSON.parse(body))['run_list'][0].status, "end_time":(JSON.parse(body))['run_list'][0].end_time, "pages":(JSON.parse(body))['run_list'][0].pages};
                resolve(obj);
            }
            else
                reject(err);
        });
    }).catch(function(err) {
        console.dir(err);
    });
};

module.exports.runParseHubFunction = async function(key, token) {
    return new Promise(function(resolve, reject) {
        request({
            uri: `https://parsehub.com/api/v2/projects/${token}/run`,
            method: 'POST',
            form: {
                api_key: key,
                send_email: "0"
            }
        }, function(err, resp, body) {
            if(body)
                resolve(body);
            else
                reject(err);
        });
    }).catch(function(err) {
        console.dir(err);
    });
};

module.exports.getListOfParsersByKey = async function(key, token) {
    return new Promise(function(resolve, reject) {
        request({
            uri: 'https://www.parsehub.com/api/v2/projects',
            method: 'GET',
            qs: {
                api_key: "td_sN-PPvfKs",
                offset: "0",
                limit: "20",
                include_options: "1"
            }
        }, function(err, resp, body) {
            if(body)
                resolve(JSON.parse(body));
            else
                reject(err);
        });
    }).catch(function(err) {
        console.dir(err);
    });
};

/* Обработка входных данных */

module.exports.processJSON = async function(data) {
    data = data.replace(/'/g, "''");

    let obj = JSON.parse(data);
    obj.positions.forEach(function(element) {
        element.date = changeDate(element.date);
        element.technologies = changeTechnologies((element.technologies));
    });

    return JSON.stringify(obj);
};

function changeDate(time) {
    let now = new Date();
    if (/[0-9]/.test(time)) {
        let timeSpaceless = time.replace(/\s+/g, ''),
            num = '' + parseInt(time.replace(/\D+/g, "")),
            indexOfNumber = time.replace(/\s+/g, '').indexOf(num),
            finalTime = num + timeSpaceless[indexOfNumber + num.length];
        switch (finalTime[finalTime.length - 1]) {
            case "h":
                now -= num * 1000 * 60 * 60;
                break;
            case "d":
                now -= num * 1000 * 60 * 60 * 24;
                break;
            case "m":
                now = now.setMonth(now.getMonth() - num);
                break;
        }
    }
    let date = dateFormat(now, "isoDate");
    return date;

}

function changeTechnologies(stack) {
    const dom = new jsdom.JSDOM(stack);
    let res = '';

    dom.window.document.querySelectorAll('a').forEach(function (el) {
        res = res + (el.textContent + ' // ');
    });

    return res;
}