import api from './api';

export default function navigationEvent() {
  let lnb = window.$('nav > ul > li');
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

}
