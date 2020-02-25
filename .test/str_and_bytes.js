const fs = require('fs')

/** @var {Buffer} buffer */
let buffer = fs.readFileSync(".test/bytes")
console.log(typeof(buffer))  // Buffer
console.log(buffer)  // ✔️ Buffer(3) [255, 202, 250]


let str = buffer.toString('binary')
console.log(str)  // ⚠️ ÿÊú

/** @var {Buffer} buffer_r */
let buffer_r = Buffer.from(str, 'binary')
console.log(buffer_r)  // ✔️ Buffer(3) [255, 202, 250]


let str2 = buffer.toString()  // 'unt-8'
console.log(str2)  // ⚠️ ���

/** @var {Buffer} buffer_r2 */
let buffer_r2 = Buffer.from(str2, 'binary')
console.log(buffer_r2)  // ❌ Buffer(3) [253, 253, 253]
// here is why a bytes stream could broken during transmission

while(true){

}