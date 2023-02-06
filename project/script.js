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

// Contains strings used to construct output - Organized by place values
const stringsMap = new Map([
    //Single Values
    [0, new Map([
        [1, `one`],
        [2, `two`],
        [3, `three`],
        [4, `four`],
        [5, `five`],
        [6, `six`],
        [7, `seven`],
        [8, `eight`],
        [9, `nine`],
    ])],

    // Tens values 
    [1, new Map([
        [1, `teen`],
        [2, `twenty`],
        [3, `thirty`],
        [4, `fourty`],
        [5, `fifty`],
        [6, `sixty`],
        [7, `seventy`],
        [8, `eighty`],
        [9, `ninety`],

        // Contains values that can not be constructed from other strings
        [`unique`, new Map([
            [10, `ten`],
            [11, `eleven`],
            [12, `twelve`],
            [13, `thirteen`],
            [15, `fifteen`],
        ])],
    ])],

    [2, `hundred`],

    [3, new Map([
        [0, `thousand`],
        [1, `million`],
    ])]
]);

// Gets user inputted number - Returns number represented as text
function numToText() {

    // Retruns arrays containg each number represented as text
    function getStrings(numStrings) {

        function reverseString(string) {
            return [...string].reverse().join("")
        }

        // Checks for existance of values that can not be constructed from other strings
        function checkUnique(num) {
            const check = Number(num.slice(-2));
            return stringsMap.get(1).get(`unique`).has(check);
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

            //Constructs hundreds strings
            if(mapKey === 2 && charNum !== 0){
                // return outString.concat
            ;}

            return outString;
        };

        const outStrings = [];

        // Formatting - Adds padding to strings creating standard lengths
        for(const [i, string] of numStrings.entries()){
            numStrings[i] = string.padStart(3, `0`);
        };

        // Gets strings for each individual number
        for(const [i, string] of numStrings.entries()){
            const hasUnique = checkUnique(string);
            string = reverseString(string);
            const individualStrings = [];

            // For each char, get related string from map, insert into individualStrings
            for(const [i, char] of string){

            };

        };

        // console.log(numStrings, checkUnique(numStrings[0]))
    };

    const inputArray = uiElements.elInput.value.split(`,`);
    const numberStrings = getStrings(inputArray);
};

// eventListners
uiElements.elBtnSub.addEventListener("click", uiElements.convertBlock);