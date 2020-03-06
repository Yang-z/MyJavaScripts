while(false){
    var dic = {
        key0: "value0",
        'key0_s': 0
    };
    console.log(typeof(dic));
    console.log(dic);
    console.log(dic.key0);
    console.log(dic.key0_s);

    dic['key1'] = "value1";
    dic['sub_dic'] = {};
    dic['sub_dic']['sub_key1'] = "sub_value1";

    console.log(dic);

    break;
}

while(true){
    (async function main(){
        console.log('wait 15s')
        await new Promise(r => setTimeout(r, 5000));
        console.log('wait 10s')
        await new Promise(r => setTimeout(r, 5000));
        console.log('wait 5s')
        await new Promise(r => setTimeout(r, 5000));
        console.log("async done.")
    })();

    break;

}


console.log("done!")
