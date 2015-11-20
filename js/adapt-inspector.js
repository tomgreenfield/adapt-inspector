/*
* Inspector
* License - https://github.com/adaptlearning/adapt_framework/blob/master/LICENSE
* Maintainers - Tom Greenfield
*/

define(function(require) {

	var Adapt = require("coreJS/adapt");
	var InspectorView = Backbone.View.extend({

		containers: [],

		initialize: function() {
			this.listenTo(Adapt, "remove", this.remove);
			this.listenTo(Adapt, "device:resize", function() {
				this.checkMargin(this.$el.children(".inspector"));
			});
			this.render();
		},

		events: function() {
			var events = { "click .trac-url-disabled": "onClickDisabled" };

			if (!Adapt.device.touch) {
				events.mouseenter = "onEnter";
				events.mouseleave = "onLeave";
			} else {
				events.touchend = "onTouch";
			}

			return events;
		},

		render: function() {
			var template = Handlebars.templates.inspector;
			var data = this.model.toJSON();
			var container = "inspector-container-" + this.model.get("_id");

			this.containers.push(container);
			this.$el.append(template(data)).addClass(container);
			this.checkWidth($("." + container).children(".inspector"));
			this.checkMargin(this.$(".inspector"));
			this.addTracUrl();

			this.sendTo = Adapt.config.get("_inspector")._sendTo;
            
			return this;
		},

		checkWidth: function($element) {
			var elementWidth = $element.width();
 
			if (this.$el.width() < elementWidth) $element.css("min-width", elementWidth);
		},

		checkMargin: function($element) {
			var minusHalfWidth = function() {
				return "-" + $element.outerWidth() / 2 + "px";
			};

			if ($element.css("margin-left") === minusHalfWidth()) return;

			$element.css({ "left": "", "margin-left": "" });
			$element.css({ "left": "50%", "margin-left": minusHalfWidth() });
		},
		getTracDetails: function(){
			var title = $("<div/>").html(this.model.get("displayTitle")).text();
			var id = this.model.get("_id");
            
			var location = Adapt.location._currentId;
			var locationType = Adapt.location._contentType;
			var params = id;
			
			if (title) params += " " + title;
			if (id !== location) params += " (" + locationType + " " + location + ")";
            
			params +=  ", path:"+this.getIdPath();
            
			return params;
		},
		getIdPath: function (){
			var model = this.model;
			var ids = [];
			while(model != null) {
				ids.unshift(model.get("_id"));
				if(model.get("_type") === "course") break;//end of journey
				model = model.getParent();
			}
			return ids.join(" > ");
		},
		copyToClipboard: function(text) {
			window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
		},
		addTracUrl: function() {
			this.tracUrl = Adapt.config.get("_inspector")._tracUrl;

			if (!this.tracUrl) return this.$(".inspector").addClass("trac-url-disabled");

                var details = this.getTracDetails();

			this.$(".inspector").attr("href", this.tracUrl + "/newticket?summary=" +
				encodeURIComponent(details));
		},

		onClickDisabled: function() {
			try {
				if(!this.sendTo || this.sendTo == "") return false;
                
				var details = this.getTracDetails();
                
				if(this.sendTo == "console") {
					console.log(details);
				}
				else if(this.sendTo == "clipboard"){
					this.copyToClipboard(details);
				}
			} catch(e){ console.error(e); }
            
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

		onTouch: function(event) {
			event.stopPropagation();

			var $element = this.$(".inspector");

			if (this.tracUrl) $element.removeClass("trac-url-disabled");
			if (this.$el.hasClass("inspector-visible")) return;

			$element.addClass("trac-url-disabled");
			this.hideInspector();
			this.showInspector(this.$el);
		},

		setVisibility: function() {
			this.hideInspector();
			for (var i = this.containers.length - 1; i >= 0; --i) {
				var $container = $("." + this.containers[i] + ".inspector-active:hover");

				if ($container.length > 0) return this.showInspector($container);
			}
		},

		showInspector: function($container) {
			var $element = $container.children(".inspector");

			this.checkMargin($element);
			$element.off().show(0, function() {
				$container.addClass("inspector-visible");
			});
		},

		hideInspector: function() {
			$(".inspector").on("transitionend", function() { $(this).hide(); });
			$("[class*='inspector-container']").removeClass("inspector-visible");
		}

	});

	Adapt.on("app:dataReady", function() {
		var config = Adapt.config.get("_inspector");
		var views = [ "menu", "page", "article", "block", "component" ];

		if (!config || !config._isEnabled) return;

		views = config._elementsToInspect || views;
		Adapt.on(views.join("View:postRender ") + "View:postRender", function(view) {
			new InspectorView({ el: view.$el, model: view.model });
		});
	});

});
