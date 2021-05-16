var CurrentTab = "home-tab"

$(document).ready(function () 
{
  PageNav(CurrentTab)
});

$('#navTab a').on('click', function (event) 
{
  event.preventDefault()
  $(this).tab('show')

  PageNav(this.id)
})

function PageNav(Page) 
{
  var tab = "View/" + Page.split("-", 1) + ".html";
  $('.body-page').load(tab);
  CurrentTab = Page;
}