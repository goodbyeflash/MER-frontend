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
}
