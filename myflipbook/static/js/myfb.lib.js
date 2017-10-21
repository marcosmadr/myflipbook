
var myFlipBook = function(file, func) {
    this.allowed_ext = ["mp4", "avi", "mov", "wmv", "mkv"];
    this.frames = [];
    this.frame_cover = "";
    this.position = 0;
    this.frame = { 
        width: 340,
        height: 233,
        max: 49//+1 frame at 0sec aka cover
    };
    this.callback_func = func;

    if (!file) {
        throw {name: "FileInput", message: "Missing input file"};
    }

    var ext = file.name.split(".").pop().toLowerCase();

    if ($.inArray(ext, this.allowed_ext) === -1) {
        throw {name: "InvalidExtension", message: "Invalid video type"};
    }

    this.fileURL = URL.createObjectURL(file);
    this.video = document.createElement("video");
    this.video.src = this.fileURL;

    var that = this;

    var createImage = function() {
        var canvas = document.createElement("canvas");
        canvas.width = that.frame.width;
        canvas.height = that.frame.height;

        var context = canvas.getContext("2d");
        context.drawImage(that.video, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL();
    };

    this.video.addEventListener("seeked", function() {
        that.frames.push(createImage());

        that.position += that.increment;

        if (that.position.toFixedDown(2) <= this.duration) {
            this.currentTime = that.position;
        } else {
            that.callback_func(that.frames);
        }

    }, false);

    this.video.addEventListener("loadeddata", function() {
        if (Number.isNaN(this.duration)) {
            throw {
                name: "FormatError",
                message: "Cannot determine video length"
            };
        }
        that.increment = this.duration / that.frame.max;
        that.position = 0;
        that.frames = [];

        this.currentTime = that.position;
    }, false);

};

myFlipBook.prototype.progress = function() {
    return Math.round((this.frames.length * 100) / this.frame.max);
};

myFlipBook.prototype.createCover = function(text, font_color, font_size, callback_cover, deco) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    canvas.width = this.frame.width;
    canvas.height = this.frame.height;

    var coverImage = new Image();
    var that = this;
    coverImage.onload = function() {
        context.drawImage(coverImage, 0, 0);
        if (deco) {
            context.drawImage(deco, 0, 0);
        }
        if (text) {
            context.fillStyle = font_color;
            context.font = font_size + "pt Calibri";
            context.fillText(text, 30, 50);
        }
        that.frame_cover = canvas.toDataURL();
        if (callback_cover) {
            callback_cover(that.frame_cover);
        }
    };
    coverImage.src = this.frames[0];
};

myFlipBook.prototype.getFrames = function() {
    var newframes = this.frames.slice();
    if (this.frame_cover) {
        newframes[0] = this.frame_cover;
    }
    return newframes;
};

Number.prototype.toFixedDown = function(n) {
    var x = String(this).split(".");
    if (!x[1]) {
        return this;
    }
    return Number(x[0] + "." + String(x[1]).substring(0, n));
};

