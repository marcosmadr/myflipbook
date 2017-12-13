$(document).ready(function(){

var myflipbook = { data: undefined, progressInterval : undefined };

$.get("video/settings", function(response) { 
    if ( response && response.code === 0 ) {
        myflipbook.settings = response.data;
    } else {
        console.log("Cannot get template data!");
        console.log(response);
    }
});

var buildCarouselContent = function(frames) {
    var imgurl = undefined;
    for(var i=0; i<frames.length; i++) {
        $("#div-owl-carousel").append("<div><img class='frames' id='img-frame-"+i+"' src='"+frames[i]+"'></div>");
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
    $("#img-frame-0").attr("src", data);
};

$('.opt-filters').click(function(event) {
    for (var i=0; i < myflipbook.settings.filters.length; i++) {
        $(".frames").removeClass("filter-"+myflipbook.settings.filters[i].id);
    }
    myflipbook.filter = "filter-"+this.value;
    $(".frames").addClass(myflipbook.filter);
});

$("#btn-generate-frames").click(function() {

    var file_input = document.getElementById("file-video");
    file = file_input.files[0];

    try {
        myflipbook.data = new myFlipBook(file, callbackUpdateContent); 
    } catch (e) {
        switch(e.name) {
            case "FileInput":
                $("#div-error").html("<strong>Sorry,</strong>Select a file!");
                $("#div-error").show();
                break;
            case "InvalidExtension":
                $("#div-error").html("<strong>Sorry,</strong>Invalid file format!");
                $("#div-error").show();
                break;
            default:
                $("#div-error").html("<strong>Sorry,</strong>Unknown error!");
                $("#div-error").show();
        }
        return false;
    }
    $("#div-error").hide();
    $("#div-upload").hide();
    $("#div-loading").show();

    myflipbook.progressInt = setInterval(function() { 
        $(".progress-bar").width(myflipbook.data.progress() + "%").html(myflipbook.data.progress() + "%");
   }, 500);

});

$(".fb-cover-select").click(function() {
    
    if ( ! myflipbook.settings.templates.data ) {
        alert("Cannot find cover templates, check your internet connection.");
    } else {
        var tpl_id = this.id.split('-')[3];
        myflipbook.data.setCoverDeco(this);
        myflipbook.data.setCoverTemplate(myflipbook.settings.templates.data[tpl_id]);
        myflipbook.data.createCover(callbackUpdateCover);
        $("#div-owl-carousel").trigger("to.owl.carousel", 0);
    }
});

$("#btn-apply-text").click(function() {
    myflipbook.data.setCoverText($("#input-text").val());
    myflipbook.data.createCover(callbackUpdateCover);
    $("#div-owl-carousel").trigger("to.owl.carousel", 0);
});

$("#btn-generate-print").click(function() {
    var printWindow = window.open("print");
    printWindow.myflipbook = { frames: myflipbook.data.getFrames(),
                                filter: myflipbook.filter};
    window.location.replace("/myflipbook/video/thanks");
});

});
