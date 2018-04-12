import $ from 'jquery';

import Modal from './modal';
//import RecentlyViewed from './recentlyViewed';
class SportsImg {

    constructor() {
        
        this.API_KEY = "api_key=dc140afe3fd3a251c2fdf9dcd835be5c";
        this.url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&per_page=20&format=json&nojsoncallback=1&";
        this.content = $(".page-section__photo-page");
        this.img = $(".page-section__recent-imglist");
        this.images = [];
        this.nrequest;
        this.nreceived;
        this.events();
        this.modal = new Modal();
        //this.recent = new RecentlyViewed();
        this.thumblist = [];
        
    }

    events() {
        $(window).on("load", this.getResults.bind(this));

    }

    getResults() {
        $.getJSON(this.url + this.API_KEY + "&text=sports", (results) => {
            this.nrequest = results.photos.photo.length;
            this.nreceived = 0;

            for (let i = 0; i < this.nrequest; i++) {
                var photoObj = { id: results.photos.photo[i].id, title: results.photos.photo[i].title }
                this.images.push(photoObj);
                this.getSizes(photoObj);
            }   
        });
    }

    getSizes(photoObj) {
        let photoIdUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&format=json&nojsoncallback=1&" + this.API_KEY + "&photo_id=" + photoObj.id;
        $.getJSON(photoIdUrl, (results) => {
            this.nreceived++;
            photoObj.thumb = results.sizes.size[4].source;
            if(photoObj.thumb == false){
                photoObj.thumb = results.sizes.size[3].source;
            }
            else {
                photoObj.thumb = results.sizes.size[4].source;
            }
            photoObj.recent = results.sizes.size[1].source;
            photoObj.full = results.sizes.size[results.sizes.size.length - 1].source;

            if(this.nrequest == this.nreceived){

                this.display(this.images);
            }
            
            
        });
    }

    display(images){
        
        let htmlstr = "";
        //let thumblist = [];
        let clickcount = 0;
        images.forEach(element => { 
            htmlstr +=  `<figure class="content__photo--current" data-thumb="${element.recent}" data-full = "${element.full}"  data-title = "${element.title}"><img class="page-section__photo-page--img" src="${element.thumb}" height="270px", width="270px"><figcaption>${element.title}</figcaption></figure>`    
        });
        this.content.empty();
        this.content.append(htmlstr);
        $("figure").click((event) =>{
            clickcount++;
            this.thumblist.unshift(event.currentTarget.dataset.thumb);
            var imgsrc = event.currentTarget.dataset.full;
            var imgtitle = event.currentTarget.dataset.title;

            this.modal.openModal(imgsrc, imgtitle);
            
            if(clickcount == this.thumblist.length){
                this.displayRecent(this.thumblist);
            }
        });
       
    }

    displayRecent(imgthumb) {
        let htmlstr = "";
        imgthumb.forEach(element => {
            htmlstr += `<img src="${element}" alt="" class="page-section__recent-img">`;

        });
        this.img.empty().append(htmlstr);

    }
    

}

export default SportsImg;