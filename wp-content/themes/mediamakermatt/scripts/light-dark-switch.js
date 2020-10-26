$(document).ready(function() {

    $('.header-logo-light').addClass('hide');
    $('.header-logo-light').removeClass('show');
    $('body').addClass('dark-preview');
    $('body').removeClass('white-preview');

    $("#color_mode").on("change", function () {
        colorModePreview(this);
    });
});

function colorModePreview(ele) {
    if($(ele).prop("checked") == true){
        // Switch to Light Mode
        $('body').addClass('white-preview');
        $('body').removeClass('dark-preview');
        document.getElementById("testie").innerHTML = "Light Mode";
    }
    else if($(ele).prop("checked") == false){
        // Switch to Dark Mode
        $('body').addClass('dark-preview');
        $('body').removeClass('white-preview');
        document.getElementById("testie").innerHTML = "Dark Mode";
    }
}