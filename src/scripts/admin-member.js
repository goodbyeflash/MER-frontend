import '../styles/reset.scss';
import '../styles/admin.scss';
import api from "./api";

let pageCount = 1;
let lastPageNum = 0;
let type = "all";
let data = {};

window.onload = () => {

  api("get","teacher/check",undefined,(res)=>{
    if( res ) {      
      if(res.msg && res.msg == "ERROR" ) {
        location.href = "admin.html";
        return;
      }
      if( res.result.data.type == "관리자" ) {
        //Todo.. 관리자 메뉴 확인
      } else {
        var lnb = window.$('nav > ul > li');
        lnb.on('mouseenter',function(){
          window.$(this).siblings().removeClass("active");
          window.$(this).addClass("active");
        }).on('mouseleave', function(){
          window.$('nav > ul > li').removeClass("active");
        });
      
        document.getElementById("logout").onclick = () => {
          api("post","teacher/logout",undefined,(res)=>{
            if( res ) {
              location.href = "admin.html";
            }
          });
        };

        document.getElementById("prev").onclick = () => {
          if( pageCount == 1 ) {
            return;
          } else {
            pageCount--;
            onloadTeacherTable();
          }
        };

        document.getElementById("next").onclick = () => {
          if( pageCount == lastPageNum ) {
            return;
          } else {
            pageCount++;
            onloadTeacherTable();
          }
        };

        document.getElementById("findBtn").onclick = () => {
          data = {};
          data[document.getElementById("findSelect").value] = document.getElementById("findText").value;
          pageCount = 1;
          type = "find";
          onloadTeacherTable();
        };

        onloadTeacherTable();
        
      }
      document.getElementsByTagName("body")[0].style.display = "block";
    }
  });

};

function onloadTeacherTable() {

  const table = document.getElementsByClassName("table")[0].getElementsByTagName("tbody")[0];
  let method = type == "find" ? "post" : "get";
  let url = type == "find" ? "teacher/find" : "teacher";  

  api(method,`${url}?page=${pageCount}`,data,(res)=>{
    console.log(res);
    if( res ) {
      if( res.msg && res.msg == "OK" ) {
        lastPageNum = res.result.headers['last-page'];
        const teacherItems = res.result.data;
        table.innerHTML = "";
        teacherItems.forEach((item)=>{
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
          <td>${item.publishedDate}</td>
          <td rowspan="2">수정 ｜ 그룹</td>
        </tr>
        <tr>
          <td>YES</td>
          <td><input type="checkbox"></td>
          <td><input type="checkbox"></td>
          <td><input type="checkbox"></td>
          <td><input type="checkbox"></td>
          <td><input type="checkbox"></td>
          <td>${item.publishedDate}</td>
        </tr>`;
        });

        document.getElementById("pageNav").innerText = `${pageCount}/${lastPageNum}`;

      } else {
        console.log("선생 목록을 불러올 수 없음");
      }
    }
  });

}

