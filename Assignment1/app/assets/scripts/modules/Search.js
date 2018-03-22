import $ from 'jquery';

class Search {
    //1. Describe and create/initiate object.
    constructor() {
        this.addSearchHTML(); //calling html body function of search area. NOTE: this function must call before all other functions.
        this.resultsDiv = $("#search-overlay__results");
        this.openButton = $(".search-icon");
        this.closeButton = $(".search-overlay__close");
        this.searchOverlay = $(".search-overlay");
        this.searchField = $("#search-term");
        this.images = [];
        this.API_KEY = "api_key=dc140afe3fd3a251c2fdf9dcd835be5c";
        this.url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&per_page=10&format=json&nojsoncallback=1&";
        this.events();
        this.isOverlayOpen = false;
        this.typingTimer;
        this.isSpinnerVisible = false;
        this.previousValue;

    }

    //2.Events$
    events() {
        this.openButton.on("click", this.openOverlay.bind(this));
        this.closeButton.on("click", this.closeOverlay.bind(this));
        $(document).on("keydown", this.keyPressDispatcher.bind(this));
        this.searchField.on("keyup", this.typingLogic.bind(this));
    }

    //3.methodes
    typingLogic() {
        if (this.searchField.val() != this.previousValue) {
            clearTimeout(this.typingTimer);
            if (this.searchField.val()) {
                if (!this.isSpinnerVisible) {
                    this.resultsDiv.html('<div class = "spinner-loader"></div>');
                    this.isSpinnerVisible = true;
                }
                this.typingTimer = setTimeout(this.getResults.bind(this), 750);
                
            }
            else {
                this.resultsDiv.html('');
                this.isSpinnerVisible = false;
            }
        }

        this.previousValue = this.searchField.val();
    }

    //dynamic search result using RESTful api's
    getResults() {

        //Flicker Rest API's for search functionalities.
        $.getJSON(this.url + this.API_KEY + "&text=" + this.searchField.val(), (results) => {
            this.numImages = results.photos.photo.length;
            //this.content.empty();
            for (let i = 0; i < this.numImages; i++) {
                var photoObj = { id: results.photos.photo[i].id, title: results.photos.photo[i].title }
                this.images.push(photoObj);
                this.getSizes(photoObj);
                this.isSpinnerVisible = false;
            }
            
            
        });

    }

    getSizes(images) {
        let photoIdUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&format=json&nojsoncallback=1&" + this.API_KEY + "&photo_id=" + images.id;
        $.getJSON(photoIdUrl, (results) => {
            console.log(results);
            images.thumb = results.sizes.size[4].source;
            //images.full = results.sizes.size[results.sizes.size.length - 1].source;
            this.resultsDiv.append(`
                <figure class="content__photo--img" data-full="${images.thumb}"><img src="${images.thumb}" height="270px", width="270px"><figcaption>${images.title}</figcaption></figure>
            `);
            
            
        });
        this.isSpinnerVisible = false;
    }

    keyPressDispatcher(e) {
        if (e.keyCode == 83 && !this.isOverlayOpen && !$('input, textarea').is(':focus')) {
            this.openOverlay();
        }
        if (e.keyCode == 27 && this.isOverlayOpen) {
            this.closeOverlay();
        }
    }


    openOverlay() {
        this.searchOverlay.addClass("search-overlay--active");
        setTimeout(() => this.searchField.focus(), 301);
        this.searchField.val('');
        $("body").addClass("body-no-scroll");
        this.isOverlayOpen = true;
    }

    closeOverlay() {
        this.searchOverlay.removeClass("search-overlay--active");
        $("body").removeClass("body-no-scroll");
        this.isOverlayOpen = false;
    }

    // HTML body to append search area and results
    addSearchHTML() {
        $("body").append(`
			<div class="search-overlay">
			    <div class="search-overlay__top">
			      <div class="container">
                    <i class="fa fa-search search-overlay__icon" aria-hidden="true"><img src="assets/images/icons/overlay-search.png" height="50px" width="50px"></i>
			        <input type="text" name="" class="search-term" placeholder="What are you looking for?" id="search-term">
			        <span class="fa fa-window-close search-overlay__close" aria-hidden="true">&times</span>
			      </div>
			    </div>
			    <div class="container">
			      <div id="search-overlay__results">
			        
			      </div>
			    </div>
			</div>
		`);
    }

}

export default Search;