"use strict"

// Contains all UI elements
const uiElements = {
    elInput: document.getElementById("user-input"),
    elBtnSub: document.getElementById("btn-convert"),
    elOutDis: document.getElementById("output-display"),

    // Blocks conversion if no input is present
    convertBlock: function() {
        const inputPresnet = uiElements.elInput.value.length;
        
        // Invoke numToText if content is present within input element
        if(inputPresnet > 0){
            numToText();
        } else {
            return
        }
    },
};

const placeValues = {
    single: [`one`, `two`, `three`, `four`, `five`, `six`, `seven`, `eight`, `nine`,],
    tens: [`teen`, `twen`, `thir`, `four`, `fife`, `six`, `seven`, `eigh`, `nine`,],
};

// Contains strings used to construct output - Organized by place values
const stringsMap = new Map([
    //Single Values
    [0, new Map (constructMap(placeValues.single))],

    // Tens values 
    [1, new Map([
        ...constructMap(placeValues.tens, "ty"),

        // Contains values that can not be constructed from other strings
        [`unique`, new Map([
            [10, `ten`],
            [11, `eleven`],
            [12, `twelve`],
            [13, `thirteen`],
            [15, `fifteen`],
        ])],
    ])],

    [2, new Map(constructMap(placeValues.single, ` hundred`))],

    [3, new Map([
        [0, `thousand`],
        [1, `million`],
    ])]
]);

// Constructs mapObject from passed array propValues 
function constructMap(propValues, commonString = "") {
    const outMap = new Map();
    
    for(let [i, value] of propValues.entries()){
        value = commonString.length === 0 ? value: value.concat(commonString); 
        outMap.set(i + 1, value);
    };
    
    return outMap;
};

// Gets user inputted number - Returns number represented as text
function numToText() {

    // Retruns arrays containg each number represented as text
    function getStrings(numStrings) {

        function reverseString(string) {
            return [...string].reverse().join("")
        }

        // Checks for existance of values that can not be constructed from other strings
        function checkUnique(num) {
            const uniqueNum = Number(num.slice(-2));
            const isUnique = stringsMap.get(1).get(`unique`).has(uniqueNum) ? true : false;
            
            return {
                isUnique,
                uniqueNum,
            };
        };

        // Retrives string from stringsMap for charNum value
        function findString(mapKey, charNum, isUnique) {
            mapKey = Number(mapKey);
            charNum = Number(charNum);
            const outString = stringsMap.get(mapKey).get(charNum);

            //Returns strings for unique numbers
            if(isUnique) {
                return stringsMap.get(1).get(`unique`).get(charNum)
            };

            return outString;
        };

        const outStrings = [];

        // Formatting - Adds padding to strings creating standard lengths
        for(const [i, string] of numStrings.entries()){
            numStrings[i] = string.padStart(3, `0`);
        };

        // Gets strings for each individual number
        for(let [i, string] of numStrings.entries()){
            const hasUnique = checkUnique(string);
            const individualStrings = [];
            string = reverseString(string);

            // For each char, get related string from map, insert into individualStrings
            for(const [i, char] of [...string].entries()){
                individualStrings.splice(0, 0, findString(i, char));
            };

            // Retrives + inserts unique value strings, Removes 2 unrequired strings
            if(hasUnique.isUnique) {
                individualStrings.splice(1, 2, findString(0, hasUnique.uniqueNum, hasUnique.isUnique));
            };

            outStrings.push(individualStrings);
        };

        return outStrings

    };

    const inputArray = uiElements.elInput.value.split(`,`);
    const numberStrings = getStrings(inputArray);
};

// eventListners
uiElements.elBtnSub.addEventListener("click", uiElements.convertBlock);