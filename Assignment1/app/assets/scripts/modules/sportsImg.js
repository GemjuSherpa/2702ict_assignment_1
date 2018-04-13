//All Imports.
import $ from 'jquery';
import Modal from './modal';

class SportsImg {
//Constructor
    constructor() {
        
        this.API_KEY = "api_key=dc140afe3fd3a251c2fdf9dcd835be5c";
        this.url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&per_page=20&format=json&nojsoncallback=1&";
        this.content = $(".page-section__photo-page");
        this.img = $(".page-section__recent-imglist");
        this.images = [];
        this.imagesDetails = [];
        this.nrequest;
        this.nreceived;
        this.events();
        this.modal = new Modal();
        this.thumblist = [];
        
    }

//All Events
    events() {
        $(window).on("load", this.getResults.bind(this)); //Displays all the thumbnails upon window loading.

    }
//All methodes
    //Flickr's photo search query
    getResults() {
        $.getJSON(this.url + this.API_KEY + "&text=sports", (results) => {
            this.nrequest = results.photos.photo.length;
            this.nreceived = 0;

            for (let i = 0; i < this.nrequest; i++) {
                var photoObj = { id: results.photos.photo[i].id, title: results.photos.photo[i].title }
                this.images.push(photoObj);
                this.getSizes(photoObj);
                this.getInfo(photoObj);
            } 
             
        });
    }

    //flickr's getInfo query
    getInfo(photoObj){
        let photoIdUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&format=json&nojsoncallback=1&" + this.API_KEY + "&photo_id=" + photoObj.id;
        $.getJSON(photoIdUrl, (results)=>{
            photoObj.uploadDate = results.photo.dates.taken;
            photoObj.uploader = results.photo.owner.username;
            photoObj.location = results.photo.owner.location;
            
        });
    }

    //flickr's getSizes query
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

    //Displaying Images thumb and modal
    display(images){
        let clickcount = 0;
        this.content.empty();
        images.forEach(element => { 
            this.content.append(`
                <figure class="content__photo--current" data-uploaddate="${element.uploadDate}" data-location="${element.location}" data-user="${element.uploader}" data-thumb="${element.recent}" data-full = "${element.full}"  data-title = "${element.title}"><img class="page-section__photo-page--img" src="${element.thumb}" height="270px", width="270px"><figcaption>${element.title}</figcaption></figure>
            `);    
        });
        
        $("figure").click((event) =>{
            // clickcount++;
            let thumb = event.currentTarget.dataset.thumb;
            this.thumblist.unshift(thumb);

            var imgsrc = event.currentTarget.dataset.full;
            var imgtitle = event.currentTarget.dataset.title;
            var date = event.currentTarget.dataset.uploaddate;
            var user = event.currentTarget.dataset.user;
            var location = event.currentTarget.dataset.location;

            this.modal.openModal(imgsrc, imgtitle, date, user, location);
            
            // if(clickcount == this.thumblist.length){
            this.displayRecent(this.thumblist);
            //}
        });
       
    }
    //Displaying recently viewed thumb..
    displayRecent(imgthumb) {
        let htmlstr = "";
        var newImgThumb = this.removeDuplicateThumb(imgthumb);
        console.log(newImgThumb);
        newImgThumb.forEach(element => {
            htmlstr += `<img src="${element}" alt="" class="page-section__recent-img">`;

        });
        this.img.empty().append(htmlstr);

    }

    //Methodes to remove the duplicate of recently viewed imgthumb
    removeDuplicateThumb(arr) {
        let unique_array = arr.filter(function (elem, index, self) {
            return index == self.indexOf(elem);
        });
        return unique_array
    }
    
}

export default SportsImg;