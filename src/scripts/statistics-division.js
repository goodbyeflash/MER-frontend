import '../styles/reset.scss';
import '../styles/admin.scss';
import navigationEvent from './navigationEvent';

window.onload = () => {
  navigationEvent();
  var graph01 = document.getElementById('chart01').getContext('2d');

  var graph02 = document.getElementById('chart02').getContext('2d');

  var graph03 = document.getElementById('chart03').getContext('2d');

  var graph04 = document.getElementById('chart04').getContext('2d');

  var graph05 = document.getElementById('chart05').getContext('2d');

  var chartOpiton = {
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0,
            fontSize: 14,
          },
          afterDataLimits(scale) {
            scale.max += 1;
            scale.min -= 1;
          },
        },
      ],
      xAxes: [
        {
          barThickness: 30,
          categoryPercentage: 0.6,
          barPercentage: 1.0,
        },
      ],
    },
    maintainAspectRatio: false,
  };

  var myChart01 = new Chart(graph01, {
    type: 'bar', // 차트의 형태
    data: {
      // 차트에 들어갈 데이터
      labels: [
        //x 축
        '아주 쉽다',
        '조금 어렵다',
        '아주 어렵다',
        '불가능하다',
      ],
      datasets: [
        {
          //데이터
          label: '아주가파른계단', //차트 제목
          data: [
            20,
            30,
            40,
            10, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(0,118,190)',
        },
        {
          //데이터
          label: '완만한계단', //차트 제목
          data: [
            30,
            20,
            30,
            20, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(169,41,41)',
        },
        {
          //데이터
          label: '일반적인 경사로', //차트 제목
          data: [
            50,
            10,
            30,
            10, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(64,159,34)',
        },
        {
          //데이터
          label: '자전거 리프트가 있는 계단', //차트 제목
          data: [
            80,
            10,
            5,
            5, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(85,15,128)',
        },
        {
          //데이터
          label: '일반적인 경사로와 계단 혼용', //차트 제목
          data: [
            80,
            10,
            5,
            5, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(15,107,128)',
        },
        {
          //데이터
          label: '완만한 경사로와 계단 혼용', //차트 제목
          data: [
            90,
            5,
            5,
            0, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(255,98,0)',
        },
      ],
    },
    options: chartOpiton,
  });

  var myChart02 = new Chart(graph02, {
    type: 'bar', // 차트의 형태
    data: {
      // 차트에 들어갈 데이터
      labels: [
        //x 축
        '아주 쉽다',
        '조금 어렵다',
        '아주 어렵다',
        '불가능하다',
      ],
      datasets: [
        {
          //데이터
          label: '아주가파른계단', //차트 제목
          data: [
            20,
            30,
            40,
            10, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(0,118,190)',
        },
        {
          //데이터
          label: '완만한계단', //차트 제목
          data: [
            30,
            20,
            30,
            20, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(169,41,41)',
        },
        {
          //데이터
          label: '일반적인 경사로', //차트 제목
          data: [
            50,
            10,
            30,
            10, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(64,159,34)',
        },
        {
          //데이터
          label: '자전거 리프트가 있는 계단', //차트 제목
          data: [
            80,
            10,
            5,
            5, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(85,15,128)',
        },
        {
          //데이터
          label: '일반적인 경사로와 계단 혼용', //차트 제목
          data: [
            80,
            10,
            5,
            5, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(15,107,128)',
        },
        {
          //데이터
          label: '완만한 경사로와 계단 혼용', //차트 제목
          data: [
            90,
            5,
            5,
            0, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(255,98,0)',
        },
      ],
    },
    options: chartOpiton,
  });

  var myChart03 = new Chart(graph03, {
    type: 'bar', // 차트의 형태
    data: {
      // 차트에 들어갈 데이터
      labels: [
        //x 축
        '아주 쉽다',
        '조금 어렵다',
        '아주 어렵다',
        '불가능하다',
      ],
      datasets: [
        {
          //데이터
          label: '아주가파른계단', //차트 제목
          data: [
            20,
            30,
            40,
            10, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(0,118,190)',
        },
        {
          //데이터
          label: '완만한계단', //차트 제목
          data: [
            30,
            20,
            30,
            20, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(169,41,41)',
        },
        {
          //데이터
          label: '일반적인 경사로', //차트 제목
          data: [
            50,
            10,
            30,
            10, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(64,159,34)',
        },
        {
          //데이터
          label: '자전거 리프트가 있는 계단', //차트 제목
          data: [
            80,
            10,
            5,
            5, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(85,15,128)',
        },
        {
          //데이터
          label: '일반적인 경사로와 계단 혼용', //차트 제목
          data: [
            80,
            10,
            5,
            5, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(15,107,128)',
        },
        {
          //데이터
          label: '완만한 경사로와 계단 혼용', //차트 제목
          data: [
            90,
            5,
            5,
            0, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(255,98,0)',
        },
      ],
    },
    options: chartOpiton,
  });

  var myChart04 = new Chart(graph04, {
    type: 'bar', // 차트의 형태
    data: {
      // 차트에 들어갈 데이터
      labels: [
        //x 축
        '아주 쉽다',
        '조금 어렵다',
        '아주 어렵다',
        '불가능하다',
      ],
      datasets: [
        {
          //데이터
          label: '아주가파른계단', //차트 제목
          data: [
            20,
            30,
            40,
            10, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(0,118,190)',
        },
        {
          //데이터
          label: '완만한계단', //차트 제목
          data: [
            30,
            20,
            30,
            20, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(169,41,41)',
        },
        {
          //데이터
          label: '일반적인 경사로', //차트 제목
          data: [
            50,
            10,
            30,
            10, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(64,159,34)',
        },
        {
          //데이터
          label: '자전거 리프트가 있는 계단', //차트 제목
          data: [
            80,
            10,
            5,
            5, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(85,15,128)',
        },
        {
          //데이터
          label: '일반적인 경사로와 계단 혼용', //차트 제목
          data: [
            80,
            10,
            5,
            5, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(15,107,128)',
        },
        {
          //데이터
          label: '완만한 경사로와 계단 혼용', //차트 제목
          data: [
            90,
            5,
            5,
            0, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(255,98,0)',
        },
      ],
    },
    options: chartOpiton,
  });

  var myChart05 = new Chart(graph05, {
    type: 'bar', // 차트의 형태
    data: {
      // 차트에 들어갈 데이터
      labels: [
        //x 축
        '아주 쉽다',
        '조금 어렵다',
        '아주 어렵다',
        '불가능하다',
      ],
      datasets: [
        {
          //데이터
          label: '아주가파른계단', //차트 제목
          data: [
            20,
            30,
            40,
            10, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(0,118,190)',
        },
        {
          //데이터
          label: '완만한계단', //차트 제목
          data: [
            30,
            20,
            30,
            20, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(169,41,41)',
        },
        {
          //데이터
          label: '일반적인 경사로', //차트 제목
          data: [
            50,
            10,
            30,
            10, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(64,159,34)',
        },
        {
          //데이터
          label: '자전거 리프트가 있는 계단', //차트 제목
          data: [
            80,
            10,
            5,
            5, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(85,15,128)',
        },
        {
          //데이터
          label: '일반적인 경사로와 계단 혼용', //차트 제목
          data: [
            80,
            10,
            5,
            5, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(15,107,128)',
        },
        {
          //데이터
          label: '완만한 경사로와 계단 혼용', //차트 제목
          data: [
            90,
            5,
            5,
            0, //x축 label에 대응되는 데이터 값
          ],
          backgroundColor: 'rgb(255,98,0)',
        },
      ],
    },
    options: chartOpiton,
  });

  window.$.datepicker.regional['ko'] = {
    closeText: '닫기',
    prevText: '이전달',
    nextText: '다음달',
    currentText: '오늘',
    monthNames: [
      '1월(JAN)',
      '2월(FEB)',
      '3월(MAR)',
      '4월(APR)',
      '5월(MAY)',
      '6월(JUN)',
      '7월(JUL)',
      '8월(AUG)',
      '9월(SEP)',
      '10월(OCT)',
      '11월(NOV)',
      '12월(DEC)',
    ],
    monthNamesShort: [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ],
    dayNames: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
    weekHeader: 'Wk',
    dateFormat: 'yy-mm-dd',
    firstDay: 0,
    isRTL: false,
    showMonthAfterYear: true,
    yearSuffix: '',
    showOn: 'both',
    buttonText: '달력',
    buttonImage: calendarImg,
    changeMonth: true,
    changeYear: true,
    showButtonPanel: true,
    yearRange: 'c-99:c+99',
  };
  window.$.datepicker.setDefaults(window.$.datepicker.regional['ko']);

  window.$('#sdate').datepicker();
  window.$('#sdate').datepicker('option', 'maxDate', window.$('#edate').val());
  window.$('#sdate').datepicker('option', 'onClose', function (selectedDate) {
    window.$('#edate').datepicker('option', 'minDate', selectedDate);
  });

  window.$('#edate').datepicker();
  window.$('#edate').datepicker('option', 'minDate', window.$('#sdate').val());
  window.$('#edate').datepicker('option', 'onClose', function (selectedDate) {
    window.$('#sdate').datepicker('option', 'maxDate', selectedDate);
  });
};
