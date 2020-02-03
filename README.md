# 10up Reading Position Indicator component

[![Support Level](https://img.shields.io/badge/support-active-green.svg)](#support-level) [![Build Status][cli-img]][cli-url]

[cli-img]: https://travis-ci.org/10up/component-reading-position-indicator.svg?branch=master
[cli-url]: https://travis-ci.org/10up/component-reading-position-indicator

## Installation

### NPM
`npm install --save @10up/component-reading-position-indicator`

### Standalone
Clone this repo and import `reading-position-indicator.js` and `reading-position-indicator.css` from the `dist/` directory.

## API

This component accepts two arguments, the selector for the reading-position-indicator container and an object containing optional callbacks.

### Callbacks

- `onCreate`: Called after the reading-position-indicator is initialized on page load
- `scrollStart`: Called when the scrollable are enters the visible area
- `scrollEnd`: Called when the scrollable are leaves the visible area
- `scrolling`: Called when on scroll events while the scrollable area is in the visible area

## Usage

### Markup

This is the markup template expected by the component.

```html
<progress class="reading-position-indicator"></progress>
```

### CSS

The styles can be imported into your existing codebase by using PostCSS imports, or by including the standalone CSS file in your project.

#### PostCSS Imports
`@import '@10up/component-reading-position-indicator';`

#### Standalone
Include the `reading-position-indicator.css` file from the `dist/` directory.

### JavaScript

Create a new instance by supplying the selector to use for the reading-position-indicator and an object containing any necessary callback functions.

#### NPM

```javascript
import ReadingPositionIndicator from '@10up/component-reading-position-indicator';

new ReadingPositionIndicator( '.reading-position-indicator', {
	onCreate: function() {
		console.log( 'onCreate callback' );
	},
	scrollStart: function( percentage ) {
		console.log( 'scrollStart callback', percentage );
	},
	scrollEnd: function( percentage ) {
		console.log( 'scrollEnd callback', percentage );
	},
	scrolling: function( percentage ) {
		console.log( 'scrolling callback', percentage );
	}
} );
```

#### Standalone

Include the `reading-position-indicator.js` file from the `dist/` directory and access the component from the gobal `TenUp` object.

```javascript
let myReadingPositionIndicator = new TenUp.readingPositionIndicator( '.reading-position-indicator', {
	onCreate: function() {
		console.log( 'onCreate callback' );
	},
	scrollStart: function( percentage ) {
		console.log( 'scrollStart callback', percentage );
	},
	scrollEnd: function( percentage ) {
		console.log( 'scrollEnd callback', percentage );
	},
	scrolling: function( percentage ) {
		console.log( 'scrolling callback', percentage );
	}
} );
```

## Demo

Example implementations can be found in the `demo` directory.

## Support Level

**Active:** 10up is actively working on this, and we expect to continue work for the foreseeable future including keeping tested up to the most recent version of WordPress.  Bug reports, feature requests, questions, and pull requests are welcome.

## Like what you see?

<a href="http://10up.com/contact/"><img src="https://10updotcom-wpengine.s3.amazonaws.com/uploads/2016/10/10up-Github-Banner.png" width="850"></a>
