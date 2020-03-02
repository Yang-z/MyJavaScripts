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
count = 0;

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
    if(
        request.method() == 'POST'
        && request.resourceType() == 'other'
    ){
        console.log(++count);
        // console.log(request);

        try{
            parseBodyString(request.postData(), "req");
        }catch(e){
            console.error(e);
        }
        
        // response = request.response()
        // console.log(response);  // null
    };
    // interceptedRequest.abort();
    request.continue();
};

/**
 * @param {puppeteer.Response} response
 */
async function on_response(response){
    if( 
        response.request().method() === "POST"
        && response.request().resourceType() === 'other' 
        && response.headers().hasOwnProperty('content-type')
        && response.headers()['content-type'].search('amf') != -1
    ){
        // req_body = response.request().postData();
        // console.log(req_body);

        // console.log(`content-length: ${response.headers()['content-length']}`)

        // var buffer = await response.buffer();
        var raw = await response.raw();     // ❌ [655533] 
                                            // happends when take buff('binary') as 'utf8' encoded,
                                            // so, it seems `buff.toString('utf8')` is happened incorrectly
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
         * A way to get raw response by using DTP, see:
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

    // console.log(str);
    // fs.writeFile(`${file_path}_str`, str, err=> {if(err) console.error(err)});  
    // // ⚠️🔮

    
    var buffer = Buffer.from(str, 'binary');
    // console.log(buffer);
    fs.writeFile(`${file_path}_buf`, buffer, err=> {if(err) console.error(err)});
    // ⚠️💣 'binary' is an encoding type but not in a byte-to-byte copying way

    
    // var buffer8 = Buffer.from(str,'utf8');
    // console.log(buffer8);
    // fs.writeFile(`${file_path}_buf8`, buffer8, err=> {if(err) console.error(err)});
    // // ⚠️🔮 [80:FF] to utf8


    var buffer16 = Buffer.from(str,'utf16le');
    // console.log(buffer16);
    fs.writeFile(`${file_path}_buf16`, buffer16, err=> {if(err) console.error(err)});
    // ⚠️💎 [XX] + 00

    // var charCodeArray = [];
    // var codePointArray = [];
    // for(i = 0; i < str.length; i++){
    //     charCodeArray.push(str.charCodeAt(i));  // ✔️
    //     codePointArray.push(str.codePointAt(i));  // ✔️
    // }
    // // var charCode = new Buffer(charCodeArray);
    // // var codePoint = new Buffer(codePointArray);
    // var charCode = Buffer.from(charCodeArray);
    // var codePoint = Buffer.from(codePointArray);
    // fs.writeFile(`${file_path}_charCode[]`, charCodeArray, err=> {if(err) console.error(err)});
    // fs.writeFile(`${file_path}_codePoint[]`, codePointArray, err=> {if(err) console.error(err)});
    // fs.writeFile(`${file_path}_charCode`, charCode, err=> {if(err) console.error(err)});  // ⚠️💣
    // fs.writeFile(`${file_path}_codePoint`, codePoint, err=> {if(err) console.error(err)});  // ⚠️💣

}


(async function main(){

    /** @var {puppeteer.Browser} browser */
    const browser = await launch_browser();
    
    /** @var {puppeteer.Page} page */
    var page = (await browser.pages())[0];

    await page.setRequestInterception(true);

    page.on("request", on_interceptedRequest);
    page.on('response', on_response);
    // intercepte response?

    await page.goto(cache.game.url);

    await new Promise(r => setTimeout(r, 300000));

    await browser.close();
    console.log("async done.")

})()