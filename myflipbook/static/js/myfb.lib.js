
var myFlipBook = function(file, func) {

    this.allowed_ext = ["mp4", "avi", "mov", "wmv", "mkv"];
    this.frames = [];
    this.position = 0;

    this.frame = { 
        width: 340,
        height: 233,
        max: 49//+1 frame at 0sec aka cover
    };

    this.cover = {
        frame: null,
        frame_deco: null,
        text: "",
        text_font: "",
        text_size: 20,
        text_color: "",
        text_x: 0,
        text_y: 0
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

myFlipBook.prototype.createCover = function(callback_cover) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    canvas.width = this.frame.width;
    canvas.height = this.frame.height;

    var coverImage = new Image();
    var that = this;
    coverImage.onload = function() {
        context.drawImage(coverImage, 0, 0);
        if (that.cover.frame_deco) {
            context.drawImage(that.cover.frame_deco, 0, 0);
        }
        if (that.cover.text) {
            context.fillStyle = that.cover.text_color;
            context.font = that.cover.text_size + that.cover.text_font;
            context.fillText(that.cover.text, that.cover.text_x, that.cover.text_y);
        }
        that.cover.frame = canvas.toDataURL();
        if (callback_cover) {
            callback_cover(that.cover.frame);
        }
    };
    coverImage.src = this.frames[0];
};

myFlipBook.prototype.getFrames = function() {
    var newframes = this.frames.slice();
    if (this.cover.frame) {
        newframes[0] = this.cover.frame;
    }
    return newframes;
};

myFlipBook.prototype.setCoverDeco = function(img) {
    this.cover.frame_deco = img;
};

myFlipBook.prototype.setCoverText = function(text, text_font, text_size, text_color, text_pos_x, text_pos_y) {
    this.cover.text = text;

    if (text_font) {
        this.cover.text_font = text_font;
    }
    if (text_size) {
        this.cover.text_size = text_size;
    }
    if (text_color) {
        this.cover.text_color = text_color;
    }
    if (text_pos_x) {
        this.cover.text_x = text_pos_x;
    }
    if (text_pos_y) {
        this.cover.text_y = text_pos_y;
    }
};

myFlipBook.prototype.setCoverTemplate = function(tpl) {
    for (var prop in tpl) {
        this.cover[prop] = tpl[prop];
    }
};

Number.prototype.toFixedDown = function(n) {
    var x = String(this).split(".");
    if (!x[1]) {
        return this;
    }
    return Number(x[0] + "." + String(x[1]).substring(0, n));
};

