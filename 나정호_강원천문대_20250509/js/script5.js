$(document).ready(function(){
  $(".main_menu > li").on("mouseover", function(){
      $(this).find(".sub_menu").stop(true, true).slideDown(300);
  });

  $(".main_menu > li").on("mouseout", function(){
      $(this).find(".sub_menu").stop(true, true).slideUp(300);
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


    // ******  탭 메뉴 공지사항 갤러리  ****** //
    $(function(){
      $('.contents_block1 > h3').click(function(){
          $('.contents_block1 > h3').removeClass('on');
          $(this).addClass('on');
          $('.contents_block1 ul').removeClass('on');
          $(this).next("ul").addClass("on");
   
    });
  });

  // ******  레이어팝업  ****** //
  $('.notice li:first').click(function(){
    $('#modalWrap').addClass("active");
  });
  $('.btn').click(function(){
    $('#modalWrap').removeClass("active");
  });


});