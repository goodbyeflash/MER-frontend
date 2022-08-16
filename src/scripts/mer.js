import '../styles/reset.scss';
import '../styles/admin.scss';
import api from './api';

let pageCount = 1;
let lastPageNum = 0;
let type = 'all';
let data = {};
let userItems;
let columns = [
  { header: '이름', key: 'name', width: 25 },
  { header: '성별', key: 'sex', width: 25 },
  { header: '나이', key: 'age', width: 25 },
  { header: '거주지', key: 'address', width: 25 },
  { header: '학교 이름', key: 'schoolName', width: 25 },
  { header: '학교 코드', key: 'schoolCode', width: 25 },
  { header: '구분', key: 'type', width: 25 },
  { header: '학년', key: 'grade', width: 25 },  
  { header: '참여일', key: 'publishedDate', width: 30 },
];

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
          var lnb = window.$('nav > ul > li');
          lnb
            .on('mouseenter', function () {
              window.$(this).siblings().removeClass('active');
              window.$(this).addClass('active');
            })
            .on('mouseleave', function () {
              window.$('nav > ul > li').removeClass('active');
            });
  
          document.getElementById('logout').onclick = () => {
            api('post', 'teacher/logout', undefined, (res) => {
              if (res) {
                location.href = 'admin.html';
              }
            });
          };
  
          document.getElementById('prev').onclick = () => {
            if (pageCount == 1) {
              return;
            } else {
              pageCount--;
              onloadUserTable();
            }
          };
  
          document.getElementById('next').onclick = () => {
            if (pageCount == lastPageNum) {
              return;
            } else {
              pageCount++;
              onloadUserTable();
            }
          };
  
          document.getElementById('findBtn').onclick = () => {
            data = {};
            data[document.getElementById('findSelect').value] =
              document.getElementById('findText').value;
            pageCount = 1;
            type = 'find';
            window.sessionStorage.setItem('user_filter', JSON.stringify(data));
            onloadUserTable();
          };
  
          onloadUserTable();
        }
  
        document.getElementById('findClear').onclick = () => {
          window.sessionStorage.clear('user_filter');
          document.getElementById('findText').value = '';
          pageCount = 1;
          data = {};
          type == 'all';
          onloadUserTable();
        };
  
        document.getElementsByClassName('btn btn-excel')[0].onclick = () => {
          api(
            'post',
            'excel/download',
            {
              columns: columns,
              rows: userItems,
            },
            (res) => {
              const blob = new Blob([res.result.data], {
                type: res.result.headers['content-type'],
              });
              var a = document.createElement('a');
              a.href = window.URL.createObjectURL(blob);
              a.download = '유저리스트.xlsx';
              a.click();
            }
          );
        };
  
        document.getElementsByTagName('body')[0].style.display = 'block';
      }
    });
  };
  
  function onloadUserTable() {
    const table = document
      .getElementsByClassName('table')[0]
      .getElementsByTagName('tbody')[0];
    const filter = window.sessionStorage.getItem('user_filter');
    let method = type == 'find' || filter ? 'post' : 'get';
    let url = type == 'find' || filter ? 'users/find' : 'users';
  
    // 검색 된 필터 있을 경우
    if (filter) {
      data = JSON.parse(filter);
      const key = Object.keys(data)[0];
      const value = data[key];
      const selectOptions = [
        ...document.getElementById('findSelect').getElementsByTagName('option'),
      ];
      selectOptions.forEach((optionEl) => {
        if (optionEl.value == key) {
          optionEl.selected = true;
        }
      });
      document.getElementById('findText').value = value;
    }
  
    api(method, `${url}?page=${pageCount}`, data, (res) => {        
      if (res) {
        if (res.msg && res.msg == 'OK') {
          lastPageNum = res.result.headers['last-page'];
          userItems = res.result.data;
          table.innerHTML = '';
          userItems.forEach((item, index) => {
            table.innerHTML += `<tr>
            <td class="tb-check">
              <input type="checkbox" title="선택">
            </td>
            <td>${item.name}</td>
            <td>${item.sex}</td>
            <td>${item.age}</td>
            <td>${item.address}</td>
            <td>${item.schoolName}</td>
            <td>${item.grade}</td>
            <td>${item.type}</td>
            <td>${new Date(item.publishedDate).YYYYMMDDHHMMSS()}</td>
            <td id='userDetail_${index}' data-val='${item._id}'>보기</td>
          </tr>`;
          });
  
          for (let index = 0; index < userItems.length; index++) {
            document.getElementById(`userDetail_${index}`).onclick = (e) => {
              location.href = `mer-detail.html?_id=${e.target.getAttribute(
                'data-val'
              )}`;
            };
          }
          document.getElementById(
            'pageNav'
          ).innerText = `${pageCount}/${lastPageNum}`;
        } else {
          console.log('[API] => 학생 목록을 불러올 수 없습니다.');
        }
      }
    });
  }
  
  function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  }
  
  Date.prototype.YYYYMMDDHHMMSS = function () {
    var yyyy = this.getFullYear().toString();
    var MM = pad(this.getMonth() + 1, 2);
    var dd = pad(this.getDate(), 2);
    var hh = pad(this.getHours(), 2);
    var mm = pad(this.getMinutes(), 2);
    var ss = pad(this.getSeconds(), 2);
  
    return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
  };
  