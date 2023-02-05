"use strict"

// Contains all UI elements
const UiElements = {
    elInput: document.getElementById("user-input"),
    elBtnSub: document.getElementById("btn-convert"),
    elOutDis: document.getElementById("output-display"),
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

    [2, `hundred`]

    [3, new Map([
        [0, `thousand`],
        [1, `million`],
    ])]
]);