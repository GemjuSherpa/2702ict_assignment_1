import $ from 'jquery';
import LargeHeroImg from './largeHeroImg';
import Modal from './modal';

class Categories {
//All constructors
    constructor() {
        this.API_KEY = "api_key=dc140afe3fd3a251c2fdf9dcd835be5c";
        this.url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&per_page=20&format=json&nojsoncallback=1&";
        this.content = $(".page-section__photo-page");
        this.contentDiv = $('picture');
        this.t = $(".tenis");
        this.f = $(".football");
        this.s = $(".swimming");
        this.b = $(".basketball");

        this.skey = ["tennis", "football, FIFA", "swimming", "basketball"];
        
        this.recent = [];
        this.images = [];
        this.events();
    }

//Events triggred.
    events() {
        this.t.click([this.skey[0]], this.getResults.bind(this));
        this.f.click([this.skey[1]], this.getResults.bind(this));
        this.s.click([this.skey[2]], this.getResults.bind(this));
        this.b.click([this.skey[3]], this.getResults.bind(this));

    }
// All Methodes
    //flikr.photos.search query.
    getResults(evt) {
        var text = evt.data[0];
        var largeHero = new LargeHeroImg();
        
        $.getJSON(this.url + this.API_KEY + "&text=" + text, (results) => {
            this.numImages = results.photos.photo.length;
            var photoId = results.photos.photo[0].id;
            for (let i = 0; i < this.numImages; i++) {
                var photoObj = { id: results.photos.photo[i].id, title: results.photos.photo[i].title }
                this.images.push(photoObj);
                this.getSizes(photoObj);
            }
            largeHero.getSizes(photoId);

        });
        return false;

    }

    //flikr.photos.getSizes query
    getSizes(images) {
        let photoIdUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&format=json&nojsoncallback=1&" + this.API_KEY + "&photo_id=" + images.id;
        $.getJSON(photoIdUrl, (results) => {

            //images.thumb = results.sizes.size[4].source;
            if (results.sizes.size[4].source == true) {
                images.thumb = results.sizes.size[4].source;
            }
            else{
                images.thumb = results.sizes.size[3].source;
            }
            //images.full = results.sizes.size[results.sizes.size.length - 1].source;
            console.log(images.full);
            this.content.append(`
                <figure class="content__photo--img" data-full="${images.thumb}" data-title ="${images.title}"><img src="${images.thumb}" height="290px", width="300px"><figcaption>${images.title}</figcaption></figure>
            `);
            $("figure").click((event) => {
                var imgsrc = event.currentTarget.dataset.full;
                var imgtitle = event.currentTarget.dataset.title;
                //console.log(event);
                var modal = new Modal();
                modal.openModal(imgsrc, imgtitle);
            })
        });
        this.content.empty();
    }
}

export default Categories;