console.log("hello world :]");

var modal = new tingle.modal({
    footer: false,
    stickyFooter: false,
    closeLabel: "Close",
    // cssClass: ['masonry--panel'],
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
    // var p = $(this).siblings('.extra-info-wrapper')[0];
    var p = $(this).parent('.masonry--panel')[0];
    modal.setContent(p.innerHTML);
    modal.open();
});

$(document).ready(function() {
    $('#main-wrapper').fullpage({
        scrollOverflow: true,
        scrollOverflowReset: true,
        controlArrows: true,
        verticalCentered: true,
        slidesNavigation: true,
        slidesNavPosition: 'bottom',
    });
});
