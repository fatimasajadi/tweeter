/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function() {
  $(".error").hide();
  $(".new-tweet").hide();
  $(".floatScroll ").hide();

  const renderTime = function(tweet) {
      return moment(tweet.created_at).fromNow();
    }
    //A function to create html template for new tweets
  const createTweetElement = function(tweet, time) {
    time = renderTime(tweet);
    const $tweet = $(`
    <div class="tweet">
      <header class="tweet-header">
          <img src="${tweet.user.avatars}">
          <p>${tweet.user.handle}</p>
      </header>
      <article>
            <p>${tweet.content.text.replace('<', '&lt;').replace('>', '&gt;')}</p>
            <hr>
      </article>
      <footer>
          <p class="time">${time}</p>
          <span>
            <img src="/images/flag24.png">
            <img src="/images/retweet30px.png">
            <img src="/images/heart.png">
          </span>
      </footer>
    </div>
  `);
    return $tweet;
  }

  //An event to automatically scroll to the bottom of the page when the red arrow (top right corner) clicked.
  $(".arrow").click(function() {
    $(document).scrollTop($(document).height());
  });

  //An event to automatically scroll to the top of the page when the red circle (bottom right corner) clicked.
  $(".floatScroll").click(function() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  });

  //The red circle (bottom right corner) only appears when user scroll more than 300px.
  //The red circle disappear if user scrolls all the way up to the very top of the page.
  $(document).bind("scroll", function() {
    if ($(document).scrollTop() >= 300) {
      $(".floatScroll ").show();
    } else if ($(document).scrollTop() === 0) {
      $(".floatScroll ").hide();
    }
  });

  //A function to loop through the array of tweets and then prepend the info to the html template.
  const renderTweets = function(tweets) {
    for (let tweet of tweets) {
      $('.tweet-container').prepend(createTweetElement(tweet));
    }
  };

  //Toggle the new tweet section by clicking on the compose button on top right corner of the page
  $(".description").click(function() {
    $(".new-tweet").slideToggle();
    $(".tweet-textarea").focus();
  });

  //when the tweet button clicked (actually the form is submitted),
  //first of all, prevent the default behaviour of the form
  //Then extract the text that user enter in the text area
  //After extracting the info from user input, find the closest form element parent of the text input
  //and find it's sibling (the counter element) and finally implement the counter functionality.
  $(".tweet-form").on('submit', function(event) {
    event.preventDefault();
    let text = $(".tweet-textarea").val();

    let parentText = $(event.target).closest('form');
    let counterUpdate = parentText.find('.counter');
    if ($(".counter").val() < 140) {
      console.log($(".counter").val());
      counterUpdate.html(140);
    }

    if (text.length <= 140 && text.length !== 0 && $(".error")) {
      console.log("khar injas")
      $.post('/tweets', { text: text })
        .then(function(data) {});
      $(".error").hide();
      $('.tweet-button').prop('disabled', true);
      loadTweets();
      $(".tweet-textarea").val('');

    } else if (text.length > 140) {
      $(".error").append("Too long. Plz respect our arbitrary limit of 140 chars.");
      $(".error").show();
    } else if (text.length === 0) {
      $(".error").append("Your tweet can not be empty!");
      $(".error").show();
    } else if (text.length <= 140 && text.length !== 0) {
      $.post('/tweets', { text: text })
        .then(function(data) {});
      loadTweets();
      // $('.tweet-button').prop('disabled', false);
      $(".tweet-textarea").val('');
    }
  });

  //A function to get the data from server using ajax and 
  //also sends back the data that user enters back to the server
  //error handling also implemented
  function loadTweets() {
    url = "/tweets/";
    $.ajax({
        url,
        method: 'GET',
      })
      .done(function(response) {
        console.log(response);
        $('.tweet-container').html('');
        renderTweets(response);
        $('.tweet-button').prop('disabled', false);

      })
      .fail(function() {
        console.log('error');
      })
      .always(function() {
        console.log('complete');
      });
  };

  loadTweets();
});