(function($){
	"use strict";

	var CHARACTER_REPLACEMENTS = {
		"a": "àáâãäå",
		"e": "èéêë",
		"i" : "ìíîï",
		"o": "òóôõö",
		"u": "ùúûü",
		"c": "ç",
		"n": "ñ",
		"A": "ÀÁÂÃÄÅ",
		"E": "ÈÉÊË",
		"I" : "ÌÍÎÏ",
		"O": "ÒÓÔÕÖ",
		"U": "ÙÚÛÜ",
		"C": "Ç",
		"N": "Ñ"
	};

	var removeAccents = function(str){
		var res = str;
		for(var c in CHARACTER_REPLACEMENTS){
			var regex = new RegExp("[" + CHARACTER_REPLACEMENTS[c] + "]", "g");
			res = res.replace(regex, c);
		}
		return res;
	}

	/**
	**	Plugin Definition
	**/
	$.instant = function(el, userSettings){
		var $in = this;

		/**
		**	Plugin HTML elements
		**/
		$in.$el = $(el);
		$in.$wrapper = false;
		$in.$list = false;
		$in.$hiddenInput = false;

		/**
		**	Plugin Configuration
		**/
		if($in.$el.attr("data-options")) $.extend(userSettings.listOptions, $in.$el.data("options"));
		$in.set = $.extend({
				"accentsInsensitive":		true,		// Accent insensitive string comparison
				"attributes":						false,	// List of attributes to set for $in.$el
				"callback":							false,	// Callback function when an option is selected
				"caseInsensitive":			true,		// Case insensitive string comparison
				"formName":							"hidden-" + $in.$el.data("name"), // Set name attribute for searchInput
				"listOptions":					{},			// List of possible options where to search
			}, userSettings);

		/**
		**	DOM manipulation methods
		**/
		/** Wrap and add necessary elements to the DOM **/
		$in.createDOM = function(){
			$in.$wrapper = $("<span>").addClass("instant_wrapper");
			$in.$list = $("<ul>").addClass("instant_list")
			$in.$hiddenInput = $("<input>").attr({
				"type": "hidden",
				"name": $in.set.formName
			});

			$in.$el.attr($in.set.attributes);

			$in.$el.wrap($in.$wrapper);
			$in.$el.after($in.$list, $in.$hiddenInput)
		}

		/** Fill option list **/
		$in.generateList = function(){
			$in.$list.empty();
			for(var o in $in.set.listOptions){
				var $option = $("<li>");
				$option.attr("value", o).text($in.set.listOptions[o]);
				$in.$list.append($option);
			}
		}

		/** Filter the option list **/
		$in.browseList = function(name){
			if($in.set.caseInsensitive) name = name.toLowerCase();
			if($in.set.accentsInsensitive) name = removeAccents(name);
			var $li = $in.$list.find("li");
			$li.each(function(){
				var $l = $(this);
				var lname = $l.text();
				if($in.set.caseInsensitive) lname = lname.toLowerCase();
				if($in.set.accentsInsensitive) lname = removeAccents(lname);

				if(lname.indexOf(name) !== -1) $l.addClass("visible").show();
				else $l.removeClass("visible").hide();
			});

			$li.removeClass("focus");
			$li.filter(".visible").first().addClass("focus");
		}

		/**
		**	Init Plugin
		**/
		$in.init = function(){
			$in.createDOM();
			$in.generateList();
		}
		$in.init();
	}

	/**
	**	Plugin Events
	**/
	$.fn.instant = function(options){
		return this.each(function(){
			var $in = new $.instant(this, options);

			/** $in.$el Events **/
			$in.$el.on("focusin", function(){
				$in.$list.show();
				var $li = $in.$list.find("li");
				if(!$li.is(".focus")) $li.filter(":visible:first").addClass("focus");
			}).on("focusout", function(){
				$in.$list.hide();
			}).on("keydown", function(e){
				var $focused = $in.$list.find(".focus");
				var keyActions = {
					"13": function(){ // Press enter
						$focused.trigger("select");
					},
					"38": function(){ // Up arrow
						var $first = $in.$list.find("li:visible:first");
						if(!$focused.is($first)) $focused.removeClass("focus").prevAll(":visible").first().addClass("focus");
					},
					"40": function(){ // Down arrow
						var $last = $in.$list.find("li:visible:last");
						if(!$focused.is($last)) $focused.removeClass("focus").nextAll(":visible").first().addClass("focus");
					}
				}

				if(keyActions[e.which] !== undefined){
					e.preventDefault();
					keyActions[e.which]();
					return false;
				}
			}).on("keyup", function(e){
				if(e.which == 13 || e.which == 38 || e.which == 40){ e.preventDefault(); return false; }
				$in.$hiddenInput.val("");

				var nameSearch = $in.$el.val();
				$in.browseList(nameSearch);

				var $li = $in.$list.find("li");
				var $first_visible = $li.filter(".visible").first();
				if($first_visible.length !== 0){
					$in.$list.show();
					$($first_visible).addClass("focus").siblings().removeClass("focus");
				}else{
					$in.$list.hide();
					$in.$list.find(".focus").removeClass("focus");
				}
			}).on("setValue", function(e, value){
				$in.$list.hide();
				$in.$hiddenInput.val(value);
				if(typeof $in.set.callback === "function") $in.set.callback(vale);
			});

			/** $in.$list Events **/
			$in.$list.on("select", "li", function(){
				$in.$el.val($(this).text()).trigger("setValue", $(this).val());
			}).on("mousedown", "li", function(e){
				$(this).trigger("select");
			}).on("mouseover", "li", function(){
				$(this).addClass("focus").siblings().removeClass("focus");
			});
		});

	}
}(jQuery));
