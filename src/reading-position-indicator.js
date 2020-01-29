'use strict';

/**
 * @module @10up/ReadingPositionIndicator
 *
 * @description
 *
 * Create an reading position indicator UI.
 *
 * @param {string} elementSelector progress element that should be used.
 * @param {Object} options Object of optional callbacks and settings.
 */
export default class ReadingPositionIndicator {

	/**
	 * constructor function
	 * @param elementSelector Ojbect
	 * @param options Ojbect
	 */
	constructor( elementSelector, options = {} ) {

		// Defaults
		const defaults = {
			startElement: null, // DOMNode that the percentage should start at
			endElement: null,   // DOMNode that the percentage should end at
			onCreate: null,
			scrollStart: null,
			scrolling: null,
			scrollEnd: null,
		};

		if ( ! elementSelector || 'string' !== typeof elementSelector ) {
			console.error( '10up ReadingPositionIndicator: No target supplied. A valid target (readingPositionIndicator) must be used.' ); // eslint-disable-line
			return;
		}

		// ReadingPositionIndicator container
		this.$readingPositionIndicator = document.querySelector( elementSelector );

		// Bail out if there's no readingPositionIndicator.
		if ( ! this.$readingPositionIndicator  ) {
			console.error( '10up ReadingPositionIndicator: Target not found. A valid target (readingPositionIndicator) must be used.'  ); // eslint-disable-line
			return;
		}

		document.documentElement.classList.add( 'js' );

		// Settings
		this.settings = Object.assign( {}, defaults, options );

		this.$startElement = document.querySelector( this.settings.startElement );
		this.$endElement = document.querySelector( this.settings.endElement );
		this.inScrollArea = false;

		this.setupReadingPositionIndicator( this.$readingPositionIndicator );

		/**
		 * Called after the readingPositionIndicator is initialized on page load.
		 * @callback onCreate
		 */
		if ( this.settings.onCreate && 'function' === typeof this.settings.onCreate ) {
			this.settings.onCreate.call();
		}

	}

	/**
	 * Setup the reading position indicator
	 *
	 * @param {HTMLElement} element
	 */
	setupReadingPositionIndicator( element ) {

		// check to see wether its a progress element or has role progressbar
		if ( ! 'PROGRESS' === element.nodeName || 'progressbar' === element.role ) {
			element.setAttribute( 'role', 'progressbar' );
		}

		element.setAttribute( 'max', 100 );

		document.addEventListener( 'scroll', this.handleScroll.bind( this ) );

	}

	/**
	 * Handles the scroll events
	 */
	handleScroll() {

		this.$readingPositionIndicator.setAttribute( 'value', this.percentage );

		// check wether is in scroll area based on the percentage
		if ( 0 < this.percentage && 100 > this.percentage ) {

			// call the callback for scrollStart only on transitioning from inScrollArea false to true
			if ( ! this.inScrollArea ) {
				/**
				 * Called when the scroll area comes into view.
				 * @callback scrollStart
				 */
				if ( this.settings.scrollStart && 'function' === typeof this.settings.scrollStart ) {
					this.settings.scrollStart( this.percentage );
				}
			}
			this.inScrollArea = true;
		}

		// check wether is outside scroll area based on the percentage
		if ( 0 === this.percentage || 100 === this.percentage ) {

			// call the callback for scrollEnd only on transitioning from inScrollArea true to false
			if ( this.inScrollArea ) {
				/**
				 * Called when the scroll area leaves the view.
				 * @callback scrollEnd
				 */
				if ( this.settings.scrollEnd && 'function' === typeof this.settings.scrollEnd ) {
					this.settings.scrollEnd( this.percentage );
				}
			}
			this.inScrollArea = false;
		}

		// call the callback for scrolling only while inside the scrollArea
		if ( this.inScrollArea ) {

			/**
			 * Called on every update while inside the scroll area.
			 *
			 * @callback scrolling
			 */
			if ( this.settings.scrolling && 'function' === typeof this.settings.scrolling ) {
				this.settings.scrolling( this.percentage );
			}
		}

	}

	/**
	 * calculates the maximal value
	 */
	get max() {

		const { body } = document;
		const html = document.documentElement;
		const windowHeight = window.innerHeight;

		let scrollAreaHeight = 0;

		if ( this.$endElement && this.$endElement instanceof HTMLElement ) {

			scrollAreaHeight = this.$endElement.offsetTop;

		} else {

			scrollAreaHeight = Math.max(
				body.scrollHeight,
				body.offsetHeight,
				html.clientHeight,
				html.scrollHeight,
				html.offsetHeight,
			);

		}

		return scrollAreaHeight - windowHeight - this.min;
	}

	/**
	 * calculates the minimal value for the progress bar
	 */
	get min() {

		if ( this.$startElement && this.$startElement instanceof HTMLElement ) {
			return Math.max( 0, this.$startElement.offsetTop );
		}

		return 0;

	}

	/**
	 * calculates the current percentage
	 */
	get percentage() {
		const value = Math.max( 0, window.scrollY - this.min );
		return Math.min( 100, value * 100 / this.max );
	}

}
