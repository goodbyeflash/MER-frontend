import '../styles/index.scss';
import api from './lib/api';
import koreaDistict from './lib/korea-administrative-district.json';

const koreaAddress = koreaDistict.data;

window.onload = () => {
  if (window.localStorage.getItem('user_data')) {
    location.href = 'training.html';
  } else {
    onLoadKoreaAddress();

    document.getElementsByTagName('body')[0].style.display = 'block';

    let message = document.getElementById('message');
    let sex, age, address, type, grade;

    document.getElementById('next').onclick = () => {
      const name = document.getElementById('name').value;

      for (
        let index = 0;
        index < document.getElementsByName('sex').length;
        index++
      ) {
        const element = document.getElementsByName('sex')[index];
        if (element.checked) sex = element.nextElementSibling.innerText;
      }

      for (
        let index = 0;
        index < document.getElementsByName('group').length;
        index++
      ) {
        const element = document.getElementsByName('group')[index];
        if (element.checked) type = element.nextElementSibling.innerText;
      }

      for (
        let index = 0;
        index < document.getElementsByName('grade').length;
        index++
      ) {
        const element = document.getElementsByName('grade')[index];
        if (element.checked) grade = element.nextElementSibling.innerText;
      }

      const addressSelect1 = document.getElementById('sel2');
      const addressSelect2 = document.getElementById('sel3');

      address = `${addressSelect1.options[addressSelect1.selectedIndex].text} ${
        addressSelect2.options[addressSelect2.selectedIndex].text
      }`;

      if (name == '') {
        message.innerText = '이름을 입력해주세요.';
        return;
      }

      if (!sex) {
        message.innerText = '성별을 선택해주세요.';
        return;
      }

      if (!type) {
        message.innerText = '구분을 선택해주세요.';
        return;
      }

      if (!grade) {
        message.innerText = '학년을 선택해주세요.';
        return;
      }

      const data = {
        name: name,
        sex: sex,
        age: age.replace(/[^0-9]/g, ''),
        address: address,
        schoolName: document.getElementById('school').value,
        schoolCode: document.getElementById('code').value,
        type: type,
        grade: grade,
      };

      api('post', 'users', data, (res) => {
        if (res) {
          if (res.msg == 'OK') {
            window.localStorage.setItem(
              'user_data',
              JSON.stringify(res.result.data)
            );
            location.href = 'training.html';
          } else if (res.msg == 'ERROR') {
            message.innerText = '오류가 발생 했습니다.';
          }
        } else {
          message.innerText = '오류가 발생 했습니다.';
        }
      });
    };

    const ageSelect = document.getElementById('sel1');
    age = ageSelect.options[ageSelect.selectedIndex].text;
    ageSelect.addEventListener('change', () => {
      age = ageSelect.options[ageSelect.selectedIndex].text;
    });
  }
};

function onLoadKoreaAddress() {
  const addressEl = document.getElementById('sel2');
  koreaAddress.forEach((address, index) => {
    const key = Object.keys(address)[0];
    addressEl.innerHTML += `<option ${
      index == 0 ? "selected='selected'" : ''
    } value=${key}>${key}</option>`;
  });
  onChangeKoreaAddress();
  addressEl.onchange = () => {
    onChangeKoreaAddress();
  };
}

function onChangeKoreaAddress() {
  const cityEl = document.getElementById('sel3');
  const key = document.getElementById('sel2').value;
  cityEl.innerHTML = '';
  const citys = koreaAddress.find((address) => Object.keys(address)[0] == key)[
    key
  ];
  if (citys.length > 0) {
    citys.forEach((city, index) => {
      cityEl.innerHTML += `<option ${
        index == 0 ? "selected='selected'" : ''
      } value=${city}>${city}</option>`;
    });
    cityEl.style.display = 'block';
  } else {
    cityEl.style.display = 'none';
  }
}
