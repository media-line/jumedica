'use strict';

const $sliderMain = '.related-sliders__main';
const $sliderControl = '.related-sliders__control';

$(document).ready(function () {
    $($sliderMain).slick({
        arrows: false,
        slidesToShow: 1,
        asNavFor: $sliderControl,
    });

    $($sliderControl).slick({
        slidesToShow: 4,
        asNavFor: $sliderMain,
        focusOnSelect: true,
        prevArrow: '<button type="button" class="related-sliders__arrow related-sliders__arrow_prev"></button>',
        nextArrow: '<button type="button" class="related-sliders__arrow related-sliders__arrow_next"></button>',
        responsive: [
            {
              breakpoint: 991,
              settings: {
                slidesToShow: 3
              }
            }
        ]
    });
});
