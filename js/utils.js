/**
 * Created by Administrator on 2016/6/24.
 */
var utils=(function () {
    var flag='getComputedStyle' in window;
    function rnd(n, m) {
        n=Number(n);
        m=Number(m);
        if(isNaN(n)|isNaN(m)){
            return Math.random();//如果传的数字无效，之间返回0-1之间随机小数
        }
        if(n>m){
            tmp=n;
            n=m;
            m=tmp;
        }
        return Math.round(Math.random()*(m-n)+n);
    }
    function listToArray(arg) {
        if(flag){
            return Array.prototype.slice.call(arg);
        }
        var ary=[];
        for(var i=0;i<arg.length;i++){
            ary.push(arg[i]);//ary[ary.length]=arg[i];
        }
        /*try{
         ary=Array.prototype.slice.call(arg);
         }catch(e){
         for(var i=0;i<arg.length;i++){
         ary.push(arg[i]);//ary[ary.length]=arg[i];
         }
         }*/
        return ary;
    }
    function jsonParse(jsonStr) {
        return 'JSON' in window?JSON.parse(jsonStr):eval('('+jsonStr+')');
    }
    //处理浏览器盒子模型的兼容性
    function win(attr, value) {
        if(typeof value==='undefined'){//获取需要return
            return document.documentElement[attr]||document.body[attr];
        }
        document.documentElement[attr]=document.body[attr]=value;
    }
    //当前有定位元素到body的距离 {left:l,top:t}
    function offset(curEle) {
        var l=curEle.offsetLeft;
        var t=curEle.offsetTop;
        var par=curEle.offsetParent;
        while(par){
            if(navigator.userAgent.indexOf('MSIE 8.0')===-1){
                l+=par.clientLeft;
                t+=par.clientTop;
            }
            l+=par.offsetLeft;
            t+=par.offsetTop;
            par=par.offsetParent;
        }
        return {left:l,top:t}
    }
    //在一定范围内，通过class名来获取一组元素
    function getByClass(strClass,curEle) {
        curEle=curEle||document;
        if('getComputedStyle' in window){
            return this.listToArray(curEle.getElementsByClassName(strClass));
        }
        var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);//去掉首尾空格，然后再按照中间的空格把它拆分成数组
        var nodeList=curEle.getElementsByTagName('*');//获取当前元素下所有的元素节点
        var ary=[];
        for(var i=0;i<nodeList.length;i++){
            var curNode=nodeList[i];
            var bOk=true;
            for(var k=0;k<aryClass.length;k++){
                var curClass=aryClass[k];
                var reg=new RegExp('(^| +)'+curClass+'( +|$)');//拼接变量要用实例创建
                if(!reg.test(curNode.className)){
                    bOk=false;
                    break;
                }
            }
            if(bOk){
                ary[ary.length]=curNode;
            }
        }
        return ary;
    }
    //验证这个元素上是否有某个class名,只能检测一个，不可多个,返回一个布尔值
    function hasClass(curEle, cName) {
        cName=cName.replace(/(^ +)|( +$)/g,'');//把传进来class名的去除首尾空格
        var reg=new RegExp('\\b'+cName+'\\b');//按照开头结尾空格，查找是否有某个class名
        return reg.test(curEle.className);//布尔值
    }
    //addClass：如果元素身上没有这个class名，我们才会添加,没有返回值
    function addClass(curEle,strClass) {
        var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
        for(var i=0;i<aryClass.length;i++){//遍历元素验证元素class名上是否有这个aryClass数组中的每一项，如果没有才会添加
            var curClass=aryClass[i];
            if(!this.hasClass(curEle,curClass)){//元素身上没有这个class名，才会添加
                curEle.className+=' '+curClass;
            }
        }
    }
    //如果元素身上有这个strClass：要移出的(可多个)，没有返回值
    function removeClass(curEle, strClass) {
        var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
        for(var i=0;i<aryClass.length;i++){
            var reg=new RegExp('(^| +)'+aryClass[i]+'( +|$)');
            //var reg=new RegExp('\\b'+aryClass[i]+'\\b');//if语句里curEle.className=curEle.className.replace(reg,'').replace(/\s+/g,' ').replace(/(^ +)|( +$)/g,'');
            if(reg.test(curEle.className)){
                curEle.className=curEle.className.replace(reg,' ').replace(/(^ +)|( +$)/g,'');
            }
        }
    }
    //获取经过浏览器计算过的非行间样式(参数；谁的样式)
    function getCss(curEle,attr) {
        var val,reg;
        if('getComputedStyle' in window){
            val=getComputedStyle(curEle,false)[attr];
        }else{
            if(attr==='opacity'){//当用户传opacity时，在低级浏览器下实际获取的是filter：alpha(opacity=10)的值；高级浏览器直接就是，opacity:0.1;
                val=curEle.currentStyle['filter'];//拿到的是alpha(opacity=10)
                reg=/^alpha\(opacity[=:](\d+)\)$/g;//判断是否符号alpha(opacity=10)的规则，想取得数字，所以加小分组
                return reg.test(val)?RegExp.$1/100:1;//1是透明度没有发生变化
            }else{
                val=curEle.currentStyle[attr];
            }
        }
        reg=/^([+-])?\d+(\.\d+)?(px|pt|em|rem)$/g;//单位处理
        return reg.test(val)?parseFloat(val):val;
        //符和我们规则的值就parseFloat，不符合就直接用 val
    }
    //setCss:设置行间样式  透明度 单位 float 每次只能设置一个
    function setCss(curEle,attr,value) {
        //处理动态设置float问题
        if(attr==='float'){
            curEle.style.styleFloat=value;//处理的IE
            curEle.style.cssFloat=value;//处理的是火狐
            return;
        }
        if(attr==='opacity'){
            curEle.style.opacity=value;//高级浏览器的透明度处理
            curEle.style.filter='alpha(opacity='+value*100+')';
            return;
        }
        //给谁的value传单位，取决于传进来的属性是否满足我们的正则
        var reg=/width|height|top|right|bottom|left|((margin|padding)(top|right|bottom|left)?)/;//加括号是为了优先处理
        if(reg.test(attr)){
            value=parseFloat(value)+'px';//避免用户传单位发生错误
        }
        curEle.style[attr]=value;
    }
    //setGroupCss:options是个对象{}
    function setGroupCss(curEle, options) {
        for(var attr in options){
            this.setCss(curEle,attr,options[attr]);
        }
    }

    //css:取值赋值合体的函数：getCss，setCss，setGroupCss三合一，返回值：分情况考虑；
    function css(curEle) {
        var arg2=arguments[1];
        if(typeof arg2==='string'){//第二个参数是字符串有两种情况
            var arg3=arguments[2];
            if(typeof arg3==='undefined'){//如果第三个参数不存在，获取
                return this.getCss(curEle,arg2);
            }else{//如果第三个参数存在，设置一个样式
                this.setCss(curEle,arg2,arg3);
            }
        }
        //如果第二个参数是个对象的话，有且只有一种情况----设置一组样式setGroupCss
        if(arg2.toString()==='[object Object]'){
            //检测第二个参数是个对象 还可以写为1.arg2 instanceof Object 2.arg2.constructor.name==='Object'
            this.setGroupCss(curEle,arg2);
        }
    }
    //获取当前元素下的所有子元素节点
    function getChildren(curEle,tag) {
        /*if(flag){//高级浏览器处理
            return this.listToArray(curEle.children);
        }*/
        var ary=[];
        //获取当前元素下的所有子节点：可能有文本，注释，元素，document
        var nodeList=curEle.childNodes;
        for(var i=0;i<nodeList.length;i++){//循环节点，当节点nodeType=1时，添加到数组里
            if(nodeList[i].nodeType===1){
                //如果传了第二个参数，对所选元素进行再次过滤
                if(typeof tag!=='undefined'){
                    if(nodeList[i].tagName.toLowerCase()===tag) {
                        ary[ary.length] = nodeList[i];
                        break;
                    }
                }else{
                    //如果没传第二个参数，直接把元素放入数组
                    ary[ary.length]=nodeList[i];
                }

            }
        }
        return ary;
    }
    //prev:获取上一个哥哥元素节点
    function prev(curEle) {
        if(flag){//判断高级浏览器
            return curEle.previousElementSibling;
        }
        //低级浏览器
        var pre=curEle.previousSibling;//获取上个节点；文本，注释，document，元素
        while(pre && pre.nodeType!==1){//是一个节点 并且 不是元素节点，继续向上找
            pre=pre.previousSibling;
        }
        return pre;
    }
    //prevAll:获取当前元素所有哥哥元素节点
    function prevAll(curEle) {
        var pre=this.prev(curEle);//先获取上一个哥哥元素节点
        var ary=[];
        while(pre){//只要哥哥元素节点存在，就继续往上找其他的哥哥元素节点，不知道找多少次，用while
            ary.unshift(pre);//找到一个,就给数组的开头添加一个
            pre=this.prev(pre);//继续往上找
        }
        return ary;//把数组返回
    }

    //next:下一个弟弟元素节点
    function next(curEle) {
        if(flag){
            return curEle.nextElementSibling;
        }
        var nex=curEle.nextSibling;
        while(nex && nex.nodeType !== 1){
            nex=nex.nextSibling;
        }
        return nex;
    }
    //nextAll:获取当前元素所有弟弟元素节点
    function nextAll(curEle) {
        var nex=this.next(curEle);
        var ary=[];
        while(nex){
            ary.push(nex);
            nex=this.next(nex);
        }
        return ary;
    }
    //sibling:获取当前元素的相邻元素：上一个哥哥元素节点+下一个弟弟元素节点
    function sibling(curEle) {
        var prev=this.prev(curEle);//获取上一个哥哥元素节点
        var nex=this.next(curEle);//获取下一个弟弟元素节点
        var ary=[];
        if(prev) ary.push(prev);//哥哥元素节点存在，放进数组
        //prev?ary.push(prev):null;
        if(nex) ary.push(nex);//弟弟元素节点存在，放进数组
        return ary;//把数组返回
    }
    //siblings:获取当前所有兄弟节点：所有的哥哥元素节点+所有的弟弟元素节点--》都是数组，需要concat拼接
    function siblings(curEle) {
        return this.prevAll(curEle).concat(this.nextAll(curEle));
    }
    //firstChild:当前元素的第一个子元素
    function firstChild(curEle) {
        return this.getChildren(curEle)[0];
    }
    //lastChild：当前元素的最后一个子元素
    function lastChild(curEle) {
        var aChs=this.getChildren(curEle);//接收获取的所有子元素
        return aChs[aChs.length-1];//不知道长度，把最后一个返回
    }
    //index:获取当前元素的索引，就是所有哥哥 元素的长度
    function index(curEle) {
        return this.prevAll(curEle).length;
    }
    //appendChild:插入容器末尾
    function appendChild(parent,newEle) {
        parent.appendChild(newEle);
    }
    //prependChild：把新元素插入到当前容器的最开始
    function prependChild(parent,newEle) {
        /*var aChs=this.getChildren(parent);//在父级下找所有的子元素
         //如果有子元素的话，插入到第一个子元素前面
         if(aChs.length){
         var first=this.firstChild(parent);
         parent.insertBefore(newEle,first);
         }else{
         this.appendChild(parent,newEle)
         }*/
        var first=this.firstChild(parent);//在父级在获取第一个子元素
        if(first){//如果第一个子元素存在，插入其前面，没有插入到容器末尾
            parent.insertBefore(newEle,first);
        }else{
            parent.appendChild(newEle);
        }
    }
    //把新元素插入到旧元素的前面
    function insertBefore(newEle, oldEle) {
        oldEle.parentNode.insertBefore(newEle,oldEle);
    }
    //把新元素插入到指定元素的弟弟元素的前面
    function insertAfter(newEle, oldEle) {
        var nex=this.next(oldEle);//获取指定元素的弟弟元素
        if(nex){
            //如果指定的元素的弟弟元素节点存在的话，把新元素插入弟弟元素前面
            oldEle.parentNode.insertBefore(newEle,nex);
        }else{
            //如果指定的元素的弟弟元素节点不存在的话，直接插入父容器末尾
            oldEle.parentNode.appendChild(newEle);
        }
    }
    return {
        rnd: rnd,
        listToArray: listToArray,
        jsonParse: jsonParse,
        win: win,
        offset: offset,
        getByClass: getByClass,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        getCss: getCss,
        setCss: setCss,
        setGroupCss: setGroupCss,
        css: css,
        getChildren: getChildren,
        prev: prev,
        prevAll: prevAll,
        next: next,
        nextAll: nextAll,
        sibling: sibling,
        siblings: siblings,
        firstChild: firstChild,
        lastChild: lastChild,
        index: index,
        appendChild: appendChild,
        prependChild: prependChild,
        insertBefore: insertBefore,
        insertAfter: insertAfter
    }
})();


















