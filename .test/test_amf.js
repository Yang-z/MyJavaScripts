const fs = require('fs')

var buffer = fs.readFileSync(".test/amf")
console.log(buffer)  // ✔️

try{
    
}catch(e){
    console.error(e);
}
console.log(amf);


while(false){
    // const ByteArray = require('bytearray-node');
    // var ba = new ByteArray(buffer);
    // var amf = ba.readObject();  // undefined
    // // https://github.com/Zaseth/bytearray-node/issues/9#event-3100183963

    // var Decoder = require('node-amf3').Decoder;  // ❌
    // var decoder = new Decoder(buffer);
    // var amf = decoder.decode();

    // var stream = fs.createReadStream(".test/amf")
    // var amfjs = require("amfjs")  // ❌
    // // var encoder = new amfjs.AMFEncoder(someKindOfWritableStream)
    // // encoder.writeObject(10, amfjs.AMF0) //Write as AMF0
    // // encoder.writeObject(10, amfjs.AMF3) //Write as AMF3
    // var decoder = new amfjs.AMFDecoder(stream)  // ❌
    // // var value = decoder.decode(amfjs.AMF0) //Decode an AMF0 object
    // var value = decoder.decode(amfjs.AMF3) //Decode an AMF3 object

    // const { AMF3 } = require('rtmp-amf')  // ❌
    // const amf3 = new AMF3()
    // const amf3Buffer = amf3.encode('connect', 3)
    // const [command, streamId] = amf3.decode(amf3Buffer)  // ❌❌

    // const libamf = require('libamf');  // ❌
    // const data = libamf.serialize({'a':3, 'b':4}, libamf.ENCODING.AMF3);
    // const obj = libamf.deserialize(data, libamf.ENCODING.AMF3);  // ✔️
    // console.log(data)
    // console.log(obj)

    // const Amf_js = require('amf-js');  // ❌
    // 

    // const Amf = require('amf');  // ❌
    // var data = new Buffer('03 00 03 66 6f 6f 02 00 03 62 61 72 00 00 09'.replace(/ /g, ''), 'hex');
    // console.log(data)
    // var obj = Amf.read(data, 0);
    // console.log(obj);
}

console.log("done!")
