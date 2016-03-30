(function(window, $){
  "use strict";

  var selectRootOnChildTargeting = function(post) {
    var root = $('#rlb-main');

    if ((post && post.length > 0) || $('*:target').closest('#rlb-main').length > 0) {
      root.addClass('selected-target')
    } else {
      root.removeClass('selected-target')
    }
  }

  var ScrollStatus = function(post) {
    this.post = post;
    this.rootContainer = this.post.parents('#rlb-main');
    this.hash = "#" + this.post.attr('id');
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

    var bubbleCount = Math.max(Math.round(this.height/this.browserHeight), 1);

    for (var j = 0; j < bubbleCount; j++) {
      var bubble = this.bubble();
      this.bubbles.push(bubble);
      this.display.append(bubble);
    }
  };

  ScrollStatus.prototype.refresh = function() {
    var browserHeight = $(window).height();
    var browserWidth = $(window).width();
    var postHeight = this.post.height();

    if (this.browserHeight !== browserHeight
        || this.browserWidth !== browserWidth
        || this.height !== postHeight)
    {
      this.browserHeight = browserHeight;
      this.browserWidth = browserWidth;
      this.height = this.post.height();

      this.repaint();
    }

    var postStart = this.post.offset().top;
    var postEnd = postStart + this.height;
    var viewPortOffset = 0 ; // = (this.browserHeight * 1/3);
    var scrollTop = $(window).scrollTop();
    var scrollTopWithOffset = scrollTop + viewPortOffset
    var viewPortCenter = scrollTopWithOffset - postStart;


    if (scrollTopWithOffset >= postStart && scrollTopWithOffset <= postEnd) {
      var scrollTarget = scrollTop < (postStart + viewPortOffset) ? postStart : postEnd - this.browserHeight ;

      this.post.parent().find('.post').removeClass('active');
      this.post.addClass('active');

      selectRootOnChildTargeting(this.post);

      window.history.replaceState("", "", this.hash);
    }

    var bubbleIndex = Math.min(Math.max(Math.floor((viewPortCenter) / this.browserHeight), 0), this.bubbles.length);
    if (!!this.bubbles[bubbleIndex]) {
      this.activateBubble(this.bubbles[bubbleIndex]);
    }

    setTimeout(this.refresh.bind(this), 1000);
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

  //
  // var heroHammer = new Hammer($('.hero-banner')[0]);
  // heroHammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL });
  //
  // heroHammer.on('panright', function(ev) {
  //   $('.rlb-content').addClass('selected-target');
  //   setTimeout(function() { $('.rlb-content').css('position', 'static'); }, 500);
  // });


  $('.post-footer .open').on('click', function(e) {
    e.preventDefault();
    $(e.target)
    .toggleClass('fa-info').toggleClass('fa-times')
    .closest('.post-footer').toggleClass('active');

    return false;
  });










  var clipboard = new Clipboard('.clipboard');
  clipboard.resolveOptions({target: function(trigger) {
    var elem = $(trigger).next('.copy-link-tooltip').find('.copy-link-text');
    return elem[0];
  }});

  var resetCopyTooltip = function(elem) {

  };

  var activateCopyTooltip = function(e, selfClose) {
    var elem = e.trigger;
    if (!elem.jquery) {
      elem = $(elem);
    }

    // deactivate default tooltip
    elem.removeClass('tooltip');

    var tooltip = elem.next('.copy-link-tooltip');
    var field = tooltip.find('.copy-link-text');
    var close = tooltip.find('.close-tooltip');
    var fakeSpan = $('<span />').text(field.val());

    tooltip.append(fakeSpan);
    fakeSpan.hide();
    field.css('width', fakeSpan.width());
    tooltip.addClass('active');

    if (selfClose) {
      setTimeout(function() {
        tooltip.addClass('finished');

        e.clearSelection();
        setTimeout(function() { tooltip.removeClass('finished').removeClass('active'); }, 1000);
      }, 500);
    }
  }

  clipboard.on('success', function(e) {
    activateCopyTooltip(e, true);
  });

  clipboard.on('error', function(e) {
    activateCopyTooltip(e.trigger);
  });

  $('.close-tooltip').on('click', function(e) {
    $(e.target).closest('.copy-link-tooltip').removeClass('active');
  });













  var landingPage = $('.posts');

  if (landingPage.length > 0) {

    selectRootOnChildTargeting();

    $(window).on('hashchange', function(e) {
      selectRootOnChildTargeting();
      return false;
    });

  }







  $('.nav-toggle, .nav-close').on('click', function(e) {
    e.preventDefault();
    $(e.target).closest('.nav').toggleClass('active');
  });

  $('.nav-item').on('click', function(e) {
    var target = $(e.target);
    var item = $(e.currentTarget);

    if (!target.is('a')) {
      var link = item.find('a');
      location.href = link.attr('href');
    }
  });

}(window, jQuery));
