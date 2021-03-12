$(function () {
  $(".js-modal-open").click(function () {
    $("html,body").css("overflow", "hidden");
    $(".js-modal").fadeIn();
    return false;
  });
  $(".js-modal-close").click(function () {
    $("html,body").removeAttr("style");
    $(".js-modal").fadeOut();
    return false;
  });
});