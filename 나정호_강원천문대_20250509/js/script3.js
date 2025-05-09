$(document).ready(function(){
    //**** 마우스오버  ****//
    //서브메뉴 숨기고 시작
    $(".sub_menu").hide();
    // 마우스 오버
    $(".main_menu > li").mouseenter(function(){
      // 현재 li의 서브메뉴만 슬라이드다운
      $(this).find(".sub_menu").stop().slideDown(300);
  }).mouseleave(function(){
      // 현재 li의 서브메뉴만 슬라이드업
      $(this).find(".sub_menu").stop().slideUp(300);
  });

    //**** 이미지슬라이드  ****//
    //a태그 2번,3번 숨기고 시작

  $(".image_slide > a:gt(0)").hide();
  
  setInterval(function(){
    $('.image_slide a:first-child')
    .fadeOut(1000)
    .next('a')
    .fadeIn(1000)
    .end()
    .appendTo('.image_slide');
  }, 3000);
});