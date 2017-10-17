$(document).ready(function(){

var myflipbook = { data: undefined, progressInterval : undefined };

var buildCarouselContent = function(frames) {
    var imgurl = undefined;
    for(var i=0; i<frames.length; i++) {
        $('#div-owl-carousel').append("<div><img id='img-frame-"+i+"' src='"+frames[i]+"'></div>");
    }
    $(".owl-carousel").owlCarousel({
    margin:10,
    nav:true,
    responsiveClass:true,
    navSpeed:1000,
    dotsSpeed: 1000,
    responsive:{
        0:{
            items:1,
            nav:true
        },
        600:{
            items:2,
            nav:false
        },
        1000:{
            items:3,
            nav:true,
            loop:false
        }
    }

    });
};

var callbackUpdateContent = function(data) {
    clearInterval(myflipbook.progressInterval);
	$("#div-loading").hide();
 	$("#div-carousel").show();
 	buildCarouselContent(data);
};

var callbackUpdateCover = function(data) {
    $("#img-frame-0").attr('src', data);
};

$("input[name=opt-filter]").click(function() {
    $("img").removeClass("filter-sepia filter-grayscale filter-saturate filter-contrast filter-opacity nofilter");
    $("img").addClass("filter-"+this.value);
    myflipbook.filters = "filter-"+this.value;
});

$("#btn-generate-frames").click(function() {

    var file_input = document.getElementById("file-video");
    file = file_input.files[0];

    try {
        myflipbook.data = myFlipBook(file, callbackUpdateContent); 
    } catch (e) {
        switch(e.name) {
            case 'FileInput':
                $("#div-error").html('<strong>Sorry,</strong>Select a file!');
                $("#div-error").show();
                break;
            case 'InvalidExtension':
                $("#div-error").html('<strong>Sorry,</strong>Invalid file format!');
                $("#div-error").show();
                break;
            default:
                $("#div-error").html('<strong>Sorry,</strong>Unknown error!');
                $("#div-error").show();
        }
        return false;
    }
    $("#div-error").hide();
    $("#div-upload").hide();
    $("#div-loading").show();

    myflipbook.progressInt = setInterval(function() { 
        $(".progress-bar").width(myflipbook.data.progress() + '%').html(myflipbook.data.progress() + '%');
   }, 500);

});

$("input[name=opt-deco]").click(function() {
    myflipbook.data.createCover(
                $("#input-text").val(),
                $("#input-text-color").val(),
                $("#input-text-size").val(),
                callbackUpdateCover,
                document.getElementById("img-cover-deco-"+
                        $('input[name=opt-deco]:checked').val())
                );
    $('#div-owl-carousel').trigger('to.owl.carousel', 0);
});

$("#btn-apply-text").click(function() {
    myflipbook.data.createCover(
                $("#input-text").val(),
                $("#input-text-color").val(),
                $("#input-text-size").val(),
                callbackUpdateCover,
                document.getElementById("img-cover-deco-"+
                        $('input[name=opt-deco]:checked').val())
              );
    $('#div-owl-carousel').trigger('to.owl.carousel', 0);
});

$("#btn-generate-print").click(function() {
    var printWindow = window.open('print');
    printWindow.myflipbook = { frames: myflipbook.data.frames(),
                                filters: myflipbook.filters};
    window.location.replace("/myflipbook/video/thanks");
});

$("#input-text-color").spectrum({preferredFormat: "hex",});

});
