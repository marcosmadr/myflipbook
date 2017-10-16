$(document).ready(function(){

var myflipbook = { data: undefined, progressInterval : undefined };

var createCover = function(img, text, font_color, font_size, img_element) {

    var canvas = document.createElement("canvas");
    var context = canvas.getContext('2d');
    canvas.width = myflipbook.data.frame().width;
    canvas.height = myflipbook.data.frame().height;

    var imageObj = new Image();

    imageObj.onload = function(){

         context.drawImage(imageObj, 0, 0);
         context.fillStyle = font_color;
         context.font = font_size+"pt Calibri";
    	 context.fillText(text, 30, 40);
         img_element.attr('src', canvas.toDataURL());
    };
	imageObj.src = img;
};

var buildCarouselContent = function(frames) {
    var imgurl = undefined;
    for(var i=0; i<frames.length; i++) {
        $('#div-owl-carousel').append("<div><img src='"+frames[i]+"'></div>");
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

$("input[name=opt-filter]").click(function() {
    $("img").removeClass("filter-sepia filter-grayscale filter-saturate filter-contrast filter-opacity nofilter");
    $("img").addClass("filter-"+this.value);
});

$("#btn-generate-frames").click(function() {

    var file_input = document.getElementById("file-video");
    file = file_input.files[0];

    try {
        myflipbook.data = myFlipBook(file, callbackUpdateContent); 

    } catch (e) {

        switch(e.name) {
            case 'FileInput':
                $("#div-error").html('<strong>Sorry,</strong> Select a file!');
                $("#div-error").show();
                break;
            case 'InvalidExtension':
                $("#div-error").html('<strong>Sorry,</strong> Invalid file format!');
                $("#div-error").show();
                break;
            default:
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

$("#btn-apply-text").click(function() {
    createCover(
                myflipbook.data.frames()[0],
                $("#input-text").val(),
                $("#input-text-color").val(),
                $("#input-text-size").val(),
                $("#img-cover")
              );
});

$("#btn-generate-print").click(function() {
    var printWindow = window.open('print');
    printWindow.myflipbook = { frames: myflipbook.data.frames() };
    window.location.replace("/myflipbook/video/thanks");
});

$("#input-text-color").spectrum({preferredFormat: "hex",});

});
