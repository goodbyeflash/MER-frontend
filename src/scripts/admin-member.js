import '../styles/reset.scss';
import '../styles/admin.scss';

window.onload = () => {
  var lnb = window.$('nav > ul > li');
  lnb.on('mouseenter',function(){
    window.$(this).siblings().removeClass("active");
    window.$(this).addClass("active");
  }).on('mouseleave', function(){
    window.$('nav > ul > li').removeClass("active");
  });
};