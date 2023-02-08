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

    //Creates/Appeneds elements to DOM 
    displayStrings: function(numStrings) {
        const disWrapper = document.getElementById("wrapper-display");

        //Creates p element - Adds string to text content
        function createDisElement(string) {
            let newDisEl = document.createElement("p");
            newDisEl.setAttribute("id", "output-display");
            newDisEl.textContent = string;

            return newDisEl;
        };

        //Create elements for each string - Append to disWrapper
        for(const string of numStrings) {
            disWrapper.appendChild(createDisElement(string));
        };
    },

    //Ensures clean standadised formatted inputs
    formatInput: function(event) {
        
        //Block chars
        function charBlock(event){

            //Checks charecter is legal
            function checkLegal (checkEvent){
                const legalChars = new RegExp(["[0-9]"]); //Legal char set

                if(legalChars.test(checkEvent.key) ||
                checkEvent.ctrlKey ||
                checkEvent.altKey ||
                checkEvent.key.length !== 1){
                    return true
                };

                return false
            };

            //Prevent event if char is illegal
            if(!checkLegal(event)){
                event.preventDefault();
            };
        
        };

        charBlock(event);
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

    [2, new Map(constructMap(placeValues.single, ` hundred and`))],

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

        //Constructs final string - Combines input strings
        function constructFinalString(inArray) {
            const fullStrings = [];
            
            //Get large place value strings (millions, thousands)
            if(inArray.length > 1){
                const largePlace = inArray.slice(0, inArray.length - 1).reverse();
                
                for(let [i , placeArray] of largePlace.entries()){
                    placeArray.push(findString(3, i));
                };
                
                inArray = largePlace.reverse().concat([inArray.pop()]);
            };

            //Combines strings of each number - Converts first char to upper case - Push onto fullStrings
            for(const strings of inArray) {
                let joined = strings.join(" ");
                joined = joined.replace(joined[0], joined[0].toUpperCase())
                fullStrings.push(joined);  
            };

            return fullStrings
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
                if(char === "0") continue

                individualStrings.splice(0, 0, findString(i, char));
            };

            // Retrives + inserts unique value strings, Removes 2 unrequired strings
            if(hasUnique.isUnique) {
                individualStrings.splice(1, 2, findString(0, hasUnique.uniqueNum, hasUnique.isUnique));
            };

            outStrings.push(individualStrings);
        };

        return constructFinalString(outStrings);

    };

    // const inputArray = uiElements.elInput.value.split(`,`);
    const numberStrings = getStrings(uiElements.elInput.value.split(`,`));
    uiElements.displayStrings(numberStrings);
};

// eventListners
uiElements.elBtnSub.addEventListener("click", uiElements.convertBlock);
uiElements.elInput.addEventListener("keydown", event => uiElements.formatInput(event));