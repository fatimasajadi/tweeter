/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  $(".error").hide();

  const createTweetElement = function(tweet) {
    const $tweet = $(`
    <div class="tweet">
      <header class="tweet-header">
          <img src="${tweet.user.avatars}">
          <p>${tweet.user.handle}</p>
      </header>
      <article>
            <p>${tweet.content.text.replace('<', '&lt;').replace('>', '&gt;')}</p>
      </article>
      <footer>
          <p>${tweet.created_at}</p>
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

  $(".tweet-form").on('submit', function(event) {
    event.preventDefault();

    let text = $(".tweet-textarea").val();
    if (text.length <= 140 && text.length !== 0) {
      $.post('/tweets', { text: text })
        .then(function(data) {});
      loadTweets();

    } else {
      // alert("Your tweet is too long to be published!")
      $(".error").append("Too long. Plz respect our arbitrary limit of 140 chars.");
      $(".error").show();
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