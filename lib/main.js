(function(window, $){
  "use strict";

  var ScrollStatus = function(post) {
    this.post = post;

    this.nav = this.post.find('.post-nav');
    this.display = this.nav.find('.scroll-status');

    if (this.display.length < 1) {
      console.log('ScrollStatus:', 'no post navigation given');
    }


    this.height = this.post.height();

    this.browserHeight = $(window).height();
    this.browserWidth = $(window).width();

    this.repaint();
  };

  ScrollStatus.prototype.bubble = function() {
    return $('<span class="scroll-status-bubble"></span>');
  };

  ScrollStatus.prototype.activateBubble = function(bubble) {
    for (var i = 0; i < this.bubbles.length; i++) {
      this.bubbles[i].removeClass('active');
    }

    bubble.addClass('active');

    return bubble;
  };

  ScrollStatus.prototype.repaint = function() {
    this.bubbles = this.bubbles || [];

    for (var i = 0; i < this.bubbles.length; i++) {
      this.bubbles[i].remove();
    }

    this.bubbles = [];

    var bubbleCount = Math.round(this.height/this.browserHeight);

    for (var j = 0; j < bubbleCount; j++) {
      var bubble = this.bubble();
      this.bubbles.push(bubble);
      this.display.append(bubble);
    }
  };

  ScrollStatus.prototype.refresh = function() {
    var browserHeight = $(window).height();
    var browserWidth = $(window).width();

    if (this.browserHeight !== browserHeight || this.browserWidth !== browserWidth) {
      this.browserHeight = browserHeight;
      this.browserWidth = browserWidth;
      this.height = this.post.height();

      this.repaint();
    }

    var viewPortCenter = $(window).scrollTop() - this.post.offset().top;

    if (-50 <= viewPortCenter && viewPortCenter < (this.height - (this.browserHeight))) {
      var bubbleIndex = Math.max(Math.floor((viewPortCenter+(this.browserHeight*1/4)) / this.browserHeight), 0) % this.bubbles.length;
      this.activateBubble(this.bubbles[bubbleIndex]);
      this.nav.removeClass('out-of-scope');
    } else {
      this.nav.addClass('out-of-scope');
    }

    setTimeout(this.refresh.bind(this), 500);
  };



  $.fn.scrollStatus = function() {
    this.each(function(_, post){
      var post = $(post);
      var status = new ScrollStatus(post);

      setTimeout(function(){
        status.refresh();
      }, 500);
    });
  };

  $('.post').scrollStatus();

  var selectRootOnChildTargeting = function() {
    var root = $('#rlb-main');
    var targetedPost = $('.post:target');

    if (targetedPost.length > 0) {
      root.addClass('selected-target')
    } else {
      root.removeClass('selected-target')
    }
  }

  $(window).on('hashchange', function() {
    selectRootOnChildTargeting();
  });
}(window, jQuery));
