import $ from 'jquery';

class SportsImg {

    constructor() {
        this.API_KEY = "api_key=dc140afe3fd3a251c2fdf9dcd835be5c";
        this.url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&per_page=20&format=json&nojsoncallback=1&";
        this.content = $(".page-section__photo-page");
        this.images = [];
        this.events();
    }

    events() {
        $(window).on("load", this.getResults.bind(this));

    }

    getResults() {
        $.getJSON(this.url + this.API_KEY + "&text=sports", (results) => {
            this.numImages = results.photos.photo.length;
            //this.content.empty();
            for (let i = 0; i < this.numImages; i++) {
                var photoObj = { id: results.photos.photo[i].id, title: results.photos.photo[i].title }
                this.images.push(photoObj);
                this.getSizes(photoObj);
            }

        });


    }

    getSizes(images) {
        let photoIdUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&format=json&nojsoncallback=1&" + this.API_KEY + "&photo_id=" + images.id;
        $.getJSON(photoIdUrl, (results) => {
            //console.log(results);
            images.thumb = results.sizes.size[3].source;
            //images.full = results.sizes.size[results.sizes.size.length - 1].source;
            this.content.append(`
                <figure class="content__photo--img" data-full="${images.thumb}"><img src="${images.thumb}" height="270px", width="270px"><figcaption>${images.title}</figcaption></figure>
            `);
        });
    }


}

export default SportsImg;