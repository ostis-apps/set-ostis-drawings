SetComponent = {
    ext_lang: 'set_code',
    formats: ['format_set_json'],
    struct_support: true,

    factory: function(sandbox) {
        return new setViewerWindow(sandbox);
    }
};

var setViewerWindow = function(sandbox) {

    var self = this;
    this.sandbox = sandbox;
    this.sandbox.container = sandbox.container;

    $('#' + sandbox.container).load('static/components/html/set-main-page.html');
};

SCWeb.core.ComponentManager.appendComponentInitialize(SetComponent);



SCWeb.ui.SearchPanel = {
    
    init: function() {
        var dfd = new jQuery.Deferred();
        var self = this;

        var keynode_nrel_main_idtf = null;
        var keynode_nrel_idtf = null;
        var keynode_nrel_system_idtf = null;

        $('.typeaheadSet').typeahead({
                minLength: 3,
                highlight: true,
            },
            {
                name: 'idtf',
                source: function(query, cb) {
                    var inputSet = getElementsOfTheUserSet(query);
                    callGenSet(inputSet);              
                },
               
        });

        return dfd.promise();
    },
    
};



function getElementsOfTheUserSet(userString){
    //Проверка корректности ввода множества
    if (isValidUserString(userString) != 1) 
        return;
    //Юникод символа пустого множества
    const emptySetSymbol = '\u00D8';
    //удаляем все пробелы в пользовательской строке
    userString = userString.replace(/\s+/g, '');
    var currentUserSet = {
        nameOfTheSet: getNameOfTheSet(userString),
        elementsOfTheSet: []
    };
    //удаление открывающих и закрывающих скобок множества
    userString = deleteUslessSymbols(userString); 
        for(var i = 0; i < userString.length; i++){
            if(userString[i] == '{') {
                var numberOfOpeningBrackets = 1;
                var numberOfClosingBrackets = 0;
                for(var j = i + 1; j < userString.length; j++){
                    if(userString[j] == '{') numberOfOpeningBrackets++;
                    if(userString[j] == '}') numberOfClosingBrackets++;
                    if(numberOfClosingBrackets == numberOfOpeningBrackets) {
                        currentUserSet.elementsOfTheSet.push(userString.slice(i, j + 1));     
                        i = j - 1;
                        break;
                    }
                }
            }
        }
    //провека на наличие символа пустого множества во множестве
    if(userString.indexOf(emptySetSymbol) != -1)
        currentUserSet.elementsOfTheSet.push(userString.match(emptySetSymbol).join(''));
    currentUserSet.elementsOfTheSet = addSimpleElementsToTheSet(userString, currentUserSet.elementsOfTheSet);
    //проверка, я вляется ли множество, введённое пользователем канторовским множеством
    var uniqueElementsOfTheSet = currentUserSet.elementsOfTheSet.filter(
        (value, input, set) => set.indexOf(value) === input);
    if(currentUserSet.elementsOfTheSet.length > uniqueElementsOfTheSet.length)
        return "Exception!";
    return currentUserSet;
}

//получение имени множества
function getNameOfTheSet(userString) {
    for (var i = 0; i < userString.length; i++)
        if(userString[i] == '=') 
            return userString.substring(0,i);
}

//удаление мусора из строки и {}
function deleteUslessSymbols(userString) {
    var indexOfEqual = userString.indexOf('=');
        return userString.slice(indexOfEqual + 1, userString.length).replace(/{/,'').slice(0, -1);
}

//добавление во множество обычнх элементов
function addSimpleElementsToTheSet(userString, elementsOfTheSet) {
    //удаляем элементы, которые уже добавлены во множество
    for(var i = 0; i < elementsOfTheSet.length; i++){
        userString = userString.replace(elementsOfTheSet[i], '');
    }
    //добавляем все оставшиеся элементы во множество
    var validElements = userString.match(/(\w+)/g);
    for (var elemnts in validElements) {
        elementsOfTheSet.push(validElements[elemnts]);
    }
    return elementsOfTheSet;
}

//проверка коректности ввода
function isValidUserString(userString){
    var indexOfEqual = userString.indexOf('=');
    if (indexOfEqual > userString.indexOf('{') || 
        indexOfEqual > userString.indexOf('}') ||
        indexOfEqual == -1)
            return false;
    userString = userString.slice(indexOfEqual + 1, userString.length);
    if(userString.indexOf('{') !=0 && userString.charAt(userString.length - 1) != '}') 
      return false;
    var numberOfOpeningBrackets = 0;
    var numberOfClosingBrackets = 0; 
    userString = deleteUslessSymbols(userString); 
    for(var i = 0; i < userString.length; i++){
        if(userString.charAt(i) == '{')
            numberOfOpeningBrackets++;
        if(userString.charAt(i) == '}')
            numberOfClosingBrackets++;
    }
    if (numberOfOpeningBrackets != numberOfClosingBrackets)
        return false;
    return true;
}
