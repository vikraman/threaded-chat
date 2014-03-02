var socket = io.connect();
var cur_id = null;

socket.on('msg', function(data) {
    console.log(data);
});

socket.on('im', function(im) {
    var parent_el = im.parent == null ? $('#log') : $('#' + im.parent);
    parent_el.append('<blockquote><div id=\'' + im.id + '\'></div></blockquote>');
    var im_id_el = $('#' + im.id);
    im_id_el.append(new Date(im.dt).toLocaleTimeString() + ': ' + im.text);
    cur_id = im.id;
    $('#im').attr('placeholder', im.text);
    im_id_el.on('click', function(event) {
        event.stopPropagation();
        cur_id = im.id;
        $('#im').attr('placeholder', im.text);
    });
});

$(function() {
    var im_el = $('#im');
    im_el.on('keypress', function(event) {
        if(event.keyCode == 13) {
            var text = im_el.val();
            if(text) {
                var im = {'dt': new Date(),
                          'text': text,
                          'parent': cur_id
                         };
                socket.emit('im', im);
                im_el.attr('value', '');
                im_el.focus();
            }
        }
    });
});
