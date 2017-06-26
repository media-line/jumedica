"use strict";

const $modalButton = '.modal__button';
const $modal = '.modal';
const $closeButton = '.modal__close';
const $layout = '.modal__background';
const bodyModalOpen = 'modal__open';
const modalOpen = 'modal_open';

export function closeModal () {
    $($modal).removeClass(modalOpen);
    $('body').removeClass(bodyModalOpen);
}

export function openModal (attr) {
    $('body').addClass(bodyModalOpen);
    $('.modal[data-modal="'+attr+'"]').addClass(modalOpen);
}

$(document).ready(function () {
    $($modalButton).click(function (e) {
        e.preventDefault();
        let modalAttr = $(this).attr('data-modal-button');

        openModal (modalAttr);
    });

    $($layout).click(function (e) {
        closeModal ();
    });

    $($closeButton).click(function (e) {
        closeModal ();
    });
});
