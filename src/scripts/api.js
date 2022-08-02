import axios from "axios";

export default async function callApi (method,url,data,cb) {
    let option = {
        method : method,
        url : `${window.location.protocol}//${window.location.hostname}:34000/api/${url}`
    };
    if( data ) 
        option.data = data;    
    axios(option).then((result) => {
        cb && cb(result.data);
    }).catch((error) => {
        console.log(error);
    });
}