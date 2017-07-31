$( document ).ready(function() {

  var shuffle_list = [
    ["images/runes/algiz.svg", "algiz"],
    ["images/runes/fehu.svg", "fehu"],
    ["images/runes/kauna.svg", "kauna"],
    ["images/runes/mannaz.svg", "mannaz"],
    ["images/runes/othalan.svg", "othalan"],
    ["images/runes/raido.svg", "raido"],
    ["images/runes/thurisaz.svg", "thurisaz"],
    ["images/runes/uruz.svg", "uruz"],
    ["images/runes/algiz.svg", "algiz"],
    ["images/runes/fehu.svg", "fehu"],
    ["images/runes/kauna.svg", "kauna"],
    ["images/runes/mannaz.svg", "mannaz"],
    ["images/runes/othalan.svg", "othalan"],
    ["images/runes/raido.svg", "raido"],
    ["images/runes/thurisaz.svg", "thurisaz"],
    ["images/runes/uruz.svg", "uruz"]
  ];
  var move_count = 0;
  var match_count = 0;
  var timer_seconds = 0;
  var timer_minutes = 0;
  var display_timer = setInterval(timer, 1000);

  function randomize_cards (a,b) {
    // outputs a random number that will be used to shuffle the shuffle_list array
    return 0.5 - Math.random()
  }

  function draw_cards (index, card) {
    /*
    Behavior: adds classes, data names, and images to the back of each card to be
    used for matching the cards
    Input: takes an index and .card class as input
    Output: assigns a class, data name, and appends an image from shuffle_list
    array to the .back class of each .card class
    */
    $(card).find(".back").append("<img class='card-image' src='" + shuffle_list[0][0] + "' alt='rune'>");
    $(card).addClass(shuffle_list[0][1]);
    $(card).data("name", shuffle_list[0][1]);
    shuffle_list.shift();
  }

  function first_click() {
    /*
    Behavior: runs after click event on .card class, finds the card matching the
    one clicked, adds classes to track the matches, and then switches the function
    to be called on the .card click event to second_click
    Input: takes no input, runs after click event on .card class
    Output: assigns matching classes and switches, then switches function for
    .card click event handler
    */
    var first_match = $(this);
    var name_match = first_match.data("name");
    var find_match = $(".container").find("." + name_match);
    var second_match = $(find_match);
    $(first_match).addClass("flipped");
    $(first_match).addClass("match");
    $(first_match).addClass("first-match");
    $(second_match).addClass("second-match");
    $(".card").off("click", first_click);
    $(".card").on("click", second_click);
  }

  function second_click() {
    /*
    Behavior: checks if the second card click matches the first card while
    preventing the first card from matching itself, runs a function based on the
    match, and runs another function that prevents further click events for a
    period of time
    Input: takes no input, runs after .click event on .card class
    Output: runs the match function if the second card clicked matches the first,
    runs the no_match function if not, and runs the click_timeout function
    */
    var second_match = $(this)
    $(".card").off("click", second_click);
    if (second_match.hasClass("first-match")) {
      $(".card").on("click", second_click);
      return;
    };
    second_match.addClass("flipped");
    second_match.addClass("match");
    if (second_match.hasClass("second-match") === false) {
      no_match();
    } else {
      match();
    };
    click_timeout();
  }

  function click_timeout() {
    // waits a set amount of time before reactivating the .card click event handler
    var click_timer = 1500;
    setTimeout(function() {
    $(".card").on("click", first_click);
      }, click_timer);
  }

  function reset_matches () {
    // helper function that removes the classes used to match the previous pair of cards clicked
    $(".card").each(function(index, card) {
      $(card).removeClass("first-match");
      $(card).removeClass("second-match");
    });
  }

  function no_match() {
    /*
    Behavior: increases the move count and displays it, runs the stars function,
    runs the shake_no_match function to play an animation, and runs the reset_matches
    function to remove the classes used to track card matches
    Input: takes no input
    Output: runs the stars, shake_no_match, and reset_matches functions
    */
    move_count += 1;
    $(".moves").text(move_count);
    stars();
    shake_no_match();
    reset_matches();
  }

  function shake_no_match () {
    /*
    Behavior: runs animations to show that the cards did not match
    Input: takes no input
    Output: runs animations
    */
    var flip_timer = 1500;
    var shake_timer = 800;
    $(".match").each(function(index, card) {
      setTimeout(function() {
        $(card).toggleClass("flipped");
      }, flip_timer);
      setTimeout(function() {
        $(card).effect("shake");
      }, shake_timer);
      $(card).removeClass("match");
    });
  }

  function match() {
    /*
    Behavior: increases and displays the move count,  runs the stars function, runs
    bounce_match function to play an animation, runs the reset_matches
    function to remove the classes used to track card matches, and increases the
    match_count variable used it to determine if all the cards have been matched,
    if so runs the win_game function
    Input: takes no input
    Output: runs the stars, bounce_match, reset_matches, and runs the win_game function
    if all cards have been matched
    */
    move_count += 1;
    match_count += 1;
    all_cards_matched = 8
    $(".moves").text(move_count);
    stars();
    bounce_match();
    reset_matches();
    if (match_count === all_cards_matched) {
      win_game();
    }
  }

  function bounce_match () {
    /*
    Behavior: runs animations to show that the cards matched
    Input: takes no input
    Output: runs animations
    */
    var bounce_timer = 750;
    $(".card").each(function(index, card) {
      if ($(card).hasClass("first-match")) {
        $(card).removeClass("second-match");
        $(card).removeClass("match");
        setTimeout(function(){
          $(card).effect("bounce");
        }, bounce_timer);
      };
      if ($(card).hasClass("second-match")) {
        setTimeout(function(){
          $(card).effect("bounce");
          $(card).removeClass("match");
        }, bounce_timer);
      };
    });
  }

  function win_game() {
    /*
    Behavior: stops the timer and displays a modal that shows the player's timer and star score, with
    an option to play again
    Input: takes no input
    Output: displays a modal
    */
    var timer_score = $(".timer").text();
    var star_score = $(".stars").text();
    clearInterval(display_timer);
    $("#myModal").modal();
    $(".score").text("Time: " + timer_score + "  Stars: " + star_score);
  }

  function stars() {
    /*
    Behavior: uses the move_count variable to determine a star score and displays that score
    Input: takes no input
    Output: displays a star score
    */
    var two_star_count = 10;
    var one_star_count = 14;
    var two_stars = "★★☆";
    var one_star = "★☆☆"
    if (move_count >= two_star_count) {
      $(".stars").text(two_stars);
    };
    if (move_count >= one_star_count) {
      $(".stars").text(one_star);
    };
  }

  function timer() {
    /*
    Behavior: displays a timer with minutes and seconds on the page
    Input: takes no input
    Output: displays a timer
    */
    var ten_seconds = 10;
    var one_minute = 60;
    timer_seconds += 1;
    if (timer_seconds >= 60) {
      timer_minutes += 1;
      timer_seconds = 0;
    };
    if (timer_seconds < ten_seconds) {
      $(".timer").text(String(timer_minutes) + ":0" + String(timer_seconds));
    };
    if (timer_seconds >= ten_seconds && timer_seconds < one_minute) {
      $(".timer").text(String(timer_minutes) + ":" + String(timer_seconds));
    };
  }

  shuffle_list.sort(randomize_cards);

  $(".card").each(draw_cards);

  $(".card").on("click", first_click);

  $(".reload").on("click", function() {
    location.reload();
  });

});
