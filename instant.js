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
		return str;
	}

	/** Plugin Definition  **/
	$.instant = function(el, userSettings){
		var $in = this;

		/** HTML elements **/
		$in.$el = $(el);
		$in.$wrapper = false;
		$in.$list = false;
		$in.$hiddenInput = false;

		/** Plugin Configuration  **/
		$in.set = $.extend({
				"accentsInsensitive":		true, // Accent insensitive string comparison
				"autocomplete":					false, // Allow browser autocompletion for searchInput
				"callback":							false, // Callback function when an option is selected
				"caseInsensitive":			true, // Case insensitive string comparison
				"formName":							"instant", // Set name attribute for searchInput
				"listOptions":					{}, // List of possible options where to search
				"placeholder":					"", // Text to show in searchInput
				"required":							false // Set HTML5 required attribute for searchInput
			}, userSettings);

		/** DOM manipulation methods **/
		$in.createDOM = function(){
			$in.$wrapper = $("<span>").addClass("instant_wrapper");
			$in.$list = $("<ul>").addClass("instant_list")
			$in.$hiddenInput = $("<input>").attr({
				"type": "hidden",
				"name": $in.set.formName
			});

			var elAttr = { "placeholder": $in.set.placeholder };
			if($in.set.autocomplete === false) elAttr.autocomplete = "off";
			if($in.set.required === true) elAttr.required = "off";
			$in.$el.attr(elAttr);

			$in.$el.wrap($in.$wrapper);
			$in.$el.after($in.$list, $in.$hiddenInput)
		}

		$in.generateList = function(){
			for(var o in $in.set.listOptions){
				var $option = $("<li>");
				$option.attr("value", o).text($in.set.listOptions[o]);
				$in.$list.append($option);
			}
		}

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

		/** Init Plugin  */
		$in.init = function(){
			$in.createDOM();
			$in.generateList();
		}
		$in.init();
	}

	/** Plugin Events **/
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
			}).on("setValue", function(){
				$in.$list.hide();
//@@@
				if(typeof $in.set.callback === "function") $in.set.callback();
			});

			/** $in.$list Events **/
			$in.$list.on("select", "li", function(){
				$in.$el.val($(this).text()).trigger("setValue");
			}).on("mousedown", "li", function(e){
				$(this).trigger("select");
			}).on("mouseover", "li", function(){
				$(this).addClass("focus").siblings().removeClass("focus");
			});
		});

	}
}(jQuery));
