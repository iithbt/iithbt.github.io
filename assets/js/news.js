var url = "https://iithbt.herokuapp.com/news/api/?page_size=25";
var loading = true;
var $loader_div = $("<div>", {"class": "post-box"});
var $loader_img = $("<img>",{"src": "../images/loader.gif"});
$loader_div.append($loader_img);
var container;
function loadNews() {
    container.append($loader_div);
    $.getJSON(url, function(json){
        if (json.next != null) {
            url = json.next;
        } else {
            $(window).off('scroll');
        }
        $loader_div.remove();
        $.each(json.results, function(i, field){
            field.pub_date = $.format.prettyDate(field.pub_date);
            var tmpl = $.templates("#newsArticleTemplate");
            var post = tmpl.render({post : field});
            container.append(post);
        });
        loading=false;
        // registerImageLoadingCallbacks();
    });
}
function registerImageLoadingCallbacks() {
    $('.post-image').each(function() {
        $(this).imagesLoaded().done( function( instance ) {
            console.log(instance);
            container.waterfall({ 
                colMinWidth: 300,
                autoresize: true
            });
        });
    });
}

$(document).ready(function() {
    container = $(".waterfall");
    loadNews();
    $(window).on('scroll', function() {
        if (!loading) {
            if($(window).scrollTop() >= container.offset().top + container.outerHeight() - window.innerHeight) {
                loading=true;
                loadNews();
            }
        }
    });
});
