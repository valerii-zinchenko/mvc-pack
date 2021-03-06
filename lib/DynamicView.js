/*
 * mvc-pack
 *
 * Copyright (c) 2016-2017 Valerii Zinchenko
 *
 * Licensed under MIT (http://valerii-zinchenko.github.io/mvc-pack/blob/master/LICENSE.txt)
 *
 * All source files are available at: http://github.com/valerii-zinchenko/mvc-pack
 */

/**
 * @file It contains the implementation of [Dynamic View class]{@link DynamicView} creator.
 *
 * @see {@link AModeComponent}
 * @see {@link AView}
 * @see {@link StaticView}
 *
 * @author Valerii Zinchenko
 *
 * @version 3.1.0
 */

'use strict';


/**
 * Dynamic view.
 * It implements parent's [render()]{@link render} method to dynamically process template, initialize required elements and attach events.
 *
 * @class
 * @extends AView
 */
var DynamicView = Class(AView, null, /** @lends DynamicView.prototype */{
	/**
	 * Main template.
	 *
	 * @type {String}
	 */
	template: '<div></div>',

	/**
	 * Here are stored all separate elements which rendered from a template
	 * @type{HTMLElement[]}
	 */
	elements: [],

	/**
	 * Container where the template elements will be created as real HTMLElements
	 * @type {String}
	 */
	_tmpContainer: 'div',

	destruct: function() {
		this.elements.forEach(function(element) {
			element.remove();
		});

		AView.prototype.destruct.call(this);
	},

	/**
	 * Render the view.
	 *
	 * @returns {HTMLElement[]}
	 */
	render: function() {
		this._processTemplate();
		this._initElements();
		this._attachEvents();

		return this.elements;
	},

	/**
	 * Process view template and store the references to [the rendered elements]{@link elements}.
	 */
	_processTemplate: function() {
		this.element = document.createElement(this._tmpContainer);
		this.element.innerHTML = _.template(this.template)(this);

		var children = this.element.children;
		for (var n = 0, N = children.length; n < N; n++) {
			this.elements.push(children[n]);
		}
	}
});
