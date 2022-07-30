window.onload = () => {
    document.getElementById("test").addEventListener("click",() => {
        // eslint-disable-next-line no-undef
        new daum.Postcode({
            oncomplete: (data) => {
                console.log(data);
            }
        }).open();
    });
};