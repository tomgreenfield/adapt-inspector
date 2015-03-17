/*
* Inspector
* License - https://github.com/adaptlearning/adapt_framework/blob/master/LICENSE
* Maintainers - Tom Greenfield
*/

define(function(require) {

	var Adapt = require("coreJS/adapt");
	var Backbone = require("backbone");

	var InspectorView = Backbone.View.extend({

		containers: [],

		initialize: function() {
			this.listenTo(Adapt, "remove", this.remove);
			this.render();
		},

		events: {
			"click .trac-url-disabled": "onClickDisabled",
			"mouseenter": "onEnter",
			"mouseleave": "onLeave"
		},

		render: function() {
			var template = Handlebars.templates.inspector;
			var data = this.model.toJSON();
			var container = "inspector-container-" + this.model.get("_id");
			var $element;

			this.containers.push(container);
			this.$el.append(template(data)).addClass(container);
			$element = $("." + container).children(".inspector");
			if (this.$el.width() < $element.width()) $element.css("min-width", $element.width());
			$element.css("margin-left", "-" + $element.width() / 2 + "px");

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
			$("[class*='inspector-container']").removeClass("inspector-visible");
			$(".inspector").on("transitionend", function() { $(this).hide(); });

			for (var i = this.containers.length - 1; i >= 0; --i) {
				var $container = $("." + this.containers[i] + ".inspector-active:hover");

				if ($container.length !== 0) return this.showInspector($container);
			}
		},

		showInspector: function($container) {
			var $element = $container.children(".inspector");
			var minusHalfWidth = "-" + $element.width() / 2 + "px";

			if ($element.css("margin-left") !== minusHalfWidth) $element.css("margin-left", minusHalfWidth);

			$element.off().show(0, function() { $container.addClass("inspector-visible"); });
		}

	});

	Adapt.on("app:dataReady", function() {
		var config = Adapt.config.get("_inspector");

		if (Adapt.device.touch || !config || !config._isEnabled) return;

		var views = config._elementsToInspect || ["menu", "page", "article", "block", "component"];

		Adapt.on(views.join("View:postRender ") + "View:postRender", function(view) {
			new InspectorView({ el: view.$el, model: view.model });
		});
	});

});