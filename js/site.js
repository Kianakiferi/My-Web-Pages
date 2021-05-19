var CurrentTab = "home-tab"

//#region Navgation
// Navgation to original page on start.
$(document).ready(function () {
    var result = localStorage.getItem("CurrentTab");
    if (result != null) {
        CurrentTab = result;
    }
    OnNavigated(CurrentTab)
});

// NavgationBar click and switch pages
$('#navTab a').on('click', function (event) {
    event.preventDefault()

    $(this).tab('show')
    if (CurrentTab != this.id) {
        OnNavigated(this.id)
    }
})

function OnNavigated(Page) {
    var tab = "View/" + Page.split("-", 1) + ".html";
    $('.body-page').load(tab);

    CurrentTab = Page;
    localStorage.setItem("CurrentTab", CurrentTab);
}
//#endregion

//#region xBRZ Page


//#endregion