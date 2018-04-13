import $ from 'jquery';

class MostPopular {

    constructor() {
        this.API_KEY = "api_key=dc140afe3fd3a251c2fdf9dcd835be5c";
        this.url = "https://api.flickr.com/services/rest/?method=flickr.photos.getPopular&per_page=20&format=json&nojsoncallback=1&";
        this.content = $(".page-section__photo-page");
        this.btn = $(".most_popular");
        this.images = [];
        this.events();
    }

    events() {
        this.btn.on("click", this.getResults.bind(this));

    }

    getResults() {
        $.getJSON(this.url + this.API_KEY, (results) => {
            //this.numImages = results.photos.photo.length;
            console.log(results);
            //this.content.empty();
            for (let i = 0; i < this.numImages; i++) {
                var photoObj = { id: results.photos.photo[i].id, title: results.photos.photo[i].title }
                this.images.push(photoObj);
                //this.getPopular(photoObj);
            }

        });


    }

    getPopular(images) {
        let photoIdUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getPopular&format=json&nojsoncallback=1&" + this.API_KEY;
        $.getJSON(photoIdUrl, (results) => {
            console.log(results);
            images.thumb = results.sizes.size[4].source;
            //images.full = results.sizes.size[results.sizes.size.length - 1].source;
            this.content.append(`
                <figure class="content__photo--img" data-full="${images.thumb}"><img src="${images.thumb}" height="270px", width="270px"><figcaption>${images.title}</figcaption></figure>
            `);
        });
    }


}

export default MostPopular;