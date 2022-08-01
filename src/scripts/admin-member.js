import '../styles/admin.scss';

window.onload = () => {
  var lnb = window.$('nav > ul > li');
  lnb.on('mouseenter',function(){
    window.$(this).siblings().removeClass("active");
    window.$(this).addClass("active");
  });
};