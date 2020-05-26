//変数のスコープを限定しておくと良いので、全体を即時関数で囲っておく

    var today=new Date(); 

    var year = today.getFullYear();
    var month = today.getMonth()+1;
    var week = today.getDay();
    var day = today.getDate();
    var week_ja= new Array("日","月","火","水","木","金","土");
    var hour = today.getHours();
    var minute = today.getMinutes();
    var second = today.getSeconds();
    document.write(year+"年"+month+"月"+day+"日 "+week_ja[week]+"曜日　"+hour+"時 "+minute+"分 "+second+"秒 ");



