var myFlipBook = function(file, func) {
    /* Receives a video as argument and split it into frames, also allows to add
     * decoration and text on the first frame.
     */
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

    this.page_sizes = {
        "a4": {
                "size_x": 297, 
                "size_y":210,
                "max_per_x": 2,
                "max_per_y": 4
            }
    };

    /* callback function returns frames after extraction */
    this.callback_func = func;

    if (!file) {
        throw {name: "FileInput", message: "Missing input file"};
    }

    this.fileURL = file;
    this.video = document.createElement("video");
    this.video.src = this.fileURL;

    var that = this;

    this.createImage = function() {
        /* Draw video frame into a canvas object */
        var canvas = document.createElement("canvas");
        canvas.width = that.frame.width;
        canvas.height = that.frame.height;

        var context = canvas.getContext("2d");
        context.drawImage(that.video, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL();
    };

    this.video.addEventListener("seeked", function() {
        /* Go throught the video taking frames on each interval and appending 
         * it to the list */
        that.frames.push(that.createImage());

        that.position += that.increment;

        if (that.position.toFixedDown(2) <= this.duration) {
            this.currentTime = that.position;
        } else {
            that.callback_func(that.frames);
        }

    }, false);

    this.video.addEventListener("loadeddata", function() {
        /* Get video properties */
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
    /* Set svg image as cover decoration */
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

myFlipBook.prototype.createHtmlContent = function(page_size) {    

    if (page_size in Object.keys(this.page_sizes)) {
        this.page = page;
    } else {
        this.page = this.page_sizes.a4;
    }
    var content = $('<div></div>');
    var y_counter = 0;
    var frames = this.getFrames();
    var table = $('<table class="fb-printer"></table>');

    while (frames.length) {

        var tmp_frames = frames.splice(0, this.page.max_per_x);

        var line = $('<tr></tr>');
        for (var i=0; i<tmp_frames.length; i++) {
            line.append('<td class="fb-printer"><img class="frames" src="'+tmp_frames[i]+'"></td>');
        }
        $(table).append(line);

        y_counter++; 
        if (y_counter >= this.page.max_per_y) {
            y_counter = 0;
            content.append(table);
            table = $('<table class="fb-printer"></table>');
        } 
    }
    this.content = content;
}
