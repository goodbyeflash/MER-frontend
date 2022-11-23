import '../styles/reset.scss';
import '../styles/admin.scss';
import datepicker from './lib/datepicker';
import navigationEvent from './lib/navigationEvent';
import api from './lib/api';
import statisticsApi from './lib/statisticsApi';

let sDate,
  eDate,
  totalCount = 0,
  totalUserCount = 0;
let columns = [
  { header: '환경', key: 'contentId', width: 25 },
  { header: '불가능하다', key: '0', width: 25 },
  { header: '아주 어렵다', key: '1', width: 25 },
  { header: '조금 어렵다', key: '2', width: 25 },
  { header: '아주 쉽다', key: '3', width: 25 },
];
let rows = [];
const contentKeys = [];

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
        for (let index = 0; index < 6; index++) {
          container.innerHTML += `
                <div class="contents-section">
                <h4>MER_01_0${index + 1}</h4>
                <div class="graph">
                    <canvas id="chart0${index + 1}"></canvas>
                </div>
                </div>
            `;
          contentKeys.push(`MER_01_0${index + 1}`);
        }

        document.getElementsByClassName('btn btn-excel')[0].onclick = () => {
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
              a.download = `통계관리(환경별) ${sDate}-${eDate}.xlsx`;
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
  rows = [];
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
  const backgroundColors = [
    'rgb(0,118,190)',
    'rgb(169,41,41)',
    'rgb(64,159,34)',
    'rgb(0,118,190)',
    'rgb(15,107,128)',
    'rgb(255,98,0)',
  ];
  const chartOpiton = {
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0,
            fontSize: 14,
            beginAtZero: true,
          },
          afterDataLimits(scale) {
            scale.max += 1;
            scale.min -= 0;
          },
        },
      ],
      xAxes: [
        {
          barThickness: 60, // number (pixels) or 'flex'
        },
      ],
    },
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
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

  for await (const key of contentKeys) {
    statisticsApi(
      'post',
      'statistics/env',
      {
        contentId: key,
        dateGte: sDate,
        dateLt: eDate,
      },
      key,
      (res) => {
        if (res.msg == 'OK') {
          const chartDatas = [0, 0, 0, 0];
          const items = res.result.data;
          items.forEach((item) => {
            totalCount++;
            chartDatas[item.datas] = chartDatas[item.datas] + 1;
          });
          rows.push({
            contentId: res.key,
            0: chartDatas[0],
            1: chartDatas[1],
            2: chartDatas[2],
            3: chartDatas[3],
          });
          const graph = document
            .getElementById(`chart${res.key.split('_')[2]}`)
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
              datasets: [
                {
                  data: chartDatas,
                  backgroundColor:
                    backgroundColors[parseInt(res.key.split('_')[2]) - 1],
                  barThickness: 10,
                },
              ],
            },
            options: chartOpiton,
          });
          document.getElementById(
            'totalCount'
          ).innerHTML = `<span>전체목록</span>
            총 : ${totalCount}건`;
        } else {
          console.error('[API] => 환경 별 데이터를 불러올 수 없습니다.');
        }
      }
    );
  }
}
