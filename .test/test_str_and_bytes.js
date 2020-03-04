while(false){
    const fs = require('fs')

    /** @var {Buffer} buffer */
    let buffer = fs.readFileSync(".test/bytes")
    console.log(typeof(buffer))  // Buffer
    console.log(buffer)  // ✔️ Buffer(3) [255, 202, 250]


    let str = buffer.toString('binary')
    console.log(str)  // ⚠️ ÿÊú
    for(i=0; i<str.length; i++){
        console.log(str.charCodeAt(i));
        console.log(str.codePointAt(i));
    }

    /** @var {Buffer} buffer_r */
    let buffer_r = Buffer.from(str, 'binary')
    console.log(buffer_r)  // ✔️ Buffer(3) [255, 202, 250]


    let str2 = buffer.toString()  // 'utf8'❌
    // here is why a bytes stream could broken during transmission
    console.log(str2)  // ⚠️ ���
    for(i=0; i<str.length; i++){
        console.log(str2.charCodeAt(i));
        console.log(str2.codePointAt(i))
    }


    /** @var {Buffer} buffer_r2 */
    let buffer_r2 = Buffer.from(str2, 'binary')
    console.log(buffer_r2)  // ❌ Buffer(3) [253, 253, 253]


    break;
}

while(false){
    /** @var {string} str */
    var str = "𐐷aAbBcC测试" // 𝕊𝕠𝕞𝕖𝕥𝕙𝕚𝕟𝕘 𝕒𝕓𝕠𝕦𝕥 𝕌𝕟𝕚𝕔𝕠𝕕𝕖
    for(i=0; i<15; i++){
        console.log(`[${i}]`)
        try{
            console.log(str.charAt(i))  // string
            console.log(str.charCodeAt(i).toString(16))  // number
            console.log(str.codePointAt(i).toString(16))  // number
        }catch(e){
            console.error(e)
        }
    }

    break;
}

while(true){
    const fs = require('fs')

    var arr = [
        48,
        129,165,181,174,255,
        17
    ];
    for(i=0; i<arr.length; i++){
        console.log(arr[i].toString(16));
    }
    var buff = Buffer.from(arr);  // ✔️ 'binary'
    console.log(buff);
    
    fs.writeFileSync(`.test/out_buff`, buff);   // ✔️

    var buff_r = fs.readFileSync(`.test/out_buff`)
    console.log(buff_r);  // ✔️ restored!


    // var str = buff.toString('utf8') // ❌ [655533] or [0xFFFD] https://github.com/nodejs/node/issues/23280
    //                                 // if take buff of 'binary' as 'utf8' encoded, data loss is permanent!
    var str = buff.toString('binary')  // ✔️
    for(i=0; i<str.length; i++){
        console.log(str.charCodeAt(i).toString(16));
        // console.log(str.codePointAt(i));
    }
    // fs.writeFileSync(`.test/out_str`, str);  // ⚠️🔮 'utf8' by default
    fs.writeFileSync(`.test/out_str`, str, 'binary');   // ✔️ 

    // what if we read a file of raw bytes?
    var raw = fs.readFileSync(`.test/raw`)  // ✔️ Buffer(7) [48, 129, 165, 181, 174, 255, 17]
    console.log(raw);
    fs.writeFileSync(`.test/out_raw`, raw); // ✔️

    // 💣 conclusion:
    // String in js uses 'utf16' only.
    // 'binary' means raw bytes without any encoding in node.js,
    // Write 'binary' buff into a file results in exactly same bytes.
    // Tools for inspecting a binary file could show confusion results,
    // if it is not configed correctly. 
    // i.e Notepad++ (x86) with plug-in of HEX-Editor, see:
    // https://github.com/nodejs/help/issues/2507

    break;
}

console.log("done!")