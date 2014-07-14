/*
* Inspector
* License - https://github.com/adaptlearning/adapt_framework/blob/master/LICENSE
* Maintainers - Tom Greenfield
*/

define(function(require) {

	var Adapt = require("coreJS/adapt");
	var Backbone = require("backbone");

	var InspectorView = Backbone.View.extend({

		initialize: function() {
			this.listenTo(Adapt, "remove", this.remove);
			this.render();
		},

		events: {
			"click .inspector-inner": "onClick",
			"mouseenter": "onEnter",
			"mouseleave": "onLeave",
		},

		render: function() {
			var data = this.model.toJSON();
			var template = Handlebars.templates["inspector"];
			
			this.$el.append(template(data));
			return this;
		},

		onClick: function(event) {
			var tracUrl = Adapt.config.get("_inspector")._tracUrl;
			var clickedId = this.model.get("_id");
			var clickedTitle = this.model.get("displayTitle");
			var clickedLocation = Adapt.location._currentId;
			var params = clickedId;

			event.preventDefault();
			event.stopPropagation();

			if (!tracUrl) return console.log("No _tracUrl defined in config.json.");
			if (clickedTitle) params += " " + clickedTitle;
			if (clickedId != clickedLocation) params += " (" + Adapt.location._contentType + " " + clickedLocation + ")";

			window.open(tracUrl + "/newticket?summary=" + encodeURIComponent(params));
		},

		onEnter: function() {
			this.$el.addClass("inspector-active");
			this.setVisibility();
		},

		onLeave: function() {
			this.$el.removeClass("inspector-active");
			this.setVisibility();
		},

		setVisibility: function() {
			var hoveredElement;

			$(".inspector-container").removeClass("inspector-visible");
			$(".inspector").on("transitionend", function() { $(this).hide(); });

			if ($(".component.inspector-active:hover").length !== 0) {
				hoveredElement = ".component.inspector-active";
			} else if ($(".block.inspector-active:hover").length !== 0) {
				hoveredElement = ".block.inspector-active";
			} else if ($(".article.inspector-active:hover").length !== 0) {
				hoveredElement = ".article.inspector-active";
			} else if ($(".page.inspector-active:hover").length !== 0) {
				hoveredElement = ".page.inspector-active";
			} else if ($(".menu-item.inspector-active:hover").length !== 0) {
				hoveredElement = ".menu-item.inspector-active";
			} else if ($(".menu.inspector-active:hover").length !== 0) {
				hoveredElement = ".menu.inspector-active";
			}
			else return;

			$(hoveredElement + " > .inspector").off().show(0, function() {
				$(hoveredElement).addClass("inspector-visible");
			});
		}

	});

	function addInspector(view) {
		new InspectorView({el: view.$el, model: view.model});
	}

	Adapt.on("app:dataReady", function() {
		if (!Adapt.device.touch && Adapt.config.get("_inspector") && Adapt.config.get("_inspector")._isEnabled) {
			Adapt.on("menuView:postRender pageView:postRender articleView:postRender blockView:postRender componentView:postRender", function(view) {
				addInspector(view);
				view.$el.addClass("inspector-container");
				if (!Adapt.config.get("_inspector")._tracUrl) $(".inspector-inner").css("cursor", "default");
			});
		}
	});

});