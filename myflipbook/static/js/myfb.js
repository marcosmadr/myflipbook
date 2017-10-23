$(document).ready(function(){

var myflipbook = { data: undefined, progressInterval : undefined };

myflipbook.cover_templates = {
    tpl0: {
        "name": "No Cover",
		"img" : "nodeco"
    },
    tpl1: {
        "name": "Happy Birthday",
		"img": "frame-2.svg",
        "text_font": "pt Courier",
        "text_size": 30,
        "text_color": "Yellow",
        "text_x": 60,
        "text_y": 80
    },
    tpl2: {
        "name": "Vintage",
		"img": "frame-1.svg",
        "text_font": "pt Helvetica",
        "text_size": 30,
        "text_color": "Black",
        "text_x": 80,
        "text_y": 70
    },
    tpl3: {
        "Name": "Cinema",
		"img": "frame-4.svg",
        "text_font": "pt Impact",
        "text_size": 30,
        "text_color": "White",
        "text_x": 90,
        "text_y": 190
    }
};

var buildCoverTemplates = function() {
    for (tpl in myflipbook.cover_templates) {
		$("#cover-deco").append(
			"<div class='col-12 col-md-2'>" +
			"	<div class='item'>" +
			"		<img src='/static/images/frames/" + myflipbook.cover_templates[tpl].img +"'"+
			"		class='fb-cover-deco fb-cover-select' id='img-cover-deco-" + tpl + "' " +
			"		alt='" + myflipbook.cover_templates[tpl].name + "'>" +
			"		<div class='item-overlay top'></div>"+
			"	</div>"+
			"</div>"
		);
    }
};

var buildCarouselContent = function(frames) {
    var imgurl = undefined;
    for(var i=0; i<frames.length; i++) {
        $("#div-owl-carousel").append("<div><img id='img-frame-"+i+"' src='"+frames[i]+"'></div>");
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

$("input[name=opt-filter]").click(function() {
    $("img").removeClass("filter-sepia filter-grayscale filter-saturate filter-contrast filter-opacity nofilter");
    $("img").addClass("filter-"+this.value);
    myflipbook.filters = "filter-"+this.value;
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

$('#cover-deco').on('click', '.fb-cover-select', function(event) {
	event.preventDefault();
    myflipbook.data.setCoverDeco(document.getElementById(this.id));
	var tpl_id = this.id.split('-')[3];
    myflipbook.data.setCoverTemplate(myflipbook.cover_templates[tpl_id]);
    myflipbook.data.createCover(callbackUpdateCover);
    $("#div-owl-carousel").trigger("to.owl.carousel", 0);
});

$("#btn-apply-text").click(function() {
    myflipbook.data.setCoverText($("#input-text").val());
    myflipbook.data.createCover(callbackUpdateCover);
    $("#div-owl-carousel").trigger("to.owl.carousel", 0);
});

$("#btn-generate-print").click(function() {
    var printWindow = window.open("print");
    printWindow.myflipbook = { frames: myflipbook.data.getFrames(),
                                filters: myflipbook.filters};
    window.location.replace("/myflipbook/video/thanks");
});

buildCoverTemplates();

});
