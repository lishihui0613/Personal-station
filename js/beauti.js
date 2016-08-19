(function () {
    var oInner=document.getElementById('inner');
    var aSpan=oInner.getElementsByTagName('span');
    var oUl=document.getElementById('list');
    var oInp=oInner.getElementsByTagName('input')[0];
    var nList=document.getElementById('nList');
    var oA=document.getElementById('more');
    var oI=nList.getElementsByTagName('i')[0];
    var cLeft=document.getElementById('cLeft');
    var aDiv=cLeft.getElementsByTagName('div');
    var aLi=utils.getChildren(cLeft);
    var aUl=cLeft.getElementsByTagName('ul');
    for(var i=0;i<aSpan.length;i++){
        aSpan[i].index=i;
        aSpan[i].onclick= function () {
            for(var j=0;j<aSpan.length;j++){
                aSpan[j].className='';
                if(this.index===1){
                    //utils.css(oInp,'placeholder',' ');
                    oInp.setAttribute('placeholder','');
                    break;
                }else{
                    oInp.setAttribute('placeholder','帆布鞋 清爽夏日穿搭范本！');
                }
            }
            this.className='active';
        }
    }
    oInp.onkeyup=oInp.onfocus= function () {
        var val=this.value.replace(/(^ +)|( +$)/g,'');
        oUl.style.display=val.length>0?'block':'none';
    };
    document.body.onclick= function (e) {
        e=e||window.event;
        var tar= e.target|| e.srcElement;
        if(tar.id==='search'){
            return;
        }
        if(tar.tagName.toLowerCase()==='a' && tar.parentNode.parentNode.id==='list'){
            oInp.value=tar.innerHTML;
        }
        oUl.style.display='none';
    };
    oA.onmouseover= function () {
        oI.className='up';
    };
    oA.onmouseout= function () {
        oI.className='down';
    }
    //实现左侧主要内容部分：选项卡
    /*for(var j=0;j<aLi.length;j++){
        aLi[j].index=j;
        aLi[j].onmouseover= function () {
            aUl[this.index].style.display='block';
            /!* aLi[this.index].style.border='1px solid #eee';
             aLi[this.index].style.borderTop='none';
             aLi[this.index].style.borderLeft='none';
             aLi[this.index].style.borderRight='none';*!/
            //aLi[this.index].style.borderRight='none';
            aDiv[this.index].style.borderBottom='none';

            utils.css(aLi[this.index],{
                borderTop:'1px solid #eee',
                borderBottom:'1px solid #eee',
                background:'#fff',
                zIndex:100,
                width:239

            });
            var prev=utils.prev(aDiv[this.index]);
            prev.style.borderBottom='none';
        }
        aLi[j].onmouseout= function () {
            aUl[this.index].style.display='none';
        }
    }*/

    //轮播图
    var oBox=document.getElementById('box');
    var oBanner=oBox.getElementsByTagName('div')[0];
    var aDivB=oBanner.getElementsByTagName('div');
    var aImg=oBanner.getElementsByTagName('img');
    var oUlB=oBox.getElementsByTagName('ul')[0];
    var aLiB=oBox.getElementsByTagName('li');
    var aBtnLeft=oBox.getElementsByTagName('a')[0];
    var aBtnRight=oBox.getElementsByTagName('a')[1];
    var step=0;
    var autoTimer=null;
    var interval=2000;
    lazyImg();
    function lazyImg(){
        for(var i=0;i<aImg.length;i++){
            var tmpImg=new Image;
            tmpImg.src=aImg[i].getAttribute('realImg');
            tmpImg.index=i;
            tmpImg.onload= function () {
                aImg[this.index].src=this.src;
                utils.css(aDivB[0],'zIndex',1);
                zhufengAnimate(aDivB[0],{opacity:1},1000);
                tmpImg=null;
            }
        }
    }
    clearInterval(autoTimer);
    autoTimer=setInterval(move,interval);
    function move(){
        if(step>=aDivB.length-1){
            step=-1;
        }
        step++;
        setBanner();
    }
    function setBanner(){
        for(var i=0;i<aDivB.length;i++){
            var cur=aDivB[i];
            if(i===step){
                utils.css(cur,'zIndex',1);
                zhufengAnimate(cur,{opacity:1},1000, function () {
                    var siblings=utils.siblings(this);
                    for(var i=0;i<siblings.length;i++){
                        utils.css(siblings[i],'opacity',0);
                    }
                })
            }else{
                utils.css(cur,'zIndex',0);
            }
        }
        bannerTip();
    }
    function bannerTip(){
        for(var i=0;i<aLiB.length;i++){
            aLiB[i].className=i===step?'bg':'';
        }
    }
    oBox.onmouseover= function () {
        clearTimeout(autoTimer);
        aBtnLeft.style.display=aBtnRight.style.display='block';
    };
    oBox.onmouseout= function () {
        autoTimer=setInterval(move,interval);
        aBtnLeft.style.display=aBtnRight.style.display='none';
    };
    aBtnLeft.onclick= function () {
        if(step<=0){
            step=aDivB.length;
        }
        step--;
        setBanner();
    };
    aBtnRight.onclick= function () {
        move();
    }
})();
(function () {
    var oNavList=document.getElementById('navList');
    window.onscroll=function(){
        if(utils.win("scrollTop")>=151){
            utils.css(oNavList,{
                position:"fixed",
                top:0,
                left:0,
                zIndex:1000
            });
        }else{
            oNavList.style.position="";
        }
    }
})();
(function () {
    var oTo=document.getElementById('toTop');
    var timer=null;
    window.onscroll=computeDisplay;
    function computeDisplay(){
        if(utils.win('scrollTop')>10){
            oTo.style.display='block';
        }else{
            oTo.style.display='none';
        }
    }
    oTo.onclick= function () {
        oTo.style.display='none';
        var curTop=0;
        utils.win('scrollTop',curTop)
    }
})();



