/*
* Inspector
* License - https://github.com/adaptlearning/adapt_framework/blob/master/LICENSE
* Maintainers - Tom Greenfield
*/

define(function(require) {

	var Adapt = require("coreJS/adapt");
	var InspectorView = Backbone.View.extend({

		ids: [],

		initialize: function() {
			var id = this.model.get("_id");

			this.listenTo(Adapt, "remove", this.remove);
			this.listenTo(Adapt, "device:resize", this.onHover);
			this.ids.push(id);
			this.addTracUrl(id);
			this.$el.attr("data-id", id).data(this.model);
		},

		events: function() {
			return !Adapt.device.touch ?
				{ "mouseenter": "onHover", "mouseleave": "onHover" } :
				{ "touchend": "onTouch" };
		},

		addTracUrl: function(id) {
			var tracUrl = Adapt.config.get("_inspector")._tracUrl;

			if (!tracUrl) return;

			var title = $("<div/>").html(this.model.get("displayTitle")).text();
			var params = id;
			var location = Adapt.location._currentId;
			var locationType = Adapt.location._contentType;
			
			if (title) params += " " + title;
			if (id !== location) params += " (" + locationType + " " + location + ")";

			this.model.set("_tracUrl", tracUrl + "/newticket?summary=" +
				encodeURIComponent(params));
		},

		onHover: function() {
			_.defer(_.bind(this.setVisibility, this));
		},

		onTouch: function(event) {
			event.stopPropagation();

			if ($(event.target).is("[class*=inspector-]")) return;

			_.defer(_.bind(function() { this.updateInspector(this.$el); }, this));
		},

		setVisibility: function() {
			var $inspectorHover = $(".inspector:hover");

			if ($inspectorHover.length > 0) {
				return $inspectorHover.one("mouseleave", _.bind(this.onHover, this));
			}

			for (var i = this.ids.length - 1; i >= 0; --i) {
				var $hovered = $("[data-id='" + this.ids[i] + "']:hover");

				if ($hovered.length > 0) return this.updateInspector($hovered);
			}

			$(".inspector-visible").removeClass("inspector-visible");
			$(".inspector").hide();
		},

		updateInspector: function($hovered) {
			if ($hovered.hasClass("inspector-visible")) return;

			var template = Handlebars.templates.inspector;
			var data = $hovered.data().toJSON();

			this.$inspector = $(template(data)).replaceAll($(".inspector"));
			this.positionInspector($hovered);
		},

		positionInspector: function($hovered) {
			var offset = $hovered.offset();
			var inspectorHeight = this.getComputed("height");
			var $arrow = $(".inspector-arrow");
			var arrowHeight = $arrow.outerHeight() / 2;
			var inspectorWidth = this.getComputed("width");

			$(".inspector-visible").removeClass("inspector-visible");
			$hovered.addClass("inspector-visible");

			this.$inspector.css({
				"top": offset.top - inspectorHeight - arrowHeight,
				"left": offset.left + $hovered.width() / 2 - inspectorWidth / 2,
				"width": inspectorWidth,
				"height": inspectorHeight + arrowHeight
			});
			$arrow.css("top", inspectorHeight);
		},

		getComputed: function(property) {
			return typeof getComputedStyle !== "undefined" ?
				parseFloat(getComputedStyle(this.$inspector[0])[property]) :
				this.$inspector[property]();
		}

	});

	Adapt.on("app:dataReady", function() {
		var config = Adapt.config.get("_inspector");

		if (!config || !config._isEnabled) return;

		var views = config._elementsToInspect ||
			[ "menu", "page", "article", "block", "component" ];

		Adapt
			.on(views.join("View:postRender ") + "View:postRender", function(view) {
				new InspectorView({ el: view.$el, model: view.model });
			})
			.on("menuView:ready pageView:ready", function(view) {
				$("<div/>").addClass("inspector").appendTo(view.$el);
			});
	});

});