import '../styles/reset.scss';
import '../styles/admin.scss';
import navigationEvent from './navigationEvent';
import api from './api';

window.onload = () => {
  api('get', 'teacher/check', undefined, (res) => {
    if (res) {
      if (res.msg && res.msg == 'ERROR') {
        location.href = 'admin.html';
        return;
      }
      if (res.result.data.type == '관리자') {
        //Todo.. 관리자 메뉴 확인
      } else {
        navigationEvent();

        const params = new URLSearchParams(window.location.search);
        const _id = params.get('_id');
        if (_id) {
          api('get', `users/${_id}`, undefined, (res) => {
            if (res.msg == 'OK') {
              const item = res.result.data;
              document.getElementById('usertbody').innerHTML = `
                  <tr>
                      <th>성명</th>
                      <td colspan="5">${item.name}</td>
                    </tr>
      
                    <tr>
                      <th>성별</th>
                      <td>
                        <div class="tb-form">
                          <div class="form-group inline">
                            ${item.sex}
                          </div>
                        </div>
                      </td>
                      <th>나이(만)</th>
                      <td colspan="3">${item.age}세</td>
                    </tr>
      
                    <tr>
                      <th>거주지</th>
                      <td colspan="5">${item.address}</td>
                    </tr>
      
                    <tr>
                      <th>구분</th>
                      <td>${item.type}</td>
                      <th>학교명</th>
                      <td>${item.schoolName}</td>
                      <th>학년</th>
                      <td>${item.grade}</td>
                  </tr>`;
              document.getElementsByTagName('body')[0].style.display = 'block';
            }
          });
          api('post', 'content/read', { userId: _id }, (res) => {
            if (res.msg == 'OK') {
              const items = res.result.data;
              items.forEach((item) => {
                const contentId = item.contentId;
                const keys = Object.keys(item.data);
                keys.forEach((key) => {
                  document.getElementById(`${contentId}_${key}`).textContent =
                    numberToText(item.data[key]);
                });
              });
            }
          });
        }

        const container = document.getElementById('contents-section-container');
        for (let index = 0; index < 6; index++) {
          const contentId = `MER_01_0${index + 1}`;
          container.innerHTML += `
                  <div class="contents-section">
                  <h4>${contentId}</h4>
                  <div class="table">
                      <table class="tb full lt">
                          <colgroup>
                              <col style="width: 12%">
                              <col style="width: 24%">
                              <col style="width: 12%">
                              <col style="width: 24%">
                          </colgroup>
                          <tbody>
                              <tr>
                                  <th>첨부파일</th>
                                  <td>표정아이콘_ON</td>
                                  <th>첨부파일</th>
                                  <td>표정아이콘_OFF</td>
                              </tr>
                              ${buildCharTr(contentId)}
                          </tbody>
                      </table>
                  </div>
              </div>`;
        }

        document.getElementsByClassName('btn btn-primary')[0].onclick = () => {
          history.back();
        };
      }
    }
  });
};

function numberToText(index) {
  const texts = ['불가능하다', '아주 어렵다', '조금 어렵다', '아주 쉽다'];
  return `${index}. ${texts[index]}`;
}

function buildCharTr(id) {
  let elementText = '';
  for (let index = 0; index < 30; index++) {
    elementText += `<tr>
        <th>캐릭터${index + 1}</th>
        <td colspan="3" id="${id}_C${index + 1}">-</td>
      </tr>`;
  }
  return elementText;
}
