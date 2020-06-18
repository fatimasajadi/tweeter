/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function() {
  $(".error").hide();
  $(".new-tweet").hide();

  const renderTime = function(tweet) {
    return moment(tweet.created_at).fromNow();
  }

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

  const renderTweets = function(tweets) {
    for (let tweet of tweets) {
      $('.tweet-container').prepend(createTweetElement(tweet));
    }
  }
  $(".description").click(function() {
    $(".new-tweet").toggle();
  });

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
      $(".tweet-textarea").val('');

    }
  });

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