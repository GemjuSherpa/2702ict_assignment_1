//all the js files..

import $ from 'jquery';
import MobileMenu from './modules/MobileMenu';
import Search from './modules/Search';
import LargeHeroImg from './modules/LargeHeroImg';
import SportsImg from './modules/SportsImg';
import MostPopular from './modules/MostPopular';
import Categories from './modules/Categories';
import Modal from './modules/Modal';


//Methodes should run on window loading.
$(document).ready(function () {
    var mobileMenu = new MobileMenu();
    var search = new Search();
    var largeHero = new LargeHeroImg();
    var bodyPhotos = new SportsImg();
    var popular = new MostPopular();
    var categories = new Categories();
    // var modal = new Modal();
   
});

