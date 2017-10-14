$(document).ready(function(){

var myvideo = {
    extensions: function(ext) {
        if($.inArray(ext, [ 'mp4', 'avi', 'mov', 'wmv', 'mkv' ]) == -1) {
            return false;
        } else {
            return true;
        }
    },
    frame: { 
        width: 340, 
        height: 233, 
        max: 50,
    },
    position: 0,
    frames: [],
};

var buildCarouselContent = function() {
    var imgurl = undefined;
    for(var i=0; i<myvideo.frames.length; i++) {
        $('#div-owl-carousel').append("<div><img src='"+myvideo.frames[i]+"'></div>");
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
}

Number.prototype.toFixedDown = function(n) {
    var x = String(this).split(".");
    if (! x[1] ) {
        return this;
    }
    return Number(x[0]+"."+String(x[1]).substring(0,n));
};

var video = document.createElement("video");

var createImage = function() {
    var canvas = document.createElement("canvas");
    canvas.width = myvideo.frame.width;
    canvas.height = myvideo.frame.height;

    var context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL();
}

video.addEventListener('seeked', function() {
    myvideo.frames.push(createImage()); 

    myvideo.position += myvideo.increment;

    if (myvideo.position.toFixedDown(2) <= this.duration) {
        this.currentTime = myvideo.position;
    } else {
        $("#div-loading").hide();
        $("#div-carousel").show();
        clearInterval(myvideo.progress);
        buildCarouselContent();
    }

}, false);

video.addEventListener('loadeddata', function() {
    if (isNaN(video.duration)) {
        throw {
            name: 'FormatError',
            message: 'Cannot determine video length'
        };
    }
    myvideo.increment = video.duration / myvideo.frame.max;
    myvideo.position = 0;
    myvideo.frames = [];

    this.currentTime = myvideo.position;
});

$("#btn-generate-frames").click(function() {

    var file_input = document.getElementById("file-video");
    file = file_input.files[0];

    if (! file) {
        $("#div-error").html('<strong>Sorry,</strong> Select a file!');
        $("#div-error").show();
        return false;
    } 

    var ext = file.name.split('.').pop().toLowerCase();

    if(! myvideo.extensions(ext)) {
        $("#div-error").html('<strong>Sorry,</strong> Invalid file format!');
        $("#div-error").show();
        return false;
    }

    $("#div-error").hide();

    var fileURL = URL.createObjectURL(file);
    video.src = fileURL;
     
    $("#div-upload").hide();
    $("#div-loading").show();
    myvideo.progress = setInterval(function() { 
        var progress = Math.round((myvideo.frames.length*100) / myvideo.frame.max);
        $(".progress-bar").width(progress + '%').html(progress + '%');
   }, 500);

});

$($('input[name=opt-filter]')).click(function() {
    $("img").removeClass('filter-sepia filter-grayscale filter-contrast filter-opacity filter-saturate');
    $("img").addClass('filter-'+this.value);
});

$("#btn-generate-print").click(function() {
    var printWindow = window.open('print');
    printWindow.myvideo = myvideo;
    window.location.replace("/myflipbook/video/thanks");
});

});
