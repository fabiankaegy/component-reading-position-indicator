'use strict';

/**
 * @module @10up/ReadingPosition
 *
 * @description
 *
 * Create an reading position indicator UI.
 *
 * @param {string} elementSelector progress element that should be used.
 * @param {Object} options Object of optional callbacks and settings.
 */
export default class ReadingPosition {

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
			console.error( '10up ReadingPosition: No target supplied. A valid target (readingPosition) must be used.' ); // eslint-disable-line
			return;
		}

		// ReadingPosition container
		this.$readingPosition = document.querySelector( elementSelector );

		// Bail out if there's no readingPosition.
		if ( ! this.$readingPosition  ) {
			console.error( '10up ReadingPosition: Target not found. A valid target (readingPosition) must be used.'  ); // eslint-disable-line
			return;
		}

		document.documentElement.classList.add( 'js' );

		// Settings
		this.settings = Object.assign( {}, defaults, options );

		this.updating = false;
		this.$startElement = document.querySelector( this.settings.startElement );
		this.$endElement = document.querySelector( this.settings.endElement );
		this.inScrollArea = false;

		this.setupReadingPosition( this.$readingPosition );

		/**
		 * Called after the readingPosition is initialized on page load.
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
	setupReadingPosition( element ) {

		// check to see wether its a progress element or has role progressbar
		if ( ! 'PROGRESS' === element.nodeName || 'progressbar' === element.role ) {
			element.setAttribute( 'role', 'progressbar' );
		}

		// set the maximum value to 100 because well be passing the value in as a percentage
		element.setAttribute( 'max', 100 );

		// add event listeners for scroll, resize and orientationchange because they all affect the percentage
		document.addEventListener( 'scroll', this.debouncedHandleScroll.bind( this ) );
		window.addEventListener( 'resize', this.debouncedHandleScroll.bind( this ) );
		window.addEventListener( 'orientationchange', this.debouncedHandleScroll.bind( this ) );

	}

	/**
	 * debounced handler for the scroll event
	 */
	debouncedHandleScroll() {

		// bail out if page is still updating
		if ( this.updating ) {
			return;
		}

		// schedule our handleScroll method
		requestAnimationFrame( this.handleScroll.bind( this ) );

		// telling the components that it is currently updating
		this.updating = true;

	}

	/**
	 * handler for the scroll event
	 */
	handleScroll() {

		// setting the value of the progress bar to the current percentage
		this.$readingPosition.setAttribute( 'value', this.percentage );

		// check wether is in scroll area based on the percentage
		if ( 0 < this.percentage && 100 > this.percentage ) {

			// call the callback for scrollStart only on transitioning into the scroll area
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

			// call the callback for scrollEnd only on transitioning out of the scroll area
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

		// call the callback for scrolling only while inside the scroll area
		if ( this.inScrollArea ) {

			/**
			 * Called on every scroll event while inside the scroll area.
			 *
			 * @callback scrolling
			 */
			if ( this.settings.scrolling && 'function' === typeof this.settings.scrolling ) {
				this.settings.scrolling( this.percentage );
			}
		}

		// telling component that updating is done
		this.updating = false;

	}

	/**
	 * calculates the position of the end from the scroll area
	 */
	get max() {

		const { body } = document;
		const html = document.documentElement;
		const windowHeight = window.innerHeight;

		// initialize value with a default height of 0
		let scrollAreaHeight = 0;

		// check wether an endElement is present and a valid DOM Node
		if ( this.$endElement && this.$endElement instanceof HTMLElement ) {

			// setting the scroll area height to the top ofset of the end element
			scrollAreaHeight = this.$endElement.offsetTop;

		} else {

			// setting the scroll area height to the full page height
			scrollAreaHeight = Math.max(
				body.scrollHeight,
				body.offsetHeight,
				html.clientHeight,
				html.scrollHeight,
				html.offsetHeight,
			);

		}

		// accounting for the fact that the scroll position is measured at the
		// top of the page and the scrollAreaHeight might never get there
		return scrollAreaHeight - windowHeight - this.min;
	}

	/**
	 * calculates the position of the start from the scroll area
	 */
	get min() {

		// check wether an startElement is present and a valid DOM Node
		if ( this.$startElement && this.$startElement instanceof HTMLElement ) {

			// returning the top ofset of the element, making sure the value can't be below zero
			return Math.max( 0, this.$startElement.offsetTop );

		}

		return 0;

	}

	/**
	 * calculates the current percentage thats already been scrolled of the scroll area
	 */
	get percentage() {

		// setting the value making sure that it can't be below zero
		const value = Math.max( 0, window.scrollY - this.min );

		// making sure the value can't be above 100
		return Math.min( 100, value * 100 / this.max );
	}

}
