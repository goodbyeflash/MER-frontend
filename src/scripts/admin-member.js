import '../styles/admin.scss';
import api from './api';

window.onload = () => {
  var lnb = window.$('nav > ul > li');
  lnb.on('mouseenter',function(){
    window.$(this).siblings().removeClass("active");
    window.$(this).addClass("active");
  });  

  document.getElementById("login").onclick = () => {
    api("post","teacher/login",{
      id : "1234",
      password : "1234",
    },(res)=>{
      console.log(res);
    });
  };


  document.getElementById("checkLogin").onclick = () => {
    api("get","teacher/check",undefined,(res)=>{
      console.log(res);
    });
  };
};