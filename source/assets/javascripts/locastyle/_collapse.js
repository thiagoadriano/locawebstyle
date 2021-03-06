// @todo: prevent-open
// @todo: hash init
// @todo: hash change
// @todo: toggle hover ?

var locastyle = locastyle || {};
locastyle.collapse = (function() {
  'use strict';

  var config = {
    selectors: {
      container: '[data-ls-module="collapse"]', // .ls-collapse
      trigger: '.ls-collapse-header',
      content: '.ls-collapse-body',
      groupContainer: '.ls-collapse-group'
    },
    classes: {
      open: 'ls-collapse-open',
      alwaysOpen: 'ls-collapse-open-always'
    }
  };

  function init() {
    $(config.selectors.container).each(function() {
      var $collapse = $(this);
      bindHeader($collapse);
      ariaCollapse($collapse);
    });
    bindButton();
  }

  function bindButton() {
    // unbind
    $('[data-toggle-collapse]').off('click.ls'); // <- unbind
    $('[data-toggle-collapse]').on('click.ls', function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      var id = $(this).data('toggle-collapse');
      toggle($(id));
    });
  }

  function bindHeader($collapse) {
    if (!$collapse.hasClass(config.classes.alwaysOpen)) {
      // has input
      var $input = $(config.selectors.trigger, $collapse).find('input[type="radio"], input[type="checkbox"]');
      if($input[0]){
        $input.on('change.ls', function () {
          var name = $(this).attr('name');
          $('[name="' + name + '"]').each(function (index, input) {
            var $input = $(input);
            var $collapse = $input.parents(config.selectors.container);
            $collapse.toggleClass(config.classes.open, $input.is(':checked'));
          });
        }).trigger('change.ls');
      } else {
        $(config.selectors.trigger, $collapse).off('click.ls'); // <- unbind
        $(config.selectors.trigger, $collapse).on('click.ls', function(evt) {
          evt.preventDefault();
          toggle($collapse);
        });
      }
    }
  }

  function toggle($collapse) {
    $collapse = $collapse instanceof $ ? $collapse : $($collapse);
    var $group = $collapse.parents(config.selectors.groupContainer);
    if ($group[0]) {
      $group.find(config.selectors.container).not($collapse).removeClass(config.classes.open).find(config.selectors.content).slideUp();
    }
    $collapse.toggleClass(config.classes.open);
    // $collapse.find(config.selectors.content).slideToggle(300, 'linear', function(){
    //   $collapse.toggleClass(config.classes.open);
    // });
    ariaCollapse($collapse);
    return $collapse;
  }

  function ariaCollapse(elem) {
    if($(elem).hasClass('ls-collapse-open')){
      $(config.selectors.trigger).attr({ 'aria-expanded' : true });
      $(config.selectors.content).attr({ 'aria-hidden' : false });
    }
    else{
      $(config.selectors.trigger).attr({ 'aria-expanded' : false });
      $(config.selectors.content).attr({ 'aria-hidden' : true });
    }
  }

  return {
    init: init,
    toggle: toggle
  };

}());
