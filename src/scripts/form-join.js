import '../styles/index.scss';
import api from './api';

window.onload = () => {

    document.getElementsByTagName("body")[0].style.display = "block";

    let message = document.getElementById("message");
    let check1,check2,id,password1,password2,name,hp,email,schoolName,type,schoolCode;

    document.getElementsByClassName("btn btn-ok")[0].onclick = () => {

        check1 = document.getElementById("chk1").checked;
        check2 = document.getElementById("chk1").checked;
        id = document.getElementById("userId").value;
        password1 = document.getElementById("userPassword").value;
        password2 = document.getElementById("userPasswordchk").value;
        name = document.getElementById("userName").value;
        hp = document.getElementById("userPhone").value;
        email = document.getElementById("userEmail").value;
        schoolName = document.getElementById("userSchool").value;
        schoolCode = document.getElementById("codeSchool").value;

        for (let index = 0; index < document.getElementsByName("grade").length; index++) {
            const element = document.getElementsByName("grade")[index];
            if( element.checked )
                type = element.nextElementSibling.innerText;
        }

        if( !check1 || !check2 ) {
            message.innerText = "모든 약관에 동의를 해주세요.";
            return;
        }        

        if( id == "" ) {
            message.innerText = "아이디를 입력해주세요.";
            return;
        }

        if( !password1 || !password2 ) {
            message.innerText = "비밀번호를 입력 해주세요.";
            return;
        } else {            
            if( password1 != password2 ) {
                message.innerText = "비밀번호가 서로 다릅니다.";
                return;
            } else {
                if(!fn_checkPass(password1)) {
                    message.innerText = "비밀번호는 문자, 숫자 필수 포함 6~12자리 입니다.";
                    return;
                }
            }
        }

        if( name == "" ) {
            message.innerText = "성명을 입력해주세요.";
            return;
        }

        if( hp == "" ) {
            message.innerText = "핸드폰을 입력해주세요.";
            return;
        }

        if( schoolName == "" ) {
            message.innerText = "학교명을 입력해주세요.";
            return;
        }

        if( !type ) {
            message.innerText = "구분을 선택해주세요.";
            return;
        }

        const data = {
            "id" : id,
            "password" : password1,
            "name" : name,
            "hp" : hp,
            "email" : email,
            "schoolName" : schoolName,
            "schoolCode" : schoolCode,
            "type" : type,
        };

        api("post","teacher/register",data,(res)=>{
            if( res ) {
                if( res.msg == "OK" ) {                    
                    location.href = "admin-member.html";
                }
                else if( res.msg == "ERROR" ) {
                    if( res.result.response.data == "Conflict" ) {
                        message.innerText = "중복된 아이디 입니다.";
                    } else {
                        message.innerText = "오류가 발생 했습니다.";    
                    }
                }
            } else {
                message.innerText = "오류가 발생 했습니다.";
            }
        });
    };
};

function fn_checkPass(password) {
    var regExp = /^[A-Za-z0-9]{6,12}$/;
    if( !regExp.test(password) ) {
        return false;
    } else {
        return true;
    }
}