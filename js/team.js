console.log("hello world :]");

/*
var modal = new tingle.modal({
    footer: false,
    stickyFooter: false,
    closeLabel: "Close",
    // cssClass: ['fp-normal-scroll'],
    onOpen: function() {
        console.log('modal open');
    },
    onClose: function() {
        console.log('modal closed');
    },
    beforeClose: function() {
        // here's goes some logic
        // e.g. save content before closing the modal
        return true; // close the modal
        return false; // nothing happens
    }
});

$('a.show-more').on('click', function() {
    console.log("toggle+1");
    var p = $(this).parent('.masonry--panel')[0];
    modal.setContent(p.innerHTML);
    modal.open();
});
*/

var slideMenuHandler = function(anchorLink, index, slideIndex, direction, nextSlideIndex){
    $('#slidesMenu li a').removeClass('active');
    $($('#slidesMenu li a')[nextSlideIndex]).addClass('active');
};

var slidesIndex = {
    'core': 0,
    'sfd': 1,
    'astrionics': 2,
    'mechsystems': 3,
};

$(document).ready(function() {
    $('#main-wrapper').fullpage({
        scrollOverflow: true,
        scrollOverflowReset: true,
        controlArrows: true,
        verticalCentered: true,
        slidesNavigation: false,
        normalScrollElements: '.tingle-modal',
        onSlideLeave: slideMenuHandler,
    });

    $('#slidesMenu li a').on('click', function() {
        switch(slidesIndex[$(this).data('src')]) {
            case 0:
                $.fn.fullpage.moveTo(1, 0);
                break;
            case 1:
                $.fn.fullpage.moveTo(1, 1);
                break;
            case 2:
                $.fn.fullpage.moveTo(1, 2);
                break;
            case 3:
                $.fn.fullpage.moveTo(1, 3);
                break;
        };

        $('#slidesMenu li a').removeClass('active');
        $(this).addClass('active');
    });
});
