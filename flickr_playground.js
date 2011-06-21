function FlickrAPI (Y) {
  this.y = Y;
}

FlickrAPI.prototype = {

  constants: {
    FLICKR_QUERY: "select source from flickr.photos.sizes where photo_id in (select id from flickr.photos.search where has_geo=\"true\" and text=\"XXXXXXX\") and height > 300 and width < 500 limit 10" 
  },

  get_flickr_photos: function (place_string) {
    var main_div = this.y.one("#main")
    main_div.removeClass("complete");
    var query = this.constants.FLICKR_QUERY.replace("XXXXXXX", place_string);
    var yql_query = this.y.YQL(query, this._yql_flickr_callback);
    yql_query.send();
  },

  _yql_flickr_callback: function (results) {
    var main_div = this.y.one("#main")
    main_div.addClass("complete");
    if ( ! results["query"]["results"])
      return false;
    var sources = results["query"]["results"]["size"];
    main_div.append("<ul></ul>");
    var new_ul = main_div.get("firstChild");
    if ( ! sources[0]){
      new_ul.append("<li><img src=\"" + sources["source"] + "\"></img></li>");
      return false;
    }
    for (var i = 0; i < sources.length; i++){
      new_ul.append("<li><img src=\"" + sources[i]["source"] + "\"></img></li>");
    }
  }
};
