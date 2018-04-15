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
        this.recentVisible = $(".page-section__recent-title");
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
        this.recentVisible.click(this.makeVisible.bind(this)); //clicking on recently viewed btn to show the thumbnails.
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
                <figure class="content__photo--current" data-uploaddate="${element.uploadDate}" data-location="${element.location}" data-user="${element.uploader}" data-thumb="${element.recent}" data-full = "${element.full}"  data-title = "${element.title}"><img class="page-section__photo-page--img" src="${element.thumb}"><figcaption>${element.title}</figcaption></figure>
            `);    
        });

        //click features
        $("figure").click((event) =>{    
            let thumb = event.currentTarget.dataset.thumb;
            var imgsrc = event.currentTarget.dataset.full;
            var imgtitle = event.currentTarget.dataset.title;
            var date = event.currentTarget.dataset.uploaddate;
            var user = event.currentTarget.dataset.user;
            var location = event.currentTarget.dataset.location;

            //Displaying in a model
            this.modal.openModal(imgsrc, imgtitle, date, user, location);
            
            //for recently viewed display
            var photoObj2 = { imgthumb: thumb, imgfull: imgsrc}
            this.thumblist.unshift(photoObj2);
            this.displayRecent(this.thumblist);
        });
       
    }
    //Displaying recently viewed thumb..
    displayRecent(imgthumb) {
        let htmlstr = "";
        var newImgThumb = this.removeDuplicateThumb(imgthumb);

        //slicing the first 5 items only.
        var items = newImgThumb.slice(0, 5).map(newItems => {
            return newItems;
        })

        items.forEach(element => {
            htmlstr += `<img src="${element.imgthumb}" alt="${element.imgfull}" class="page-section__recent-img">`;

        });
        
        this.img.empty().append(htmlstr); //Appending thumbnails

        //click features
        $("img").click(event=>{
            //var imgsrc = event.currentTarget.src;
            var imgfull = event.currentTarget.alt;
            this.modal.openModal(imgfull);
        });
    }

    //visible thumb 
    makeVisible(){
        this.img.addClass("page-section__recent--is-visible");
    }

    //Methodes to remove the duplicate of recently viewed imgthumb
    removeDuplicateThumb(arr) {
        let unique_obj= arr.filter((thing, index, self) =>
            index === self.findIndex((t) => (
                t.imgthumb === thing.imgthumb && t.imgfull === thing.imgfull
            ))    
        )
        return unique_obj;   
    }
    
}

export default SportsImg;