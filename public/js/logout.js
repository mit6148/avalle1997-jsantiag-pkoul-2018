/***************************************************************************************
*    Title: tv screen off animation
*    Author: vivek marakana
*    Date: 1/28/2018
*    Code version: 1
*    Availability:https://codepen.io/vivekmarakana/pen/hqAou
***************************************************************************************/


$('div#topDiv').animate({
    //51% for chrome
    height: "51%"
    ,opacity: 1
}, 300);
$('div#bottomDiv').animate({
    //51% for chrome
    height: "51%"
    ,opacity: 1
}, 300, function(){
        $('div#centerDiv').css({display: "block"}).animate({
                width: "0%",
                left: "50%"
             }, 300);
        }
);

$(document).ready(function () {
    // Handler for .ready() called.
    window.setTimeout(function () {
        location.href = "/";
    }, 900);
});
