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
        request.method() == "POST"
        && request.resourceType() == 'other'
    ){
        console.log(count++)
        console.log(request);
        try{
            // console.log(Buffer.from(request.postData(), 'binary'));
            // fs.writeFile(
            //     "./7/.cache/amf/" + count, 
            //     request.postData(), 
            //     err=> {if(err) console.error(err)}
            // );  // ✔️  unbroken amf!!!
        }catch(e){
            console.log(e);
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
        console.log(count);

        // req_body = response.request().postData();
        // console.log(req_body);// ❌ broken for amf

        console.log(`content-length: ${response.headers()['content-length']}`)

        raw = await response.raw();  // ❌ already broken
        /** @var {Buffer} buffer */
        raw_buffer = Buffer.from(raw, 'binary');  // ❌ useless 
        console.log(`buffer length: ${raw_buffer.length}`)
        console.log(raw_buffer)
        // fs.writeFile(`./7/.cache/amf/${count}_res`, raw_buffer, err=> {if(err) console.error(err)})

        // buffer = await response.buffer();
        // console.log(buffer);// ❌ broken for amf

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
        
        // try{
        //     // decode amf...
        //     console.log(amf);
        // }catch(error) {
        //     console.error(error);;
        // }
    }
    // response.request().continue()
}
/** ********************************************************************** */

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