(function () {
    var oPicList = document.getElementById('picList');
    var aLi = oPicList.getElementsByTagName('li');

    for (var i = 0; i < aLi.length; i++) {
        aLi[i].index = i;
        var current=0;
        aLi[i].onclick = function () {
            current=(current+90)%360;
            aLi[this.index].style.transform = 'rotate('+current+'deg)';

        };
    }
    var oMoreWay = document.getElementById('moreWay');
    var oDiv=oMoreWay.getElementsByTagName('div')[0];
    utils.setCss(oDiv,'display','none');
    oMoreWay.onclick= function () {
        var isBok=utils.css(oDiv,'display');
        if(isBok==='none'){
            utils.css(oDiv,'display','block');
        }else{
            utils.css(oDiv,'display','none');
        }
    }


})();



