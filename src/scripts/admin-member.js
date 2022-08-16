import '../styles/reset.scss';
import '../styles/admin.scss';
import api from './api';

let pageCount = 1;
let lastPageNum = 0;
let type = 'all';
let data = {};
let teacherItems;
let columns = [
  { header: '아이디', key: 'id', width: 25 },
  { header: '성명', key: 'name', width: 25 },
  { header: '휴대폰', key: 'hp', width: 25 },
  { header: '권한', key: 'type', width: 25 },
  { header: '가입일', key: 'publishedDate', width: 30 },
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
            onloadTeacherTable();
          }
        };

        document.getElementById('next').onclick = () => {
          if (pageCount == lastPageNum) {
            return;
          } else {
            pageCount++;
            onloadTeacherTable();
          }
        };

        document.getElementById('findBtn').onclick = () => {
          data = {};
          data[document.getElementById('findSelect').value] =
            document.getElementById('findText').value;
          pageCount = 1;
          type = 'find';
          window.sessionStorage.setItem('teacher_filter', JSON.stringify(data));
          onloadTeacherTable();
        };

        onloadTeacherTable();
      }

      document.getElementById('findClear').onclick = () => {
        window.sessionStorage.clear('teacher_filter');
        document.getElementById('findText').value = '';
        pageCount = 1;
        data = {};
        type == 'all';
        onloadTeacherTable();
      };

      document.getElementsByClassName('btn btn-excel')[0].onclick = () => {
        api(
          'post',
          'excel/download',
          {
            columns: columns,
            rows: teacherItems,
          },
          (res) => {
            const blob = new Blob([res.result.data], {
              type: res.result.headers['content-type'],
            });
            var a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = '회원리스트.xlsx';
            a.click();
          }
        );
      };

      document.getElementsByTagName('body')[0].style.display = 'block';
    }
  });
};

function onloadTeacherTable() {
  const table = document
    .getElementsByClassName('table')[0]
    .getElementsByTagName('tbody')[0];
  const filter = window.sessionStorage.getItem('teacher_filter');
  let method = type == 'find' || filter ? 'post' : 'get';
  let url = type == 'find' || filter ? 'teacher/find' : 'teacher';

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
        teacherItems = res.result.data;
        table.innerHTML = '';
        teacherItems.forEach((item, index) => {
          table.innerHTML += `<tr>
          <td rowspan="2" class="tb-check">
            <input type="checkbox" title="선택">
          </td>
          <td rowspan="2">${item.id}</td>
          <td rowspan="2">${item.name}</td>
          <td colspan="6">
            <div class="form-group inline">
              <input id="radio1" type="radio" name="radio1">
              <label for="radio1">아이핀</label>
            </div>

            <div class="form-group inline">
              <input id="radio2" type="radio" name="radio1">
              <label for="radio2">휴대폰</label>
            </div>
          </td>
          <td rowspan="2">${item.hp}</td>
          <td rowspan="2">정상 / ${item.type}</td>
          <td>${new Date(item.publishedDate).YYYYMMDDHHMMSS()}</td>
          <td rowspan="2"><span id="update_${index}" data-val="${
            item._id
          }">수정</span>｜ 그룹</td>
        </tr>
        <tr>
          <td>YES</td>
          <td><input type="checkbox"></td>
          <td><input type="checkbox"></td>
          <td><input type="checkbox"></td>
          <td><input type="checkbox"></td>
          <td><input type="checkbox"></td>
          <td>${new Date(item.publishedDate).YYYYMMDDHHMMSS()}</td>
        </tr>`;
        });

        for (let index = 0; index < teacherItems.length; index++) {
          document.getElementById(`update_${index}`).onclick = (e) => {
            location.href = `admin-member-detail.html?_id=${e.target.getAttribute(
              'data-val'
            )}`;
          };
        }
        document.getElementById(
          'pageNav'
        ).innerText = `${pageCount}/${lastPageNum}`;
      } else {
        console.log('[API] => 선생 목록을 불러올 수 없습니다.');
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
