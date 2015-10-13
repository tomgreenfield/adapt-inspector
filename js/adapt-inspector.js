define([ "coreJS/adapt" ], function(Adapt) {

	var InspectorView = Backbone.View.extend({

		tagName: "div",

		className: "inspector",

		ids: [],

		initialize: function() {
			this.listenTo(Adapt, "inspector:id", this.pushId);
			this.listenTo(Adapt, "inspector:hover", this.setVisibility);
			this.listenTo(Adapt, "inspector:touch", this.updateInspector);
			this.listenTo(Adapt, "device:resize", this.onResize);
			this.listenTo(Adapt, "remove", this.remove);
			this.render();
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

			var template = Handlebars.templates.inspector;
			var data = [];

			$(".inspector-visible").removeClass("inspector-visible");
			this.addOverlappedElements($hovered).each(function() {
				data.push($(this).data().toJSON());
			}).addClass("inspector-visible");
			this.$el.html(template(data)).removeAttr("style");
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
				width: inspectorWidth,
				height: inspectorHeight + arrowHeight
			});
			$arrow.css("top", Math.floor(inspectorHeight));
		},

		getComputed: function(property) {
			return typeof getComputedStyle !== "undefined" ?
				parseFloat(getComputedStyle(this.$el[0])[property]) :
				this.$el[property]();
		},

		onResize: function() {
			var $hovered = $(".inspector-visible");

			if (!$hovered.length) return;

			$hovered.removeClass("inspector-visible");

			if (!Adapt.device.touch) this.setVisibility();
			else this.updateInspector($hovered.last());
		},

		onLeave: function() {
			if (!Adapt.device.touch) this.setVisibility();
		}

	});

	var InspectorContainerView = Backbone.View.extend({

		initialize: function() {
			var id = this.model.get("_id");

			this.listenTo(Adapt, "remove", this.remove);
			this.addTracUrl(id);
			this.$el.attr("data-id", id).data(this.model);
			Adapt.trigger("inspector:id", id);
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
			_.defer(function() { Adapt.trigger("inspector:hover"); });
		},

		onTouch: function(event) {
			event.stopPropagation();

			if (!$(event.target).is("[class*=inspector-]")) {
				Adapt.trigger("inspector:touch", this.$el);
			}
		}

	});

	Adapt.on("app:dataReady", function() {
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