import axios from "axios";

export default async function callApi (method,url,data,cb) {
    let option = {
        method : method,
        url : `${window.location.protocol}//${window.location.hostname}:34000/api/${url}`,
        withCredentials: true,
        responseType : "blob",
    };
    if( data ) 
        option.data = data;    
    axios(option).then((result) => {
        cb && cb({ result : result, msg : "OK"});
    }).catch((error) => {
        cb && cb({ result : error, msg : "ERROR"});
    });
}