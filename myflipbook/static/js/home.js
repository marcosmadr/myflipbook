$(document).ready(function(){

  $('.nav-link,.fb-btn').click(function() {    
    var stop_at = $($(this).attr('href')).offset().top;
    $('html,body').animate({scrollTop: stop_at}, 500);
    return false;
  });
  
});


