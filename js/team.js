console.log("hello world :]");

$('a.show-more').on('click', function() {
    console.log("toggle");
    var p = $(this).parent('.masonry--panel')[0];
    $(p).toggleClass('expand');
});
