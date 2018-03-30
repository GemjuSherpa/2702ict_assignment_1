import $ from 'jquery';

class Modal {
    constructor() {
        this.openModalButton = $(".page-section__photo-page");
        this.modal = $(".modal");
        this.closeModalButton = $(".modal__close");
        this.imgModal = $(".modal__inner--img");
        this.imgTitle = $(".modal__inner--caption");
        this.events();
    }

    events() {
        // clicking the open modal button
        //this.openModalButton.click(this.openModal.bind(this));

        // clicking the x close modal button
        this.closeModalButton.click(this.closeModal.bind(this));

        // pushes any key
        $(document).keyup(this.keyPressHandler.bind(this));
    }

    keyPressHandler(e) {
        if (e.keyCode == 27) {
            this.closeModal();
        }
    }

    openModal(imgsrc, imgtitle) {
        this.modal.addClass("modal--is-visible");
        this.imgModal.attr('src', imgsrc);
        this.imgTitle.text(imgtitle);
    }

    closeModal() {
        this.modal.removeClass("modal--is-visible");
    }
}

export default Modal;