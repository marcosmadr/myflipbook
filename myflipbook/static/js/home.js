$(document).ready(function(){

    $('.nav-link,.fb-btn').click(function() {    
        var stop_at = $($(this).attr('href')).offset().top;
        $('html,body').animate({scrollTop: stop_at}, 500);
        return false;
    });

    $("#file-video").change(function() {
        $("#file-video-error").hide();
    });

    $("#btn-generate-frames").click(function() {
        var file_input = document.getElementById("file-video");
        file = file_input.files[0];
        if (!file) {
            $("#file-video-error").show('slow');
        }
        fileURL = URL.createObjectURL(file);
        localStorage.setItem('fb_video_url', fileURL);
        w = window.open('video/', '_blank');

    });

});


