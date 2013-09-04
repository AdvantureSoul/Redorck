/**
 * Created with JetBrains WebStorm.
 * User: Soul
 * Date: 13-8-26
 * Time: 上午2:19
 * To change this template use File | Settings | File Templates.
 */
(function(){
        var d = document,
            gi = "getElementById",
            gt = "getElementsByTagName",
            gc = "getElementsByClassName",
            domExtend = {},
            browser = document.getElementsByClassName;         /* 浏览器方法探测 */
                domExtend.method = (function(){
                    var ele,
                        method_save = {},
                        over_gi = d[gi],
                        over_gt = d[gt],
                        over_cr = d.createElement,
                        i;
                    if(browser){
                        ele = HTMLElement;
                    }
                    if(ele){
                        return function(methodName,method){
                            HTMLElement.prototype[methodName] = method;
                        }
                    }else{
                        return function(methodName,method){
                            method_save[methodName] = method;
                            /* ID元素兼容*/
                            d.getElementById = function(id){
                                var ele= over_gi(id);
                                for( i in method_save )
                                ele[i] = method_save[i];
                                return ele;
                            };
                            /* class元素兼容 */
                            d.getElementsByClassName = function(className){
                                    var ele = document.all,
                                        length = ele.length,
                                        eleArr = [],
                                        i = 0,k;
                                for(;i < length ; i++){
                                    if(ele[i].className === className){
                                        for( k in method_save){
                                            ele[i][k] = method_save[k];
                                        }
                                        eleArr.push(ele[i]);
                                    };
                                };
                                return eleArr;
                            };
                            /* 标签元素 */
                            d.getElementsByTagName = function(TagName){
                                var ele = over_gt(TagName),
                                    length = ele.length,
                                    i = 0,k;
                                for(; i < length ; i++){
                                    for( k in method_save){
                                        ele[i][k] = method_save[k];
                                    }
                                };
                                return ele;
                            };
                            /* 创建的元素 */
                            d.createElement = function(TagName){
                                var ele = over_cr(TagName),
                                    k;
                                for( k in method_save){
                                    ele[k] = method_save[k];
                                }
                                return ele;
                            }
                        }
                    }
                })();
                domExtend.css = (function(){
                    var i,
                        method;
                    if(window.getComputedStyle){
                        method = "window.getComputedStyle(this,null)";
                    }else{
                        method = "this.currentStyle"
                    }
                    return function(css,value){
                        if(value){
                            this.style[css] = value;
                            return this;
                        }else{
                            if(typeof(css) === "Object"){
                                for(i in css ){
                                    this.style[i] = css[i];
                                    return this;
                                }
                            }else{
                                if(this.style[css]){
                                    return this.style[css];
                                }else{
                                    method = eval(method);
                                    return method[css];
                                }
                            }
                        }
                    }
                })();
                domExtend.animation = (function(){
                    var i,
                        speed,
                        symbol,
                        animation_key = {};
                    function calculate_speed(obj,that,time){
                            for(i in obj){
                                animation_key[i] ={};
                                animation_key[i]["now"] = parseInt(that.css(i));
                                animation_key[i]["target"] = parseInt(obj[i]);
                                animation_key[i]["speed"] = ((animation_key[i]["target"] - animation_key[i]["now"])/time) * 4;
                                animation_key[i]["unit"] = that.css(i).match(/\d*(\w*)/)[1] || "";
                                if( animation_key[i]["speed"] < 0 ){
                                    animation_key[i]["symbol"] = "-";
                                }else if(animation_key[i]["speed"] === 0){
                                    animation_key[i]["symbol"] = false;
                                }else{
                                    animation_key[i]["symbol"] = "+";
                                }
                            }
                    }
                    return function(obj,time,callback){
                        var time= time || 1000,
                            protect = true;
                        calculate_speed(obj,this,time);
                        function animation(cssName,that){
                            animation_key[cssName]["now"] = animation_key[cssName]["now"] + animation_key[cssName]["speed"];
                            that.css(cssName,animation_key[cssName]["now"] + animation_key[cssName]["unit"]);
                            if( animation_key[cssName]["symbol"] == "+" && parseInt(that.css(cssName)) >= animation_key[cssName]["target"]){
                                that.css(cssName, animation_key[cssName]["target"] + animation_key[cssName]["unit"])
                                if(callback && protect){
                                    protect = false;
                                    callback();
                                }
                                return
                            }
                            if( animation_key[cssName]["symbol"] == "-" && parseInt(that.css(cssName)) <= animation_key[cssName]["target"]){
                                that.css(cssName, animation_key[cssName]["target"] + animation_key[cssName]["unit"])
                                if(callback && protect){
                                    protect = false;
                                    callback();
                                }
                                return
                            }
                            animation_key[i]["time"] = setTimeout(function(){
                                animation(cssName,that);
                            },1)
                        }
                        for(i in obj){
                            animation(i,this)
                        }
                    }
                })();
                domExtend.event = (function(){
                    var eventmethod = window.addEventListener;
                    if(eventmethod){
                        return function(eventMethod,callback,upchoose){
                            this.addEventListener(eventMethod,callback,(upchoose || false));
                            return this;
                        }
                    }else{
                        return function(eventMethod,callback){
                            this.attachEvent("on" + eventMethod,callback);
                            return this;
                        }
                    }
                })();
        domExtend.method("css",domExtend.css);
        domExtend.method("animation",domExtend.animation);
        domExtend.method("event",domExtend.event);
        function judge_id(id_symbol,id){
            if(id_symbol === "#"){
                return d[gi](id);
            }else if(id_symbol === "."){
                return d[gc](id);
            };
        };
        $ = (function(){
            var sp_arr = /[.#]/g,
                symbol = [],
                string_id = [];
            return function(id){
                var i = 2,
                    length,
                    ele;
                string_id = id.split(sp_arr);
                if(!string_id[0]){
                    string_id.splice(0,1);
                };
                string_id.splice(0,0);
                symbol = id.match(sp_arr);
                length= string_id.length;
                ele = judge_id(symbol[0],string_id[0]);
                /*for(; i < length ; i++){
                    if(symbol[i] === "#"){
                        ele = ele[gi](string_id[i]);
                    }else if(symbol[i] === "."){
                        ele = ele[gc](string_id[i]);
                    }
                };*/
                return ele;
            }
        })();
        /* 随机函数生成 */
        $.getIntrandom = function(i,k){
            var i = i || 0,
                k = k || 1,
                z = parseInt(Math.random()*k + i);
            if( z > k){
                 z = z - 10;
            }
            return z;
        };
        $.browser = (function(){
            var browser_information = window.navigator.userAgent;
            return function(){
                if( browser_information.match("Chrome")){
                    return "Chrome";
                }else if( browser_information.match("IE 10.0")){
                    return "IE 10.0";
                }else if( browser_information.match("IE 9.0") && !(browser)){
                    return "不知道什么奇葩浏览器";
                }else if( browser_information.match("IE 8.0") ){
                    return "IE 8.0";
                }else if( browser_information.match("IE 6.0") ){
                    return "IE 6.0";
                }else if( browser_information.match("IE 6.0") ){
                    return "IE 9.0";
                }else{
                    return "others"
                }
            };
        })();
        $.loadimg = (function(){
            /*依赖关系*/
            var img_event = domExtend.event;
            return function(imgName,callback){
                var imgall,
                    img_judge = [],
                    imgthis = $(imgName),
                    length = imgthis.length,
                    i = 0;
                for( ; i < length ; i++){
                    img_judge[i] = false;
                    img_event.call(imgthis[i],"load",img_load(i));
                }
                function img_load(i){
                    return function(e){
                        img_judge[i] = true;
                        imgall = every(img_judge);
                        if(imgall){
                            callback();
                        }
                    }
                };
                function every(arr){
                    var k = 0,
                        length = arr.length;
                    for( ; k < length ; k++){
                        if(arr[k]){
                            continue;
                        }else{
                            break;
                        }
                    };
                    if(k === length){
                        return true;
                    }else{
                        return false;
                    }
                }
            }
        })();
})()
