spa.shell = (function() {
  // BEGIN MODULE SCOPE VARIABLES -------------------------------
	var
  	configMap = {
      anchor_scheme_map: {
        chat: {opened: true, closed: true}
      },
  		main_html: String()
  		    + '<div class="spa-shell-head">'
          	+	'<div class="spa-shell-head-logo"></div>'
          	+	'<div class="spa-shell-head-acct"></div>'
          	+	'<div class="spa-shell-head-search"></div>'
        	+ '</div>'
        	+ '<div class="spa-shell-main">'
          	+	'<div class="spa-shell-main-nav"></div>'
          	+	'<div class="spa-shell-main-content"></div>'
        	+ '</div>'
        	+ '<div class="spa-shell-foot"></div>'
        	+ '<div class="spa-shell-modal"></div>'
  	},
  	stateMap = {
      anchor_map: {},
    },
  	jqueryMap = {},
  	
    changeAnchorPart,
    copyAnchorMap,
    setChatAnchor,
    setJqueryMap,
    onHashChange,
    initModule;
  // END MODULE SCOPE VARIABLES ---------------------------------


  // Begin utility methods --------------------------------------
  copyAnchorMap = function() {
    return $.extend(true, {}, stateMap.anchor_map);
  };
  // End utility mehtods ----------------------------------------


  // BEGIN DOM METHOS ------------------------------------------
  /**
   * Changes part of the URI anchor component.
   * @param {Object} arg_map A map describing what part of the URI anchor we want changed.
   * @return {boolean} Whether the achor portion of the URI was updated.
   */
  changeAnchorPart = function(arg_map) {
    var
      anchor_map_revise = copyAnchorMap(),
      bool_return = true,
      key_name,
      key_name_dep;

    for (key_name in arg_map) {
      if (arg_map.hasOwnProperty(key_name)) {
        if (key_name.indexOf('_') === 0) {
          continue;
        }

        anchor_map_revise[key_name] = arg_map[key_name];

        key_name_dep = '_' + key_name;
        if (arg_map[key_name_dep]) {
          anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
        } else {
          delete anchor_map_revise[key_name_dep];
          delete anchor_map_revise['_s' + key_name_dep];
        }
      }
    }

    // Begin attempt to update URI; revert if not successful.
    try {
      $.uriAnchor.setAnchor(anchor_map_revise);
    } catch (error) {
      $.uriAnchor.setAnchor(stateMap.anchor_map, null, true);
      bool_return = false;
    }

    return bool_return;
  };


	setJqueryMap = function() {
		var $container = stateMap.$container;
		jqueryMap = {
      $container: $container,
      $chat: $container.find('.spa-shell-chat')
    };
	};
  // End DOM Methods ------------------------------------------


  // BEGIN EVENT HANDLERS -------------------------------------
  /**
   * Handles the hashchange event.
   * @param {Event} event
   * @return {boolean}
   */
  onHashChange = function(event) {
    var
      anchor_map_previous = copyAnchorMap(),
      anchor_map_proposed,
      is_ok = true,
      _s_chat_previous,
      _s_chat_proposed,
      s_chat_proposed;

    try {
      anchor_map_proposed = $.uriAnchor.makeAnchorMap();
    } catch (error) {
      $.uriAnchor.setAnchor(anchor_map_previous, null, true);
      return false;
    }

    stateMap.anchor_map = anchor_map_proposed;

    _s_chat_previous = anchor_map_previous._s_chat;
    _s_chat_proposed = anchor_map_proposed._s_chat;

    if (!anchor_map_previous
      || _s_chat_previous !== _s_chat_proposed) {
      s_chat_proposed = anchor_map_proposed.chat;

      switch (s_chat_proposed) {
        case 'open':
          toggleChat(true);
          break;
        case 'closed':
          toggleChat(false);
          break;
        default:
          toogleChat(false);
          delete anchor_map_proposed.chat;
          $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
      }
    }

    if (!is_ok) {
      if (anchor_map_previous) {
        $.uriAnchor.setAnchor(anchor_map_previous, null, true);
      } else {
        delete anchor_map_proposed.chat;
        $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
      }
    }

    return false;
  };
  // END EVENT HANDLERS ---------------------------------------


  // BEGIN PUBLIC methods -------------------------------------
	initModule = function ($container) {
		stateMap.$container = $container;
		$container.html(configMap.main_html);
		setJqueryMap();

    $.uriAnchor.configModule({
      schema_map: configMap.anchor_scheme_map
    });

    // Config and initialize feature modules
    spa.chat.configModule({
      set_chat_anchor: setChatAnchor,
      chat_model: spa.model.chat,
      people_model: spa.model.people
    });
    spa.chat.initModule(jqueryMap.$container);

    $.uriAnchor.configModule({
      schema_map: configMap.anchor_scheme_map
    });

    $(window)
      .bind('hashchange', onHashChange)
      .trigger('hashchange');
	};
  // End public methods ---------------------------------------


	return {initModule: initModule};
}());
