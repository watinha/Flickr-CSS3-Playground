YUI({logInclude: {TestRunner: true}}).use('test', 'console', 'yql', 'event-custom', function (Y) {

  var yql_flickr_tests = new Y.Test.Case({

    name: "Testing Flickr YQL requests",

    test_yql_gets_called_with_query_string: function(){
      var place = "San Francisco";

      var yql_query_mock = Y.Mock();
      Y.Mock.expect(yql_query_mock, {
        method: "send",
        args: []
      });

      var yMock = Y.Mock();
      Y.Mock.expect(yMock, {
        method: "YQL",
        args: ["select source from flickr.photos.sizes where photo_id in (select id from flickr.photos.search where has_geo=\"true\" and text=\"San Francisco\") and height > 300 and width < 500 limit 10", Y.Mock.Value.Function],
        returns: yql_query_mock
      });

      var main_div = Y.one("#main");
      Y.Mock.expect(yMock, {
        method: "one",
        args: ["#main"],
        returns: main_div
      });

      var flickr_api = new FlickrAPI(yMock);
      flickr_api.get_flickr_photos(place);

      Y.Mock.verify(yMock);
      Y.Mock.verify(yql_query_mock);
    },

  });

  var dom_presentation_tests = new Y.Test.Case({

    name: "Testing Photos Presentation",

    setUp: function () {
      Y.one("#main").set("innerHTML", "");
      Y.one("#main").removeClass("complete");
    },

    test_callback_function_builds_ul_and_lis: function () {
      var flickr_api = new FlickrAPI(Y);
      var mocked_results = {
        "query": {
          "results": {
            "size": [
              {"source": "opa1.gif"},
              {"source": "opa2.png"}
            ]
          } 
        }
      };

      flickr_api._yql_flickr_callback(mocked_results);

      var lis = Y.all("#main > ul > li");
      Y.Assert.areEqual(2, lis.size());

      lis.each(function (iterator) {
        var image = iterator.get("firstChild");
        Y.assert(image.get("src").search("opa1.gif") >= 0 || image.get("src").search("opa2.png") >= 0);
      });
    },

    test_callback_function_builds_ul_and_li_for_a_single_size: function () {
      var flickr_api = new FlickrAPI(Y);
      var mocked_results = {
        "query": {
          "results": {
            "size": 
              {"source": "opa2.png"}
          } 
        }
      };

      flickr_api._yql_flickr_callback(mocked_results);

      var lis = Y.one("#main > ul > li");

      var image = lis.get("firstChild");
      Y.assert(image.get("src").search("opa2.png") >= 0);
    },

    test_callback_function_handles_empty_result: function () {
      var flickr_api = new FlickrAPI(Y);
      var mocked_results = {
        "query": {
          "results": null 
        }
      };

      flickr_api._yql_flickr_callback(mocked_results);

      var lis = Y.all("#main > ul > li");
      Y.Assert.areEqual(0, lis.size());
    },
    
    test_main_div_add_css_classname_on_done: function () {
      var flickr_api = new FlickrAPI(Y);
      var mocked_results = {
        "query": {
          "results": null 
        }
      };
      flickr_api._yql_flickr_callback(mocked_results);

      Y.assert(Y.one("#main").hasClass('complete'));
    },

    test_main_div_removes_css_classname_on_start: function () {
      var flickr_api = new FlickrAPI(Y);
      var mocked_results = {
        "query": {
          "results": null 
        }
      };
      flickr_api._yql_flickr_callback(mocked_results);

      Y.assert(Y.one("#main").hasClass('complete'));

      var place = "San Francisco";

      var yql_query_mock = Y.Mock();
      Y.Mock.expect(yql_query_mock, {
        method: "send",
        args: []
      });

      var yMock = Y.Mock();
      Y.Mock.expect(yMock, {
        method: "YQL",
        args: ["select source from flickr.photos.sizes where photo_id in (select id from flickr.photos.search where has_geo=\"true\" and text=\"San Francisco\") and height > 300 and width < 500 limit 10", Y.Mock.Value.Function],
        returns: yql_query_mock
      });

      var main_div = Y.one("#main");
      Y.Mock.expect(yMock, {
        method: "one",
        args: ["#main"],
        returns: main_div
      });

      var flickr_api = new FlickrAPI(yMock);
      flickr_api.get_flickr_photos(place);

      Y.Mock.verify(yMock);
      Y.Mock.verify(yql_query_mock);

      Y.assert( ! Y.one("#main").hasClass('complete'));
    }

  });

  var yconsole = new Y.Console({
    newestOnTop: false
  });
  yconsole.render("#tests_console");

  Y.one("div.yui3-widget").setStyle("height", "100%");
  Y.one("div.yui3-console-bd").setStyle("height", "100%");
  Y.one("div.yui3-widget").setStyle("width", "95%");

  Y.Test.Runner.add(yql_flickr_tests);
  Y.Test.Runner.add(dom_presentation_tests);
  Y.Test.Runner.run();

});
