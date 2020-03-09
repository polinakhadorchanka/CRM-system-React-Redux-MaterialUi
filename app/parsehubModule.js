let request = require('request');

module.exports.getDataFromParseHub = async function(key, tocken) {
    return new Promise(function(resolve, reject) {
        request({
            uri: `https://parsehub.com/api/v2/projects/${tocken}/last_ready_run/data`,
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

module.exports.getStateFromParseHub = async function(key, tocken) {
    return new Promise(function(resolve, reject) {
        request({
            uri: `https://parsehub.com/api/v2/projects/${tocken}`,
            method: 'GET',
            qs: {
                api_key: key,
                offset: "0",
                include_options: "1"
            }
        }, function(err, resp, body) {
            //console.log((JSON.parse(body))['run_list'])//end time
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

module.exports.runParseHubFunction = async function(key, tocken) {
    return new Promise(function(resolve, reject) {
        request({
            uri: `https://parsehub.com/api/v2/projects/${tocken}/run`,
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