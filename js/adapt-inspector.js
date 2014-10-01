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
			"click .trac-url-disabled": "onClickDisabled",
			"mouseenter": "onEnter",
			"mouseleave": "onLeave",
		},

		render: function() {
			var template = Handlebars.templates["inspector"];
			var data = this.model.toJSON();
			
			this.$el.append(template(data));
			this.$el.addClass("inspector-container");
			this.$(".inspector").css("margin-left", "-" + this.$(".inspector").outerWidth() / 2 + "px");
			
			if (Adapt.config.get("_inspector")._tracUrl) this.addTracUrl();
			else this.$(".inspector").addClass("trac-url-disabled");

			return this;
		},

		addTracUrl: function() {
			var title = $("<div/>").html(this.model.get("displayTitle")).text();
			var id = this.model.get("_id");
			var location = Adapt.location._currentId;
			var locationType = Adapt.location._contentType;
			var tracUrl = Adapt.config.get("_inspector")._tracUrl;
			var params = id;
			
			if (title) params += " " + title;
			if (id != location) params += " (" + locationType + " " + location + ")";

			this.$(".inspector-inner").attr("href", tracUrl + "/newticket?summary=" + encodeURIComponent(params));
		},

		onClickDisabled: function() {
			console.log("Inspector: No _tracUrl defined in config.json.");
			return false;
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

	Adapt.on("app:dataReady", function() {
		if (!Adapt.device.touch && Adapt.config.get("_inspector") && Adapt.config.get("_inspector")._isEnabled) {
			Adapt.on("menuView:postRender pageView:postRender articleView:postRender blockView:postRender componentView:postRender", function(view) {
				new InspectorView({ el: view.$el, model: view.model });
			});
		}
	});

});