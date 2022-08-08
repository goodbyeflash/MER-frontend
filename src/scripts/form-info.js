import '../styles/index.scss';
import api from './api';

window.onload = () => {

    let message = document.getElementById("message");
    let sex, age, address1, address2, type, grade;

    document.getElementById("next").onclick = (e) => {

        const name = document.getElementById("name").value;

        for (let index = 0; index < document.getElementsByName("sex").length; index++) {
            const element = document.getElementsByName("sex")[index];
            if( element.checked )
                sex = element.nextElementSibling.innerText;
        }

        for (let index = 0; index < document.getElementsByName("group").length; index++) {
            const element = document.getElementsByName("group")[index];
            if( element.checked )
                type = element.nextElementSibling.innerText;
        }

        for (let index = 0; index < document.getElementsByName("grade").length; index++) {
            const element = document.getElementsByName("grade")[index];
            if( element.checked )
                grade = element.nextElementSibling.innerText;
        }

        if( name == "" ) {
            message.innerText = "이름을 입력해주세요.";
            return;
        }

        if( !sex ) {
            message.innerText = "성별을 선택해주세요.";
            return;
        }

        if( !type ) {
            message.innerText = "구분을 선택해주세요.";
            return;
        }

        if( !grade ) {
            message.innerText = "학년을 선택해주세요.";
            return;
        }

        const data = {
            name : name,
            sex : sex,
            age : age,
            address : `${address1} ${address2}`,
            schoolName : document.getElementById("school").value,
            schoolCode : document.getElementById("code").value,
            type : type,
            grade : grade
        };

        api("post","users",data,(res)=>{
            console.log(res);
            if( res ) {
                if( res.msg == "OK" ) {
                    location.href = "training.html";
                }
                else if( res.msg == "ERROR" ) {
                    message.innerText = "오류가 발생 했습니다.";
                }
            } else {
                message.innerText = "오류가 발생 했습니다.";
            }
        });
        
    };

    const ageSelect = document.getElementById("sel1");
    age = ageSelect.options[ageSelect.selectedIndex].text;
    ageSelect.addEventListener('change', ()=>{
        age = ageSelect.options[ageSelect.selectedIndex].text;
    });

    const addressSelect1 = document.getElementById("sel2");
    address1 = addressSelect1.options[addressSelect1.selectedIndex].text;
    addressSelect1.addEventListener('change', ()=>{
        address1 = addressSelect1.options[addressSelect1.selectedIndex].text;
    });

    const addressSelect2 = document.getElementById("sel3");
    address2 = addressSelect2.options[addressSelect2.selectedIndex].text;
    addressSelect2.addEventListener('change', ()=>{
        address2 = addressSelect1.options[addressSelect2.selectedIndex].text;
    });

};
