if (localStorage.tab === undefined){
    localStorage.setItem("tab", "");
}


window.onload = (event) => {
    if (localStorage.tab.length > 0) {
        localStorage.tab.split('|').forEach(function (PHP_RESPONSE) {
            if (PHP_RESPONSE !== ""){
                let result = JSON.parse(PHP_RESPONSE);
                let newRow = result.isBlueAreaHit ? '<tr class="hit-yes">' : '<tr class="hit-no">';
                newRow += '<td style="text-align:center">' + result.x + '</td>';
                newRow += '<td style="text-align:center">' + result.y + '</td>';
                newRow += '<td style="text-align:center">' + result.r + '</td>';
                newRow += '<td style="text-align:center">' + result.userTime + '</td>';
                newRow += '<td style="text-align:center">' + result.execTime + '</td>';
                newRow += '<td style="text-align:center">' + (result.isBlueAreaHit ? '<img src="tick.png" width=50px alt="Да" class="yes-no-marker">' : '<img src="cross.png" width=50px alt="Нет" class="yes-no-marker">') + '</td>';
                $('#result-table tr:first').after(newRow);
            }
        });
    }
};

let x, y, r;
let errorMessage = "";
let leftBorderY = -3;
let rightBorderY = 3;


function chooseX(element) {
    x = element.value;

    [...document.getElementsByClassName("x-button")].forEach(function (btn) {
        btn.style.transform = "";
    });

    element.style.transform = "scale(1.1)";
}


function isNumber(input) {
    return !isNaN(parseFloat(input)) && isFinite(input);
}


function addToErrorMessage(errorDesc) {
    errorMessage += errorDesc + "\n";
}


function checkOccurrenceY(value){
    return value >= leftBorderY && value <= rightBorderY;
}


function validateY(){
    y = document.querySelector("input[name=Y]").value.replace(",", ".");
    if (y === undefined) {
        addToErrorMessage("The field isn't filled.");
        return false;
    }
    if (!isNumber(y)) {
        addToErrorMessage("Y must be a number.");
        return false;
    }
    if (!checkOccurrenceY(y)){
        addToErrorMessage("Y must be in this occurrence: ${leftBorderY} <= y <= ${rightBorderY}.");
        return false;
    }
    return true;
}


function validateX(){
    if (x === undefined) {
        addToErrorMessage("X must be chosen.");
        console.log("check x");
        return false;
    }
    x = parseInt(x);
    return true;
}

function validateR(){
    let rButton = document.querySelectorAll("input[name=r]");

    rButton.forEach(function (button){
        console.log(button.value);
        if (button.checked){
            r = button.value;
            console.log("success");
        }
    })

    if (r === undefined) {
        addToErrorMessage("R must be chosen.");
        console.log("check r");
        return false;
    }
    r = parseFloat(r);
    return true;
}


function submit() {
    if (validateX() && validateR() && validateY()) {
        $.get("main.php", {
            'x' : parseInt(x),
            'y' : parseFloat(y),
            'r' : parseInt(r),
            'timezone' : new Date().getTimezoneOffset()
        }).done(function(PHP_RESPONSE){
            let result = JSON.parse(PHP_RESPONSE);
            if (!result.isValid){
                addToErrorMessage("Request is not valid. Try refreshing the page");
                return;
            }
            let newRow = result.isBlueAreaHit ? '<tr class="hit-yes">' : '<tr class="hit-no">';
            newRow += '<td style="text-align:center">' + result.x + '</td>';
            newRow += '<td style="text-align:center">' + result.y + '</td>';
            newRow += '<td style="text-align:center">' + result.r + '</td>';
            newRow += '<td style="text-align:center">' + result.userTime + '</td>';
            newRow += '<td style="text-align:center">' + result.execTime + '</td>';
            newRow += '<td style="text-align:center">' + (result.isBlueAreaHit ? '<img src="tick.png" width=50px alt="Да" class="yes-no-marker">' : '<img src="cross.png" width=50px alt="Нет" class="yes-no-marker">') + '</td>';
            $('#result-table tr:first').after(newRow);
            if (localStorage.tab !== '') {
                localStorage.tab += '|' + PHP_RESPONSE;
            } else localStorage.tab = PHP_RESPONSE;
            document.getElementById("result-table").style.backgroundColor = `rgba(250, 235, 215, ${Math.random() * 0.6 + 0.2})`;
        }).fail(function (error) {
            addToErrorMessage(error);
        });
    }

    if (!(errorMessage === "")) {
        alert(errorMessage);
        errorMessage = "";
    }
}