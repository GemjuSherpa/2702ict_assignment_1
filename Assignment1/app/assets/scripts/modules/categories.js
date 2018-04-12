//imports
import $ from 'jquery';
import LargeHeroImg from './largeHeroImg';
import SportImg from './sportsImg';

class Categories {
//All constructors
    constructor() {
        this.API_KEY = "api_key=dc140afe3fd3a251c2fdf9dcd835be5c";
        this.url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&per_page=20&format=json&nojsoncallback=1&";
        this.content = $(".page-section__photo-page");
        this.t = $(".tenis");
        this.f = $(".football");
        this.s = $(".swimming");
        this.b = $(".basketball");
        this.skey = ["tennis", "football, FIFA", "swimming", "basketball"];
        this.thumblist = [];
        this.images = [];
        this.nrequest;
        this.nreceived;
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
            this.nrequest = results.photos.photo.length;
            this.nreceived = 0;

            this.numImages = results.photos.photo;
            var photoId = results.photos.photo[0].id;
    
            this.numImages.forEach(element => {
                var photoObj = { id: element.id, title: element.title }
                this.images.push(photoObj);
                this.getSizes(photoObj);
            });
            largeHero.getSizes(photoId);

        });

    }

    //flikr.photos.getSizes query
    getSizes(photoObj) {
        this.sport = new SportImg();
        let photoIdUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&format=json&nojsoncallback=1&" + this.API_KEY + "&photo_id=" + photoObj.id;
        $.getJSON(photoIdUrl, (results) => {
            this.nreceived++;
            if (results.sizes.size[4].source == true) {
                photoObj.thumb = results.sizes.size[4].source;
            }
            else{
                photoObj.thumb = results.sizes.size[3].source;
            }
            photoObj.recent = results.sizes.size[1].source;
            photoObj.full = results.sizes.size[results.sizes.size.length - 1].source;

            if (this.nrequest == this.nreceived) {
                this.sport.display(this.images);
            }
        });
        //this.content.empty();
        
    }
    
}

export default Categories;