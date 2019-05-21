$('.component').click(function(){
    $(this).children('div').fadeIn(1000);
})
$('button').click(function(){
    $(this).closest('.overlay').fadeOut(1000);
})
