'use strict';

const $sliderMain = '.gallery-slider';

$(document).ready(function () {
    $($sliderMain).slick({
        slidesToShow: 7,
        prevArrow: '<button type="button" class="gallery-slider__arrow gallery-slider__arrow_prev"><span class="gallery-slider__arrow-img"></span></button>',
        nextArrow: '<button type="button" class="gallery-slider__arrow gallery-slider__arrow_next"><span class="gallery-slider__arrow-img"></span></button>',
        responsive: [
            {
              breakpoint: 1600,
              settings: {
                slidesToShow: 5,
              }
            },
            {
              breakpoint: 1199,
              settings: {
                slidesToShow: 4,
              }
            },
            {
              breakpoint: 991,
              settings: {
                slidesToShow: 3,
              }
            },
            {
                breakpoint: 767,
                settings: {
                  slidesToShow: 1,
                }
            }
        ]
    });
});
