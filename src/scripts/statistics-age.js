import '../styles/reset.scss';
import '../styles/admin.scss';
import '../styles/layer.scss';
import datepicker from './lib/datepicker';
import navigationEvent from './lib/navigationEvent';
import statisticsApi from './lib/statisticsApi';
import api from './lib/api';

let pageCount = 1;
let lastPageNum = 0;
let userItems;
let sDate,
  eDate,
  totalCount = 0,
  totalUserCount = 0;
let columns = [
  { header: '캐릭터', key: 'character', width: 25 },
  { header: '환경', key: 'contentId', width: 25 },
  { header: '불가능하다', key: '0', width: 25 },
  { header: '아주 어렵다', key: '1', width: 25 },
  { header: '조금 어렵다', key: '2', width: 25 },
  { header: '아주 쉽다', key: '3', width: 25 },
];
let rows = [];
let tempRows = [];
const charNums = [];
let ageGte, ageLte;

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
        datepicker();
        onLoadData();
        document.getElementById('findBtn').onclick = () => {
          onLoadData();
        };

        document.getElementById('userListBtn').onclick = () => {
          onloadUserTable();
          layerPopup();
        };

        document.getElementById('dim').onclick = () => {
          layerPopupClose();
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

        document.getElementById('viewStatisticsBtn').onclick = () => {
          onLoadData();
          layerPopupClose();
        };

        const container = document.getElementsByClassName('contents-area')[0];
        for (let index = 0; index < 30; index++) {
          container.innerHTML += `
                  <div class="contents-section">
                  <h4>캐릭터${index + 1}</h4>
                  <div class="graph-wrap">
                  <div class="graph-img"><img id="graph_img_${
                    index + 1
                  }" alt=""></div>
                  <div class="graph">
                  <canvas id="chart${index + 1}"></canvas>
                  </div>
                  </div>
                  </div>
              `;

          import(`../images/MER_01/${index + 1}.png`).then((img) => {
            document.getElementById(`graph_img_${index + 1}`).src = img.default;
          });

          charNums.push(`C${index + 1}`);
        }

        document.getElementsByClassName('btn btn-excel')[0].onclick = () => {
          tempRows.sort(arrOrder('charNum'));
          tempRows.forEach((tempRow) => {
            tempRow.data.forEach((item) => {
              rows.push({
                character: `C${tempRow.charNum}`,
                contentId: item.label,
                0: item.data[0],
                1: item.data[1],
                2: item.data[2],
                3: item.data[3],
              });
            });
          });
          api(
            'post',
            'excel/download',
            {
              columns: columns,
              rows: rows,
            },
            (res) => {
              const blob = new Blob([res.result.data], {
                type: res.result.headers['content-type'],
              });
              var a = document.createElement('a');
              a.href = window.URL.createObjectURL(blob);
              a.download = `통계관리(나이별-${ageGte}세-${ageLte}세) ${sDate}-${eDate}.xlsx`;
              a.click();
            }
          );
        };
        document.getElementsByTagName('body')[0].style.display = 'block';
      }
    }
  });
};

function onLoadData() {
  for (
    let index = 0;
    index < document.getElementsByName('age').length;
    index++
  ) {
    const element = document.getElementsByName('age')[index];
    if (element.checked) {
      const dataVal = element.nextElementSibling.getAttribute('data-val');
      ageGte = dataVal.split('~')[0];
      ageLte = dataVal.split('~')[1];
    }
  }
  totalCount = 0;
  totalUserCount = 0;
  rows = [];
  tempRows = [];
  sDate = document.getElementById('sdate').value;
  eDate = document.getElementById('edate').value;

  const sendData = {
    dateGte: sDate,
    dateLt: eDate,
  };

  let userText = '응답자';

  if (localStorage.getItem('checkUserList')) {
    const checkUserList = JSON.parse(localStorage.getItem('checkUserList'));
    if (checkUserList.length > 0) {
      sendData['userIds'] = JSON.parse(localStorage.getItem('checkUserList'));
    }
    //userText = '선택된 사용자';
  }

  api('post', 'statistics/totalUserCount', sendData, (res) => {
    if (res.msg == 'OK') {
      const data = res.result.data;
      totalUserCount = 0;
      if (data.length > 0) {
        totalUserCount = data[0].totalCount;
      }
      document.getElementById(
        'totalUser'
      ).innerText = `${sDate} ~ ${eDate} ${userText} ${totalUserCount}명 기준`;
      onLoadChart();
    } else {
      console.error('[API] => 응답자를 불러올 수 없습니다.');
    }
  });
}

function layerPopup() {
  var target = document.getElementById('layer01');

  if (target.style.display == 'none') {
    target.style.display = 'block';
  } else {
    target.style.display = 'none';
  }
}

function layerPopupClose() {
  var target = document.getElementById('layer01');
  target.style.display = 'none';
}

async function onLoadChart() {
  const chartOpiton = {
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0,
            max: 100,
            fontSize: 14,
            beginAtZero: true,
          },
          // afterDataLimits(scale) {
          //   scale.max += 1;
          //   scale.min -= 0;
          // },
        },
      ],
      xAxes: [
        {
          barThickness: 20, // number (pixels) or 'flex'
          categoryPercentage: 0.6,
          barPercentage: 1.0,
        },
      ],
    },
    maintainAspectRatio: false,
    tooltips: { enabled: false },
    hover: { mode: null },
    events: [],
    animation: {
      duration: 100,
      onComplete: function () {
        var chartInstance = this.chart,
          ctx = chartInstance.ctx;
        ctx.font = "bold 15px 'Helvetica Neue', Helvetica, Arial, sans-serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = 'black';

        this.data.datasets.forEach(function (dataset, i) {
          var meta = chartInstance.controller.getDatasetMeta(i);
          meta.data.forEach(function (bar, index) {
            var data = dataset.data[index];
            data = Math.round(data * 10) / 10;
            ctx.fillText(data, bar._model.x, bar._model.y - 5);
          });
        });
      },
    },
    legend: {
      position: 'bottom',
    },
    layout: {
      padding: {
        top: 20,
      },
    },
  };

  let keyIndex = 1;

  for await (const key of charNums) {
    const sendData = {
      dataKey: key,
      dateGte: sDate,
      dateLt: eDate,
      ageGte: parseInt(ageGte),
      ageLte: parseInt(ageLte),
    };

    if (localStorage.getItem('checkUserList')) {
      const checkUserList = JSON.parse(localStorage.getItem('checkUserList'));
      if (checkUserList.length > 0) {
        sendData['userIds'] = JSON.parse(localStorage.getItem('checkUserList'));
      }
      keyIndex++;
      if (charNums.length == keyIndex) {
        localStorage.removeItem('checkUserList');
      }
    }

    statisticsApi('post', 'statistics/age', sendData, key, (res) => {
      if (res.msg == 'OK') {
        const charKey = res.key;
        const items = res.result.data;
        const chartData = [
          {
            //데이터
            label: '가파르고 높은 계단', //차트 제목
            data: [
              0,
              0,
              0,
              0, //x축 label에 대응되는 데이터 값
            ],
            backgroundColor: 'rgb(0,118,190)',
          },
          {
            //데이터
            label: '가파르고 긴 경사로', //차트 제목
            data: [
              0,
              0,
              0,
              0, //x축 label에 대응되는 데이터 값
            ],
            backgroundColor: 'rgb(169,41,41)',
          },
          {
            //데이터
            label: '분리된 계단과 경사로', //차트 제목
            data: [
              0,
              0,
              0,
              0, //x축 label에 대응되는 데이터 값
            ],
            backgroundColor: 'rgb(64,159,34)',
          },
          {
            //데이터
            label: '지그재그경사로와 결합된계단', //차트 제목
            data: [
              0,
              0,
              0,
              0, //x축 label에 대응되는 데이터 값
            ],
            backgroundColor: 'rgb(85,15,128)',
          },
          {
            //데이터
            label: '사선경사로가 결합된 낮은계단', //차트 제목
            data: [
              0,
              0,
              0,
              0, //x축 label에 대응되는 데이터 값
            ],
            backgroundColor: 'rgb(15,107,128)',
          },
          {
            //데이터
            label: '자전거레일과 짐경사로가 있는 계단', //차트 제목
            data: [
              0,
              0,
              0,
              0, //x축 label에 대응되는 데이터 값
            ],
            backgroundColor: 'rgb(255,98,0)',
          },
        ];
        items.forEach((item) => {
          const contentIndex = parseInt(item._id.split('_')[2]);
          item.data_key_value_list.forEach((list) => {
            const value = parseInt(list.v);
            // 선택 한 사람 수 값 입력
            chartData[contentIndex - 1].data[value] =
              chartData[contentIndex - 1].data[value] + 1;
            totalCount++;
          });
        });

        let stepUserCounts = [];

        chartData.forEach((chartItems) => {
          let charUserCount = 0;
          chartItems.data.forEach((item) => {
            if (item > 0) {
              charUserCount += item;
            }
          });
          stepUserCounts.push(charUserCount);
        });

        chartData.forEach((chartItems, chartIndex) => {
          chartItems.data.forEach((item, index) => {
            if (item > 0) {
              chartItems.data[index] =
                (item / stepUserCounts[chartIndex]) * 100;
            }
          });
        });

        tempRows.push({
          charNum: parseInt(charKey.replace('C', '')),
          data: chartData,
        });
        const graph = document
          .getElementById(`chart${charKey.replace('C', '')}`)
          .getContext('2d');
        // eslint-disable-next-line no-undef
        new Chart(graph, {
          type: 'bar', // 차트의 형태
          data: {
            // 차트에 들어갈 데이터
            labels: [
              //x 축
              '불가능하다',
              '아주 어렵다',
              '조금 어렵다',
              '아주 쉽다',
            ],
            datasets: chartData,
          },
          options: chartOpiton,
        });
        document.getElementById('totalCount').innerHTML = `<span>전체목록</span>
            총 : ${totalCount}건`;
      } else {
        console.error('[API] => 나이 별 데이터를 불러올 수 없습니다.');
      }
    });
  }
}

function arrOrder(key) {
  return function (a, b) {
    if (a[key] > b[key]) {
      return 1;
    } else if (a[key] < b[key]) {
      return -1;
    }

    return 0;
  };
}

function onloadUserTable() {
  const table = document
    .getElementsByClassName('table')[0]
    .getElementsByTagName('tbody')[0];

  api('get', `users?page=${pageCount}`, {}, (res) => {
    if (res) {
      if (res.msg && res.msg == 'OK') {
        lastPageNum = res.result.headers['last-page'];
        userItems = res.result.data;
        table.innerHTML = '';
        userItems.forEach((item, index) => {
          table.innerHTML += `<tr>
            <td class="tb-check">
              <input id='chkUser_${index}' name="checkbox" type="checkbox" title="선택">
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
          const _id = document
            .getElementById(`userDetail_${index}`)
            .getAttribute('data-val');
          document.getElementById(`userDetail_${index}`).onclick = () => {
            window.open(`mer-detail.html?_id=${_id}`);
          };
          // 유저 체크 이벤트 추가
          document.getElementById(`chkUser_${index}`).onclick = () => {
            if (localStorage.getItem('checkUserList')) {
              const checkUserList = JSON.parse(
                localStorage.getItem('checkUserList')
              );
              if (checkUserList.indexOf(_id) > -1) {
                let filtered = checkUserList.filter((id) => id !== _id);
                localStorage.setItem('checkUserList', JSON.stringify(filtered));
              } else {
                checkUserList.push(_id);
                localStorage.setItem(
                  'checkUserList',
                  JSON.stringify(checkUserList)
                );
              }
            } else {
              localStorage.setItem('checkUserList', JSON.stringify([_id]));
            }
          };
          // 로컬 스토리지에 체크된 리스트 있을 경우
          if (localStorage.getItem('checkUserList')) {
            const checkUserList = JSON.parse(
              localStorage.getItem('checkUserList')
            );
            if (checkUserList.indexOf(_id) > -1) {
              document.getElementById(`chkUser_${index}`).checked = true;
            }
          }
        }
        document.getElementById(
          'pageNav'
        ).innerText = `${pageCount}/${lastPageNum}`;
      } else {
        console.error('[API] => 학생 목록을 불러올 수 없습니다.');
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
