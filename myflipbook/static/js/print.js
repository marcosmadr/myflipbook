$(document).ready(function(){

var generatePrintable = function() {

    var page = {
        max_x: 2,
        max_y: 4,
    };

    var y_counter = 0;
    var table = $('<table></table>');

    while (myvideo.frames.length) {

        var frames = myvideo.frames.splice(0, page.max_x);

        var line = $('<tr></tr>');
        for (var i=0; i<frames.length; i++) {
            line.append('<td><img src="'+frames[i]+'"></td>');
        }
        $(table).append(line);

        y_counter++; 
        if (y_counter >= page.max_y) {
            y_counter = 0;
            $('#div-print').append(table);
            table = $('<table></table>');
        } 
    }
    $('#div-print').append(table);
}

generatePrintable();

});
