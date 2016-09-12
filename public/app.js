// grab the articles as a json
$(document).on('ready', function (){

var NewsApp = {
  // Attributes
  articles: [],
  currArticle: 0,

  // Methods
  start: function() {
    // grab the articles as a json
    // display the first article
    var self = this;

  $.getJSON('/articles', function(data) {

    self.articles = data;
    // for each one

    /*
    for (var i = 0; i<data.length; i++){
      // display the apropos information on the page
      $('#articles').append('<p data-id="' + data[i]._id + '">'+ data[i].title + '<br />'+ data[i].link + '</p>');
    */
      self.displayArticle();
    });
  },

  displayArticle: function() {
    // Display the current Article

// <p data-id="' + this.NewsApp[this.currentArticle]._id + '">  title and link
  
    var heading = "<p data-id='" + this.articles[this.currArticle]._id + "'> "+ this.articles[this.currArticle].title +"  </p>";

    console.log(heading);
    $('#article').html(heading);
    //debugger;
    Newsnotes(this.articles[this.currArticle]._id);
  },

  nextArticle: function() {
    // Display the next article.  If there are no
    // more articles, start at the beginning
    this.currArticle = this.currArticle == this.articles.length ?
      0 : this.currArticle + 1;

    this.displayArticle();
  }
}

  // whenever someone clicks a p tag
  //$(document).on('click', 'p', function(){
    var Newsnotes = function(data_id) {
     // debugger;
    // empty the notes from the note section
    $('#notes').empty();
    // save the id from the p tag
    //var thisId = $().attr('data-id');
//this
     var thisId = data_id;

    // now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId,
    })
      // with that done, add the note information to the page
      .done(function( data ) {
        console.log(data);
        // the title of the article
        $('#notes').append('<h2>' + data.title + '</h2>'); 
        // an input to enter a new title
        $('#notes').append('<input id="titleinput" name="title" >'); 
        // a textarea to add a new note body
        $('#notes').append('<textarea id="bodyinput" name="body"></textarea>'); 
        // a button to submit a new note, with the id of the article saved to it
        $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');
        

          //debugger;
        // if there's a note in the article
        if(data.note){
          // place the title of the note in the title input
          $('#titleinput').val(data.note.title);
          // place the body of the note in the body textarea
          $('#bodyinput').val(data.note.body);

          //for delete
            $('#notes').append('<button data-id="' + data._id + '" id="deleteNote">Delete Note</button>');
        }
      });
    };
  //});

  // when you click the savenote button
  $(document).on('click', '#savenote', function(){
    // grab the id associated with the article from the submit button
    var thisId = $(this).attr('data-id');

    // run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $('#titleinput').val(), // value taken from title input
        body: $('#bodyinput').val() // value taken from note textarea
      }
    })
      // with that done
      .done(function( data ) {
        // log the response
        console.log(data);
        // empty the notes section
        $('#notes').empty();
      });

    // Also, remove the values entered in the input and textarea for note entry
    $('#titleinput').val("");
    $('#bodyinput').val("");
  });


// when user clicks the deleter button for a note
$(document).on('click', '#deleteNote', function(){
  // save the p tag that encloses the button
   //var selected = $(this).parent();
   var selected = $(this).attr('data-id');
   //var thisId = $(this).attr('data-id');

   console.log(selected);
  // make an AJAX GET request to delete the specific note 
  // this uses the data-id of the p-tag, which is linked to the specific note
  $.ajax({
    type: "POST",
    url: '/delete/' + selected
  })

  // Code to run if the request succeeds (is done);
  // The response is passed to the function
    .done(function( data ) {
       selected.remove();
      
      // make sure the #actionbutton is submit (in case it's update)
      //$('#actionbutton').html('<button id="makenew">Delete</button>');
    })//,
    .fail(function( xhr, status, errorThrown ) {
      alert( "Sorry, there was a problem!" );
      console.log( "Error: " + errorThrown );
      console.log( "Status: " + status );
      console.dir( xhr );
    })
    // Also, remove the values entered in the input and textarea for note entry
     $('#titleinput').val("");
     $('#bodyinput').val("");
  });
//});

// when you click the savenote button
$(document).on('click', '#startnews', function(){

  NewsApp.start();
});


$(document).on('click', '#article', function(){
 // alert('uuu');
//debugger;
  
  NewsApp.nextArticle();
});

});