const fs = require('fs')
const puppeteer = require('puppeteer');

/** ********************************************************************** */
const {NetworkManager, Response} = require('puppeteer/lib/NetworkManager');

Response.prototype.raw = function() {
    if (!this._contentPromise) {
        this._contentPromise = this._bodyLoadedPromise.then(async error => {
            if (error)
                throw error;

            const response = await this._client.send
            (
                'Network.getResponseBody', 
                {
                    requestId: this._request._requestId
                }
            );
            // console.log(typeof(response));
            // console.log(typeof(response.body))
            return response.body;
        });
        }
        return this._contentPromise;
};
/**⚠️
 * ref:
 * https://github.com/puppeteer/puppeteer/issues/3372
 * it's for getting more date in headers,
 * but failed to get raw response body in this content
 */
/** ********************************************************************** */

const cache = JSON.parse(fs.readFileSync("./7/.cache/.json"));
var count = 0;

var http_req = null;
var http_req_amf = fs.readFileSync("./7/.cache/action/amf-add1").toString('binary');

async function launch_browser(){
    return await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        // devtools: true,

        executablePath: cache.puppeteer.executablePath,
        userDataDir: cache.puppeteer.userDataDir,

        args: [
            "--disable-features=site-per-process",  // https://github.com/puppeteer/puppeteer/issues/4960
            // "--disable-infobars",
            // "--no-sandbox",
            // `--user-data-dir=${cache.pyppeteer['userDataDir']}`,
            // `--profile-directory=${cache.pyppeteer['profileDir']}`,
        ],   
    });
};

/**
 * @param {puppeteer.Request} request
 * @returns {null}
 */
async function on_interceptedRequest(request){
    if( request.url().endsWith('/amf')
        // && request.method() == 'POST'
        // && request.resourceType() == 'other'
        // && request.headers().hasOwnProperty('content-type')
        // && request.headers()['content-type'].includes('amf')
    ){
        console.log(++count);
        // console.log(request);

        // try{
        //     parseBodyString(request.postData(), "req");
        // }catch(e){
        //     console.error(e);
        // }
        
        // response = request.response()
        // console.log(response);  // null
        
        if(http_req === null && count > 60){
            http_req = saveRequest(request);
        }


    };
    // interceptedRequest.abort();
    request.continue();
};

/**
 * @param {puppeteer.Response} response
 */
async function on_response(response){
    if( response.request().url().endsWith('/amf')
        // && response.request().method() === "POST"
        // && response.request().resourceType() === 'other' 
        // && response.headers().hasOwnProperty('content-type')
        // && response.headers()['content-type'].includes('amf')
    ){
        // req_body = response.request().postData();
        // console.log(req_body);

        // console.log(`content-length: ${response.headers()['content-length']}`)

        // var buffer = await response.buffer();
        var raw = await response.raw();     // ❌ [655533] or [0xFFFD]
                                            // happends when take buff('binary') as 'utf8' encoded,
                                            // so, it seems `buff.toString('utf8')` has happened incorrectly somewhere
        try{
            parseBodyString(raw, "res");
        }catch(e){
            console.error(e);
        }
            

        /**⚠️
         * They are just not really raw date, see:
         * https://bugs.chromium.org/p/chromium/issues/detail?id=771825
         * 
         * Raw response body is not avilable for current puppeteer api, see:
         * https://github.com/puppeteer/puppeteer/issues/1191
         * 
         * A way to get raw response by using CDP, see:
         * https://gist.github.com/jsoverson/638b63542863596c562ccefc3ae52d8f
         */
        
    }
    // response.request().continue()
}
/** ********************************************************************** */

/**
 * @param {String} str 
 * @param {String} name
 */
function parseBodyString(str, name){
    // var str = request.postData()
    var dir = "./7/.cache/amf"
    var file_path = `${dir}/${name}_${count}`

    var buffer = Buffer.from(str, 'binary');    // ✔️    'binary'
                                                // ⚠️🔮  'utf8'      [80:FF] to 'utf8'
                                                // ⚠️💎  'utf16le'   [XX] + [00]
    fs.writeFile(`${file_path}_buf`, buffer, err=> {if(err) console.error(err)});  

    
    while(false){
        fs.writeFile(`${file_path}_str`, str, 'latin1', err=> {if(err) console.error(err)});
        // ✔️   'latin1' or 'binary'
        // ⚠️🔮 'utf8' as default   [80:FF] to 'utf8'
        // ⚠️💎 'utf16le'           [XX] + [00]

        // for future test of dealing with big code point requiring 4 bytes in utf-16
        var charCodeArray = [];
        var codePointArray = [];
        for(i = 0; i < str.length; i++){
            charCodeArray.push(str.charCodeAt(i));  // ✔️
            codePointArray.push(str.codePointAt(i));  // ✔️
        }
        var charCode = Buffer.from(charCodeArray);
        var codePoint = Buffer.from(codePointArray);

        fs.writeFile(`${file_path}_charCode[]`, charCodeArray, err=> {if(err) console.error(err)});
        fs.writeFile(`${file_path}_codePoint[]`, codePointArray, err=> {if(err) console.error(err)});
        fs.writeFile(`${file_path}_charCode`, charCode, err=> {if(err) console.error(err)});  // ✔️
        fs.writeFile(`${file_path}_codePoint`, codePoint, err=> {if(err) console.error(err)});  // ✔️
    }

}





(async function main(){

    /** @var {puppeteer.Browser} browser */
    const browser = await launch_browser();
    
    /** @var {puppeteer.Page} page */
    var page = (await browser.pages())[0];

    await page.setRequestInterception(true);

    page.on("request", on_interceptedRequest);
    // page.on('response', on_response);
    // intercepte response?

    await page.goto(cache.game.url);

    // wait
    {
        console.log('wait 60s')
        await new Promise(r => setTimeout(r, 30000));
        console.log('wait 30s')
        await new Promise(r => setTimeout(r, 15000));
        console.log('wait 15s')
        await new Promise(r => setTimeout(r, 15000));
    }

    if(http_req != null){
        set_request(http_req.url, http_req.options, http_req_amf);
    }

    await new Promise(r => setTimeout(r, 300000));

    await browser.close();
    console.log("async done.")

})();


/** ********************************************************************** */
/** ********************************************************************** */
var http=require('http');


/**
 * 
 * @param {puppeteer.Request} pptr_req 
 */
function saveRequest(pptr_req){
    var req = {
        url: pptr_req.url(),
        options: {}
    }
    req.options = {
        method: pptr_req.method(),
        headers: {}
    };
    for (const key of Object.keys(pptr_req.headers())){
        req.options.headers[key] = pptr_req.headers()[key];
    }
    console.log(req);  // ❌ pptr seems not give us sufficient headers!
    return req;
}


/**
 * @param {String} url
 * @param {Object} options 
 * @param {String} contents 
 */
function set_request(url, options, contents){

    options['headers']['content-length'] = contents.length;

    var req=http.request(url, options,function(res){
        console.log(res);
        // res.setEncoding('utf-8');
        // res.on('data',function(data){
        //     console.log('http respond');
        //     console.log(data);
        // })
    });
    req.write(contents);
    // req.end();
}