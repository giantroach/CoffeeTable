/*

# jquery.couch.longpoll.js #

A handler that can be used to listen to changes from a CouchDB database,
using long-polling.

This seemed to be a bit simpler than using continuous polling, which I
was unable to get working with jQuery.

Usage:

You need to have a listener to deal with the data:

$(document).bind('longpoll-data', function(evt, database, data) {
  // do something with data here, based on database. 
  // You can use this to listen to events from any longpoll 
  // (you need to have one per database you are interested in.)
});

$(document).bind('longpoll-data-<database>', function(evt, data){
  // do something with data here.
  // This one will be only for the database named <database>.
});


$.couch.longpoll('<database>');

If you have a sequence number, you can also pass that in as the
second argument to longpoll.


Note that a side-effect of how $.ajax() works is that it will
actually timeout, but this is actually okay. You will only get
an event when actual results are sent back.

The results object, which is all CouchDB's doing, gives you an
array, with one or more objects that look like:

    {
      id: "<couchdb-document-id>",
      seq: <sequence-number>,
      changes: [
        {
          rev: "<version>-<document-version-id>"
        }
      ]
    }

It's also possible that there will be multiple changes sent back.



*/

(function($) {
  function longpoll(database, last_seq) {
    var url = "/" + database + "/_changes?feed=longpoll";
    // If we don't have a sequence number, then see where we are up to.
    if (last_seq) {
      url = url + "&since=" + last_seq;
    }
    $.ajax({
      type: "GET",
      url: url,
      dataType: 'json',
      success: function(data) {
        // Now we need to see what to do with the data.
        if (data.results.length) {
          $(document).trigger('longpoll-data', [database, data.results]);
          $(document).trigger('longpoll-data-' + database, [data.results]);
        }
        // And set up the re-run of the fetch query.
        longpoll(database, data.last_seq);
      }
    })
  }
  
  $.couch.longpoll = longpoll;
}(jQuery));