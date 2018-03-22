import $ from 'jquery';

class LargeHeroImg {
    //Constructor
    constructor() {
        this.contentDiv = $('picture');
        this.API_KEY = "api_key=dc140afe3fd3a251c2fdf9dcd835be5c";
        this.url = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&format=json&nojsoncallback=1&per_page=20";
        this.events();
        //this.getResults();
    }

    // All the Events..
    events() {
        $(window).on("load", this.getResults.bind(this));
    }

    //All the methodes..
    getResults() {
        $.getJSON(this.url + "&" + this.API_KEY, (results) => {

            //console.log(results);
            var photoId = results.photos.photo[0].id;
            var photoTitle = results.photos.photo[0].title;
            this.getSizes(photoId);
        });
    }

    //get photo url

    getSizes(photoId) {
        let photoIdUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&format=json&nojsoncallback=1&" + this.API_KEY + "&photo_id=" + photoId;
        $.getJSON(photoIdUrl, (results) => {
            //console.log(results);
            //this.contentDiv.empty();
            var largehero = results.sizes.size.length
            this.contentDiv.append(`
                <img src="${results.sizes.size[largehero-4].source}" media="(min-width: 640px; min-height: 600px)" class="large-hero__image">
            `);
        });
    }

}

export default LargeHeroImg;