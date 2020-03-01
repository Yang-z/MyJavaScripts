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
        console.log(str.codePointAt(i))
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
    var buff = Buffer.from(arr);  // ✔️
    console.log(buff);
    
    fs.writeFileSync(`.test/out_buff`, buff);   // ⚠️💣 not exact bytes, even specifies econding to 'binary'
                                                // ⚠️💣 new Uint8Array(buff): not exact bytes
    var buff_r = fs.readFileSync(`.test/out_buff`)
    console.log(buff_r);  // ✔️ restored!

    // var str = buff.toString('utf8')  // ❌ [655533] take buff as 'utf8' encoded
    var str = buff.toString('binary')  // ✔️
    for(i=0; i<str.length; i++){
        console.log(str.charCodeAt(i));
        // console.log(str.codePointAt(i));
    }
    // fs.writeFileSync(`.test/out_str`, str, );  // ⚠️ utf8
    fs.writeFileSync(`.test/out_str`, str, 'binary');   // ⚠️💣 so, 'binary' is not 'byte to byte' coding method
                                                        // 'binary' is an encoding method for Buffer
                                                        // it's not raw byts arrray of the content, 
                                                        // but act as raw bytes when read it,
                                                        // just as 'utf16le' for String.

    break;
}

console.log("done!")