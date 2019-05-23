function delay (URL) {
    setTimeout( function() { window.location = URL }, 500);
};

$('.component').click(function(){
    $(this).children('div').fadeToggle(500);
});

$('.menu').click(function(){
  if (!$(this).attr('id')) {
    $('#exit').addClass('loadout').addClass('fullscreen');
  }
});
