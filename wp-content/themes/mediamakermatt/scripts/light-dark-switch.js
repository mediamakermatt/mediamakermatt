$(document).ready(function() {
    var mode = window.localStorage.getItem("light-dark-mode");
    if(mode == null){
        window.localStorage.setItem("light-dark-mode", "Dark");
        console.log("No Dark or Light Mode");
    } else {
        if(mode == "Dark"){
            // Switch to Dark Mode
            $('.header-logo-light').addClass('hide');
            $('.header-logo-light').removeClass('show');
            $('.header-logo-dark').addClass('show');
            $('.header-logo-dark').removeClass('hide');
            $('body').addClass('dark-preview');
            $('body').removeClass('white-preview');
            console.log("Switch to Dark Mode");
        } else if(mode == "Light"){
            // Switch to Light Mode
            $('.header-logo-dark').addClass('hide');
            $('.header-logo-dark').removeClass('show');
            $('.header-logo-light').addClass('show');
            $('.header-logo-light').removeClass('hide');
            $('body').addClass('white-preview');
            $('body').removeClass('dark-preview');
        }
    }
    $("#color_mode").on("change", function () {
        colorModePreview(this);
    });
});

function colorModePreview(ele) {
    if($(ele).prop("checked") == true){
        // Switch to Light Mode
        $('.header-logo-dark').addClass('hide');
        $('.header-logo-dark').removeClass('show');
        $('.header-logo-light').addClass('show');
        $('.header-logo-light').removeClass('hide');
        $('body').addClass('white-preview');
        $('body').removeClass('dark-preview');
        window.localStorage.setItem("light-dark-mode", "Light");
    }
    else if($(ele).prop("checked") == false){
        // Switch to Dark Mode
        $('.header-logo-light').addClass('hide');
        $('.header-logo-light').removeClass('show');
        $('.header-logo-dark').addClass('show');
        $('.header-logo-dark').removeClass('hide');
        $('body').addClass('dark-preview');
        $('body').removeClass('white-preview');
        window.localStorage.setItem("light-dark-mode", "Dark");
    }
}