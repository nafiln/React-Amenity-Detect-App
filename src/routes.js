/*!

=========================================================
* Black Dashboard React v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Detect from "views/Detect";
import Documentation from "views/Documentation";

var routes = [
  {
    path: "/detect",
    name: "Detect",
    rtlName: "تحقق",
    icon: "tim-icons icon-image-02",
    component: Detect,
    layout: "/admin"
  },
  {
    path: "/documentation",
    name: "Documentation",
    rtlName: "آلية عمل النظام",
    icon: "tim-icons icon-bullet-list-67",
    component: Documentation,
    layout: "/admin"
  },

];
export default routes;
