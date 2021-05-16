$(document).ready(function () {
    //加载header.html
    $('.body-page').load('Views/Home.html');
});

function PageNav(item)
{
  switch(item)
  {
    case "home":
      $('#navTab li:first-child a').tab('show')
      $('.body-page').load('Views/Home.html');
      break;
    case "about":
      $('#navTab li:nth-child(2) a').tab('show')
      $('.body-page').load('Views/About.html');
      break;
  }

}