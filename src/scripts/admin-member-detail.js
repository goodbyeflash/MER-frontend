import '../styles/reset.scss';
import '../styles/admin.scss';
import api from "./api";

window.onload = () => {
    var lnb = window.$('nav > ul > li');
    lnb.on('mouseenter',function(){
        window.$(this).siblings().removeClass("active");
        window.$(this).addClass("active");
    }).on('mouseleave', function(){
        window.$('nav > ul > li').removeClass("active");
    });

    const params = new URLSearchParams(window.location.search);
    const _id = params.get("_id"); // is the number 123
    if( _id ) {
        api("get",`teacher/${_id}`,undefined,(res) => {
            if( res.msg == "OK" ) {
                const data = res.result.data;
                const idEl = document.getElementById("id");
                const passwordEl = document.getElementById("password");
                const nameEl = document.getElementById("name");
                const schoolNameEl = document.getElementById("schoolName");
                const emailEl = document.getElementById("email");
                const hpEl = document.getElementById("hp");
                const schoolCodeEl = document.getElementById("schoolCode");
                const messageEl = document.getElementById("message");
                let type;

                idEl.innerText = data.id;
                nameEl.value = data.name;
                schoolNameEl.value = data.schoolName;

                const radioGroup = [...document.getElementsByName("radio1")];
                radioGroup.forEach((radioEl) => {
                    if( radioEl.nextElementSibling.innerText == data.type ) {
                        type = data.type;
                        radioEl.checked = true;
                    }
                });

                emailEl.value = data.email;
                hpEl.value = data.hp;
                schoolCodeEl.value = data.schoolCode;

                passwordEl.onkeydown = (e) => {
                    if( e.code == "Space" ) {
                        console.log("SDF");
                        return;
                    }
                };

                document.getElementById("updateBtn").onclick = () => {                    

                    radioGroup.forEach((radioEl) => {
                        if( radioEl.checked ) {
                            type = radioEl.nextElementSibling.innerText;
                        }
                    });

                    if( nameEl.value == "" ) {
                        messageEl.innerText = "성명을 입력해주세요.";
                        return;
                    }
            
                    if( hpEl.value == "" ) {
                        messageEl.innerText = "핸드폰을 입력해주세요.";
                        return;
                    }
            
                    if( schoolNameEl.value == "" ) {
                        messageEl.innerText = "학교명을 입력해주세요.";
                        return;
                    }
            
                    if( !type ) {
                        messageEl.innerText = "구분을 선택해주세요.";
                        return;
                    }

                    const patchData = {
                        name : nameEl.value,
                        hp : hpEl.value,
                        schoolName : schoolNameEl.value,
                        type : type,
                    };

                    if( passwordEl.value.length > 0 ) {                        
                        if(!fn_checkPass(passwordEl.value)) {
                            messageEl.innerText = "비밀번호는 문자, 숫자 필수 포함 6~12자리 입니다.";
                            return;
                        }
                        patchData["password"] = passwordEl.value;
                    }

                    messageEl.innerText = "";
                    api("patch",`teacher/${_id}`,patchData,(res) => {                        
                        if( res.msg == "OK" ) {
                            history.back();
                        } else {
                            messageEl.innerText = "오류가 발생 하였습니다.";
                        }
                    });
                };
                document.getElementsByTagName("body")[0].style.display = "block";
            }
        });

    }

};


function fn_checkPass(password) {
    var regExp = /^[A-Za-z0-9]{6,12}$/;
    if( !regExp.test(password) ) {
        return false;
    } else {
        return true;
    }
}
