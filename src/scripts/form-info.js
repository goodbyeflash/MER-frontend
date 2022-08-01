import axios from "axios";

window.onload = () => {
    
console.log("ASDF");

    axios.get("/api/users").then((result) => {
        console.log(result.data);
    }).catch((error) => {
        console.error(error);
    });

    // {
    //     "name" : "김학생",
    //     "sex" : "여",
    //     "age" : "11세",
    //     "address" : "서울시",
    //     "schoolName" : "서울",
    //     "schoolCode" : "S000001",
    //     "type" : "중학교",
    //     "grade" : "2학년"
    //   }

};