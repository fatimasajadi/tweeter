$(document).ready(function() {

  $(".tweet-textarea").on("input", function(event) {
    let textInput = $(this).val();
    let textInputLen = textInput.length;

    let counter = 140 - textInputLen;
    let parentText = $(event.target).closest('form');
    let counterUpdate = parentText.find('.counter');
    if (counter >= 0) {
      counterUpdate.css({ 'color': 'unset' });
      counterUpdate.html(counter);
    } else {
      counterUpdate.html(counter);
      counterUpdate.css({ 'color': 'red' });
    }
  })
});