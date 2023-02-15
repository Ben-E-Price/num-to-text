"use strict"

// Contains all UI elements
const uiElements = {
    elInput: document.getElementById("user-input"),
    elBtnSub: document.getElementById("btn-convert"),
    elOutDis: document.getElementById("wrapper-display"),

    //Removes text from UI
    removeTextElements: function() {
        const childList = this.elOutDis.childElementCount > 0 ? [...this.elOutDis.children] : false

        if(childList === false) return;

        //Remove elements
        for(const child of childList) {
            child.remove();
        };
    },

    //Blocks numToText when no value within input
    executeConversion: function() {
        const inputLength = uiElements.elInput.value.length;
        
        // Invoke numToText if content is present within input element
        if(inputLength > 0){
            uiElements.removeTextElements();
            numToText();
        } else {
            alert("Please enter a number");
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
        const deciChar = ","
        const currentEvent = event;
        const currentInValue = currentEvent.target.value;

        // Removes unrequired characters - Returns length
        function cleanInputLength() {
            return currentInValue.replaceAll(deciChar, "").length;
        };
        
        //Prevent non-num chars from input
        function charBlock(){

            //Checks charecter is legal
            function checkLegal (){
                const legalChars = new RegExp(["[0-9\b]"]); //Legal char set

                if(legalChars.test(currentEvent.key) ||
                currentEvent.ctrlKey ||
                currentEvent.altKey ||
                currentEvent.key.length !== 1){
                    return true
                };

                return false
            };

            // Limits number of characters to limitNum value
            function limitChars(limitNum){
                if (currentEvent.key === "Backspace") return true
                return cleanInputLength() < limitNum ? true : false;
            };

            //Prevent event if char is illegal
            if(!checkLegal() || !limitChars(9)){
                preventEvent();
                return false
            };

            return true
        };

        //Add decimal place into input string
        function checkDecimal() {

            //Returns true when inputEl / divBy = 0
            function isDivisible(divBy) {
                const remainderVal = cleanInputLength() % divBy;
                return remainderVal === 0 ? true : false;
            };
            
            //Allows or Prevents decimals being added - If currentInValue = deciChar block - Prevents multiple deciChar on char removal 
            function allowDeciCheck() {
                const checkPos = currentInValue.slice(currentInValue.length - 1);
                
                if(checkPos === deciChar){
                    return false
                };

                return true
            };

            //Inserts decimal charecter every 3rd poistion
            if(isDivisible(3) && currentInValue.length > 0 && allowDeciCheck()) {
                if(currentEvent.key === "Backspace") return
                currentEvent.target.value = currentInValue.concat(deciChar);
            };
        };

        //Blocks currentEvents execution
        function preventEvent() {
            currentEvent.preventDefault();
        };

        //Checks input is < limit + legal character
        if(charBlock()){
            checkDecimal();    
        };
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
uiElements.elBtnSub.addEventListener("click", uiElements.executeConversion);
uiElements.elInput.addEventListener("keydown", event => uiElements.formatInput(event));