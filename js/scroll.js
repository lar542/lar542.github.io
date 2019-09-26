$('#ToTop').on('click', function(){
    $('html, body').stop().animate({scrollTop: 0}, 500);
});

$('#ToBottom').on('click', function(){
    $('html, body').stop().animate({scrollTop: document.body.scrollHeight}, 500);
});