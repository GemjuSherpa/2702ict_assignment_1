import $ from 'jquery';

class RecentlyViewed {
    constructor() {
        this.img = $(".page-section__recent-imglist");
        this.thumblist = [];
        this.displayThumb();
        //this.events();
    }

    events() {
       
        
    }

    displayThumb(){
        console.log(this.thumblist);
        let htmlstr = "";
        this.thumblist.forEach(element => {
            htmlstr += `<img src="${element}" alt="" class="page-section__recent-img">`;
            
        });
        this.img.empty().append(htmlstr);
        
    }

    

}

export default RecentlyViewed;