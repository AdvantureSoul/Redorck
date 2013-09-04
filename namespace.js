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
            nameArray = nameArray.splice(1);
        };

        for ( i = 0 ; i < length ; i++) {
            if ( !(nameArray[i] in createObject) ) {
                createObject[nameArray[i]] = {}
            };
            createObject = createObject[nameArray[i]];
        };

        return createObject;
    }
};
