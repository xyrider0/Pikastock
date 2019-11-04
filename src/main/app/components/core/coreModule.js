import HeaderCtrl from './header/headerController'
import FooterCtrl from './footer/footerController'

let coreModule = angular.module('App.core',[]);

//coreModule.controller('headerController', HeaderCtrl);
coreModule.controller('footerController', FooterCtrl);

export default coreModule;