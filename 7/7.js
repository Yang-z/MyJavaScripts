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
            console.log(typeof(response));
            console.log(typeof(response.body))
            return response.body;
        });
        }
        return this._contentPromise;
};
// ref:
// https://github.com/puppeteer/puppeteer/issues/3372
// it's for getting more date in headers,  
// but not for getting raw response body
/** ********************************************************************** */

const cache = JSON.parse(fs.readFileSync("./7/.cache/.json"));
//console.log(cache);


(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        // devtools: true,

        executablePath: cache.puppeteer.executablePath,
        userDataDir: cache.puppeteer.userDataDir,

        args: [
            "--disable-features=site-per-process",  // https://github.com/puppeteer/puppeteer/issues/4960
            // "--disable-infobars",
            // "--no-sandbox",
            // "--user-data-dir=${cache.pyppeteer_args['userDataDir']}",
            // "--profile-directory=${cache.pyppeteer_args['profileDir']}",
        ],   
    });

    const page = (await browser.pages())[0]

    // page.setDefaultNavigationTimeout(0); 

    page.on("response", on_response);

    await page.goto(cache.game.url);

    await new Promise(r => setTimeout(r, 300000));

    await browser.close();
    console.log("async done.")
})();


const Amf_js = require('amf-js');
const libamf = require('libamf');
var Amf = require('amf');
count = 0;

/**
 * 
 * @param {puppeteer.Response} response
 */
async function on_response(response){
    if( 
        response.request().method() === "POST"
        && response.request().resourceType() === 'other' 
        && response.headers().hasOwnProperty('content-type')
        && response.headers()['content-type'].search('amf') != -1
    ){
        console.log(count++);
        // console.log("content-length: " + response.headers()['content-length'])

        req_body = response.request().postData();
        console.log(req_body);// broken for amf

        buffer = await response.buffer();
        console.log(buffer);// broken for amf

        raw = await response.raw();  // already broken
        console.log(raw);
        
        // They are just not raw date, see:
        // https://bugs.chromium.org/p/chromium/issues/detail?id=771825

        buffer_byte = Buffer.from(raw, 'binary');  // useless 
        
        // console.log("amf.byteLength: " + amf.byteLength)
        // fs.writeFile("./7/.cache/amf/" + count, buffer_byte, err=> {if(err) console.error(err)})
        // console.log(amf);
        try{
            // var amf_de = Amf_js.deserialize(buffer_byte.buffer);
            // var amf_de = libamf.deserialize(amf, libamf.ENCODING.AMF3);
            // var amf_de = Amf.read(amf, 0);;
            // console.log(amf_de);
        }catch(error) {
            console.error(error);;
        }
    }
}