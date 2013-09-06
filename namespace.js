/**
 * Created with JetBrains WebStorm.
 * User: Soul
 * Date: 13-9-5
 * Time: 上午1:04
 * To change this template use File | Settings | File Templates.
 */
var BeautifulWorld = {
    createNameSpace : function (nameString) {

        var createObject = BeautifulWorld,
            nameArray = nameString.split("."),
            length = nameArray.length,
            i;

        if (nameArray[0] === "BeautifulWorld") {
            nameArray.shift();
        }
        for (i = 0; i < length; i = i + 1) {
            if (!(nameArray[i] in createObject)) {
                createObject[nameArray[i]] = {};
            }
            createObject = createObject[nameArray[i]];
        }

        return createObject;
    }
};

/* 命名空间 */
BeautifulWorld.createNameSpace("BeautifulWorld.browser.characterCheck");
BeautifulWorld.createNameSpace("BeautifulWorld.domMethod");
BeautifulWorld.createNameSpace("BeautifulWorld.getDom.getName");

/* 方法实现 */

BeautifulWorld.getDom.getName = (function(){
    var dependMethod = function(){
        var positionString = this.match(/#|\.|\s/);
        return this.indexOf(positionString);
    };
    return function(domString){

        var stringPosition = [],
            stringName = [],
            numberPosition,
            initialString = domString,
            i,
            length;

        do{
            numberPosition = dependMethod.call(domString);
            if (numberPosition !== -1) {
                domString = domString.slice(numberPosition+1);
                stringPosition.push(numberPosition);
            }
        }while (numberPosition !== -1);

        length = stringPosition.length;
        for(i = 1;i < length ; i = i +1){
            stringPosition[i] = stringPosition[i] + stringPosition[i-1] + 1;
        }
        for(i = 0;i < length;i = i + 1){
            stringName.push(initialString.slice(stringPosition[i]+1,stringPosition[i+1]));
            stringPosition[i] = initialString.slice(stringPosition[i],stringPosition[i] + 1);
        }

        return {
            "stringSymbol" : stringPosition,
            "stringName" : stringName
        }
    }
})();
BeautifulWorld.getDom = (function(){
    var dependMode = BeautifulWorld.getDom.getName,
        d = document,
        dependMethod = function(firstDom,domSymbol,domName){
            switch (domSymbol) {
                case "#":
                    return d.getElementById(domName);
                    break;
                case ".":
                    return firstDom.getElementsByClassName(domName);
                    break;
                case " ":
                    return firstDom.getElementsByTagName(domName);
                    break;
            }
        };
    return function(domString){
        var domObject = dependMode(domString),
            idDom = domObject.stringSymbol,
            idName = domObject.stringName,
            length = idDom.length,
            firstDom,
            i = 0;

        switch (idDom[0]) {
            case "#":
                firstDom = d.getElementById(idName[0]);
                break;
            case ".":
                firstDom = d.getElementsByClassName(idName[0]);
                break;
            case " ":
                firstDom = d.getElementsByTagName(idName[0]);
                break;
        }

        if (length === 1) {
            return firstDom;
        }

        for (i = 1;i < length;i = i +1) {
            firstDom = dependMethod(firstDom,idDom[i],idName[i]);
        }
            return firstDom;
    }
})();
BeautifulWorld.browser.characterCheck = (function (that) {
    var d = document;

    if (!d.getElementsByClassName) {
        d.getElementsByClassName = function(className){
            console.log(this);
            var getElement = this.all,
                length = getElement.length,
                i = 0,
                elements = [];
            for (;i < length;i = i + 1){
                if (getElement[i].className === className) {
                    elements.push(getElement[i]);
                }
            }

            return elements;
        }
    }

    if(HTMLElement){

    }
})(window);
