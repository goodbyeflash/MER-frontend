import '../styles/reset.scss';
import '../styles/admin.scss';
import datepicker from './lib/datepicker';
import navigationEvent from './lib/navigationEvent';
import statisticsApi from './lib/statisticsApi';
import api from './lib/api';

let sDate,
  eDate,
  totalCount = 0,
  totalUserCount = 0,
  charUserCount = 0;
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
let type;

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
        const container = document.getElementById('contents-section-container');
        for (let index = 0; index < 30; index++) {
          container.innerHTML += `
                  <div class="contents-section">
                  <h4>캐릭터${index + 1}</h4>
                  <div class="graph">
                      <canvas id="chart${index + 1}"></canvas>
                  </div>
                  </div>
              `;
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
              a.download = `통계관리(구분별-${type}) ${sDate}-${eDate}.xlsx`;
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
    index < document.getElementsByName('type').length;
    index++
  ) {
    const element = document.getElementsByName('type')[index];
    if (element.checked) {
      type = element.nextElementSibling.textContent;
    }
  }
  totalCount = 0;
  rows = [];
  tempRows = [];
  sDate = document.getElementById('sdate').value;
  eDate = document.getElementById('edate').value;
  api(
    'post',
    'statistics/totalUserCount',
    {
      dateGte: sDate,
      dateLt: eDate,
    },
    (res) => {
      if (res.msg == 'OK') {
        const data = res.result.data;
        totalUserCount = 0;
        if (data.length > 0) {
          totalUserCount = data[0].totalCount;
        }
        document.getElementById(
          'totalUser'
        ).innerText = `${sDate} ~ ${eDate} 응답자 ${totalUserCount}명 기준`;
        onLoadChart();
      } else {
        console.error('[API] => 총 응답자를 불러올 수 없습니다.');
      }
    }
  );
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
      duration: 1,
      onComplete: function () {
        var chartInstance = this.chart,
          ctx = chartInstance.ctx;
        ctx.font = Chart.helpers.fontString(
          Chart.defaults.global.defaultFontSize,
          Chart.defaults.global.defaultFontStyle,
          Chart.defaults.global.defaultFontFamily
        );
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

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
  };

  for await (const key of charNums) {
    statisticsApi(
      'post',
      'statistics/type',
      {
        dataKey: key,
        dateGte: sDate,
        dateLt: eDate,
        type: type,
      },
      key,
      (res) => {
        if (res.msg == 'OK') {
          const charKey = res.key;
          const items = res.result.data;
          const chartData = [
            {
              //데이터
              label: '아주가파른계단', //차트 제목
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
              label: '완만한계단', //차트 제목
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
              label: '일반적인 경사로', //차트 제목
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
              label: '자전거 리프트가 있는 계단', //차트 제목
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
              label: '일반적인 경사로와 계단 혼용', //차트 제목
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
              label: '완만한 경사로와 계단 혼용', //차트 제목
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
              charUserCount++;
            });
          });
          chartData.forEach((chartItems) => {
            chartItems.data.forEach((item, index) => {
              if (item > 0) {
                chartItems.data[index] = (item / charUserCount) * 100;
              }
            });
          });
          charUserCount = 0;
          tempRows.push({
            charNum: parseInt(charKey.replace('C', '')),
            data: chartData,
          });
          const graph = document
            .getElementById(`chart${charKey.replace('C', '')}`)
            .getContext('2d');
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
          document.getElementById(
            'totalCount'
          ).innerHTML = `<span>전체목록</span>
            총 : ${totalCount}건`;
        } else {
          console.error('[API] => 나이 별 데이터를 불러올 수 없습니다.');
        }
      }
    );
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
