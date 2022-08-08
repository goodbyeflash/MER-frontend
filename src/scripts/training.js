window.onload = () => {
    
    const onClickMERContent = (e) => {
        document.getElementById("list").style.display = "none";
        document.getElementById("iframe").src = `./public/content/${e.target.id}/index.html`;
        document.getElementById("frameArea").style.display = "block";
        //Todo.. 모바일 체크해서 가로로 변경
        //document.getElementsByTagName("html")[0].style.transform = 'rotate(90deg)';
    };

    document.addEventListener('click',(e) => {
        if( e.target.id.indexOf("MER_") > -1 ) {
            onClickMERContent(e);
        }
    });

};