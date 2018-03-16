define([ "core/js/adapt" ], function(Adapt) {

	var InspectorView = Backbone.View.extend({

		className: "inspector",

		ids: [],

		initialize: function() {
			this.listenTo(Adapt, {
				"inspector:id": this.pushId,
				"inspector:hover": this.setVisibility,
				"inspector:touch": this.updateInspector,
				"device:resize": this.onResize,
				"remove": this.remove
			}).render();
		},

		events: {
			"mouseleave": "onLeave"
		},

		render: function() {
			$("#wrapper").append(this.$el);
		},

		pushId: function(id) {
			this.ids.push(id);
		},

		setVisibility: function() {
			if ($(".inspector:hover").length) return;

			for (var i = this.ids.length - 1; i >= 0; --i) {
				var $hovered = $("[data-id='" + this.ids[i] + "']:hover");

				if ($hovered.length) return this.updateInspector($hovered);
			}

			$(".inspector-visible").removeClass("inspector-visible");
			this.$el.hide();
		},

		updateInspector: function($hovered) {
			if ($hovered.hasClass("inspector-visible")) return;

			var data = [];

			$(".inspector-visible").removeClass("inspector-visible");

			this.addOverlappedElements($hovered).each(function() {
				var $element = $(this);
				var attributes = $element.data().attributes;

				if (!attributes) return;

				data.push(attributes);
				$element.addClass("inspector-visible");
			});

			this.$el.html(Handlebars.templates.inspector(data)).removeAttr("style");
			this.positionInspector($hovered);
		},

		addOverlappedElements: function($hovered) {
			var checkOverlap = function() {
				var $element = $(this);

				var isOverlapped = $element.height() &&
					_.isEqual($element.offset(), $hovered.offset()) &&
					$element.width() === $hovered.width();

				if (isOverlapped) $hovered = $hovered.add($element);
			};

			for (var i = this.ids.length - 1; i >= 0; --i) {
				$("[data-id='" + this.ids[i] + "']").each(checkOverlap);
			}

			return $hovered;
		},

		positionInspector: function($hovered) {
			var offset = $hovered.offset();
			var inspectorHeight = this.getComputed("height");
			var $arrow = this.$(".inspector-arrow");
			var arrowHeight = $arrow.outerHeight() / 2;
			var inspectorWidth = this.getComputed("width");

			this.$el.css({
				top: offset.top - inspectorHeight - arrowHeight,
				left: offset.left + $hovered.width() / 2 - inspectorWidth / 2,
				minWidth: inspectorWidth,
				minHeight: inspectorHeight + arrowHeight
			});

			$arrow.css("top", Math.floor(inspectorHeight));
		},

		getComputed: function(property) {
			return typeof getComputedStyle !== "undefined" ?
				parseFloat(getComputedStyle(this.$el[0])[property], 10) :
				this.$el[property]();
		},

		onResize: function() {
			var $hovered = $(".inspector-visible");

			if (!$hovered.length) return;

			$hovered.removeClass("inspector-visible");
			this.updateInspector($hovered.last());
		},

		onLeave: function() {
			_.defer(_.bind(this.setVisibility, this));
		}

	});

	var InspectorContainerView = Backbone.View.extend({

		initialize: function() {
			var id = this.model.get("_id");

			this.listenTo(Adapt, "remove", this.remove).addTracUrl(id);
			this.$el.attr("data-id", id).data(this.model);
			Adapt.trigger("inspector:id", id);
		},

		events: function() {
			var hash = { "mouseenter": "onHover", "mouseleave": "onHover" };

			if (Adapt.device.touch) hash.touchend = "onTouch";

			return hash;
		},

		addTracUrl: function(id) {
			var config = Adapt.config.get("_inspector");
			var tracUrl = config._tracUrl;

			if (!tracUrl) return;

			var title = $("<div/>").html(this.model.get("displayTitle")).text();
			var params = id;
			var adaptLocation = Adapt.location;
			var location = adaptLocation._currentId;
			var locationType = adaptLocation._contentType;

			if (title) params += " " + title;
			if (id !== location) params += " (" + locationType + " " + location + ")";

			tracUrl += "/newticket?summary=" + encodeURIComponent(params);
			if (config.tracSummaryPrompt) {
				tracUrl += ": " + encodeURIComponent(config.tracSummaryPrompt);
			}
			this.model.set("_tracUrl", tracUrl);
		},

		onHover: function() {
			_.defer(function() { Adapt.trigger("inspector:hover"); });
		},

		onTouch: function(event) {
			if (event.originalEvent.stopInspectorPropagation) return;

			event.originalEvent.stopInspectorPropagation = true;

			if (!$(event.target).is("[class*=inspector-]")) {
				Adapt.trigger("inspector:touch", this.$el);
			}
		}

	});

	Adapt.once("app:dataReady", function() {
		var config = Adapt.config.get("_inspector");

		if (!config || !config._isEnabled) return;
		if (Adapt.device.touch && config._disableOnTouch) return;

		var views = config._elementsToInspect ||
			[ "menu", "page", "article", "block", "component" ];

		Adapt.on("router:location", function() {
			new InspectorView();
		}).on(views.join("View:postRender ") + "View:postRender", function(view) {
			new InspectorContainerView({ el: view.$el, model: view.model });
		});
	});

});
