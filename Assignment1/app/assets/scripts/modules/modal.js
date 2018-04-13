//All Imports
import $ from 'jquery';


class Modal {
//constructor
    constructor() {
        this.openModalButton = $(".page-section__photo-page");
        this.modal = $(".modal");
        this.closeModalButton = $(".modal__close");
        this.imgModal = $(".modal__inner--img");
        this.imgTitle = $(".modal__inner--caption");
        this.user = $(".username");
        this.date = $(".date");
        this.location = $(".location");
        this.events();
    }

//All Events..
    events() {
        // clicking the x close modal button
        this.closeModalButton.click(this.closeModal.bind(this));

        // pushes any key
        $(document).keyup(this.keyPressHandler.bind(this));
    }

//All Methodes.
    //ESC key handler to close the modal.
    keyPressHandler(e) {
        if (e.keyCode == 27) {
            this.closeModal();
        }
    }

    //Displaying a Modal
    openModal(imgsrc, imgtitle, date, user, location) {
        
        this.modal.addClass("modal--is-visible");
        this.imgModal.attr('src', imgsrc);
        this.imgTitle.text(imgtitle);
        this.user.text("UserName: " + user);
        this.date.text("Date: " + date);
        this.location.text("Location: " + location);
        
    }

    //Closing a Modal
    closeModal() {
        this.modal.removeClass("modal--is-visible"); 
        this.imgModal.attr('src', '');
    }

}

export default Modal;