
var myFlipBook = function(file, func) {

    var allowed_ext = [ 'mp4', 'avi', 'mov', 'wmv', 'mkv' ];
    var frames = [];
    var position = 0;
    var frame = { 
        width: 340, 
        height: 233, 
        max: 49, //+1 frame at 0sec aka cover
    };
    var callback_func = func;

    if (! file) {
        throw { name: 'FileInput', message: 'Missing input file' };
    } 

    var ext = file.name.split('.').pop().toLowerCase();

    if($.inArray(ext, allowed_ext) == -1) {
        throw { name: 'InvalidExtension', message: 'Invalid video type' };
    }

    var fileURL = URL.createObjectURL(file);
    var video = document.createElement("video");
    video.src = fileURL;

    var createImage = function() {
        var canvas = document.createElement("canvas");
        canvas.width = frame.width;
        canvas.height = frame.height;

        var context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL();
    };
   
    video.addEventListener('seeked', function() {
        frames.push(createImage()); 

        position += increment;

        if (position.toFixedDown(2) <= this.duration) {
            this.currentTime = position;
        } else {
            callback_func(frames);
        }

    }, false);

    video.addEventListener('loadeddata', function() {
        if (isNaN(video.duration)) {
            throw {
                name: 'FormatError',
                message: 'Cannot determine video length'
            };
        }
        increment = video.duration / frame.max;
        position = 0;
        frames = [];

        this.currentTime = position;
    }, false);

	Number.prototype.toFixedDown = function(n) {
    	var x = String(this).split(".");
	    if (! x[1] ) {
	        return this;
	    }
	    return Number(x[0]+"."+String(x[1]).substring(0,n));
	};

	return  { 
		progress: function() { 
			return Math.round((frames.length*100) / frame.max); 
		    },
        frame: function() {
            return frame;
        },
        frames: function() {
            return frames;
            },
        };

};
