let request = require('request');

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