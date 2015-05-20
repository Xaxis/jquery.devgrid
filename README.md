# jQuery DevGrid

Version 1.0.0

## Summary

jQuery.devgrid serves two purposes. It is useful for the visualization of responsive site grids while providing the 
means for tracking which breakpoint is active in your frontend code.

#### DevGrid Visualization

![DevGrid Visualization](https://raw.githubusercontent.com/Xaxis/jquery.devgrid/master/test/jquery_devgrid_visualization_demo.gif)

#### DevGrid Breakpoint Tracking

![DevGrid Visualization](https://raw.githubusercontent.com/Xaxis/jquery.devgrid/master/test/jquery_devgrid_tracking_demo.gif)

## Author

Wil Neeley ( [@wilneeley](http://twitter.com/wilneeley) / [puppetlabs.com](http://www.puppetlabs.com) / [github.com](https://github.com/Xaxis) )

## Usage

Include `jquery.devgrid.min.js` after jQuery in your header or elsewhere on your page.

### Initialize DevGrid Visualization and Tracking

```javascript
// Basic jQuery.devgrid initialization 
$('body').devgrid({
    columns: 12,
    columnWidth: '40px',
    gutterWidth: '20px',
    visible: true
});
```

### Tracking w/o DevGrid Visualization

When you have no need to see your site's breakpoint visualization but still would like to have the `<body>` element of 
your site updated with the `data-devgrid-breakpoint` attribute so you can track which breakpoint is active in your site
programmatically, do the following:

```javascript
// Basic jQuery.devgrid initialization 
$('body').devgrid({
    columns: 12,
    columnWidth: '40px',
    gutterWidth: '20px',
    visible: false
});
```

This can be useful in cases where you're using code which should respond at different breakpoints. Tracking the value of 
the `data-devgrid-breakpoint` attribute with an observer or during a window resize event can provide just the feedback
you need to fire your code when you need to.

### DevGrid Visualization w/o Tracking

If you don't need to track your current active breakpoint in code you can disable tracking as follows:

```javascript
// Basic jQuery.devgrid initialization 
$('body').devgrid({
    columns: 12,
    columnWidth: '40px',
    gutterWidth: '20px',
    visible: true,
    track: false
});
```

### Using DevGrid Methods

During development it is sometimes useful to have the ability to easily hide and show the DevGrid visualization via
the console. The below helper methods will allow you to do just that.

```javascript
// Hide the DevGrid Visualization
$.fn.devgrid('hide');

// Hide the DevGrid Visualization
$.fn.devgrid('show');
```

### Caveats

When using jQuery.devgrid in your production code make sure you have disabled the DevGrid Visualization by either 
initializing your dev grid with a `visible` property of `false` or by hiding your visualization manually somewhere in 
your code.

```javascript
// DevGrid initialized with `visible` property set to `false`
$('body').devgrid({
    columns: 12,
    columnWidth: '40px',
    gutterWidth: '20px',
    visible: false,
    track: true
});
```

```javascript
// Manually hide the DevGrid Visualization
$.fn.devgrid('hide');
```

## Requirements/Browsers

Tested with jQuery 1.7.x+.

Works in IE9+, Chrome 14+, Safari 4+, Firefox 3.0+, Opera 10+.

## Working Example

See `test.html` in tests directory.

### Changelog

#### Version 1.0.0

* initial release
