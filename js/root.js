// root.js
var _sbinded      = false; // scroll binded
var _rbinded      = false; // resize binded
var _el_scroll    = null;
var navbar_height = 50;

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

var scroll_worker = debounce(function() {
    var scroll_start = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if(scroll_start > navbar_height) {
        removeClass(_el_scroll, 'js--no-scroll');
    } else {
        addClass(_el_scroll, 'js--no-scroll');
    }
}, 200);

var resize_worker = debounce(function() {
  navbar_height = document.querySelector('nav.navbar').offsetHeight;
}, 200);

var bind_scroll = function() {
    if (!_sbinded) {
        _el_scroll = document.querySelector('nav.navbar');
        window.addEventListener('scroll', scroll_worker);
        _sbinded = true;
    }
}

var bind_resize = function() {
    if (!_rbinded) {
        window.addEventListener('resize', resize_worker);
        _rbinded = true;
    }
}

var members_carousel = function() {
    var elem = document.querySelector('.container--intro');
    var flkty = new Flickity( elem, {
        imagesLoaded: true,
        contain: true,
        cellAlign: 'center',
        cellSelector: '.container--intro-cell',
        bgLazyLoad: true,
        pageDots: true,
        wrapAround: true,
        autoPlay: 3500,
    });
};

ready(function() {
    bind_resize();
    // bind_scroll();

    resize_worker();
    // scroll_worker();

    members_carousel();
});
