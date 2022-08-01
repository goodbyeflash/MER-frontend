import '../styles/index.scss';
import axios from "axios";

window.onload = () => {
    axios.get(`${window.location.protocol}//${window.location.hostname}:${window.location.hostname.indexOf("goodbye-flash") > -1 ? 34000 : 4000}/api/users`).then((result) => {
        console.log(result.data);
    }).catch((error) => {
        console.error(error);
    });
};