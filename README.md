# jQuery DevGrid

Version 1.3.0

## Summary

jQuery.devgrid serves two purposes. It is useful for the visualization of responsive site grids while providing the 
means for tracking which breakpoints are active in your frontend code.

#### DevGrid Visualization

![DevGrid Visualization](https://raw.githubusercontent.com/Xaxis/jquery.devgrid/master/test/jquery_devgrid_visualization_demo_2.gif)

#### DevGrid Breakpoint Tracking

![DevGrid Breakpoint Tracking](https://raw.githubusercontent.com/Xaxis/jquery.devgrid/master/test/jquery_devgrid_tracking_demo_2.gif)

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

When you have no need to see your site's breakpoint visualizations but still would like to have the `<body>` element of 
your site updated with the `data-devgrid-x-breakpoint` attribute so you can track which breakpoint is active 
programmatically, do the following:

```javascript
// jQuery.devgrid initialization  w/o visualization 
$('body').devgrid({
    columns: 12,
    columnWidth: '40px',
    gutterWidth: '20px',
    visible: false
});
```

This can be useful in cases where you're using code which should respond at different breakpoints. Tracking the value of 
the `data-devgrid-x-breakpoint` attribute can provide just the feedback you need to fire your code when you need to to 
match your media queries.

### DevGrid Visualization w/o Tracking

If you don't need to track your current active breakpoint in code you can disable tracking as follows:

```javascript
// jQuery.devgrid initialization w/o tracking
$('body').devgrid({
    columns: 12,
    columnWidth: '40px',
    gutterWidth: '20px',
    visible: true,
    track: false
});
```

### Centered DevGrid Visualization

Centering the overlay on screen is as simple as applying a `max-width` to the `gridStyle` properties object.

```javascript
// jQuery.devgrid initialization with only info box
$('body').devgrid({
    columns: 12,
    columnWidth: '40px',
    gutterWidth: '20px',
    visible: true
    gridStyle: {
        'max-width': '960px'
    }
});
```

### Toggling Gutter/Column Order

You can also easily swap the order of gutters relative to columns.

```javascript
// Toggled gutter
$('body').devgrid({
    columns: 16,
    columnWidth: '40px',
    gutterWidth: '20px',
    visible: true,
    track: true,
    toggleGutter: true
});
```

### Distribute Column Gutters

Some gutter systems have half of the gutter space on each side of the columns.

```javascript
// Distributed Gutter
$('body').devgrid({
    columns: 16,
    columnWidth: '40px',
    gutterWidth: '20px',
    visible: true,
    track: true,
    distributeGutter: true
});
```

### Percentage Based Gutters

Want to use percentage based gutters on your fluid site? No problem. 

```javascript
// Distributed Gutter
$('body').devgrid({
    columns: 16,
    columnWidth: '40px',
    gutterWidth: '1.6%',
    visible: true,
    track: true
});
```

### Display Major Breakpoints Visualization

It's often handy to visualize your major breakpoints such as mobile, tablet, etc. 

```javascript
    // Draw breakpoints
    $('body').devgrid({
        columns: 24,
        columnWidth: '40px',
        gutterWidth: '20px',
        visible: true,
        track: true,
        gridStyle: {
            'max-width': '1440px'
        },
        breakpoints: [
            {
                bp: '480px',
                tag: 'Mobile',
                css: {
                    background: 'rgba(85,98,112, 0.4)'
                }
            },
            {
                bp: '780px',
                tag: 'Tablet',
                css: {
                    background: 'rgba(78,205,196, 0.4)'
                }
            },
            {
                bp: '960px',
                tag: 'Desktop',
                css: {
                    background: 'rgba(199,244,100, 0.4)'
                }
            },
            {
                bp: '1440px',
                tag: 'Wide',
                css: {
                    background: 'rgba(255,107,107, 0.4)'
                }
            }
        ]
    });
```

### Modify DevGrid Visualization Styles

It's easy to alter any of the styles of the DevGrid Visualization you want.

```javascript
// jQuery.devgrid initialization w/ style alterations
$('body').devgrid({
    columns: 12,
    columnWidth: '40px',
    gutterWidth: '20px',
    visible: true,
    gridStyle: {
        opacity: 0.4
    },
    columnStyle: {
        background: 'green'
    },
    numBoxStyle: {
        'font-size': '16px',
        'line-height': '18px',
        color: 'red'
    },
    infoBoxStyle: {
        background: 'black',
        color: 'white'
    }
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

// Toggle the DevGrid's visibility
$.fn.devgrid('toggle');
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

Works in browsers that support CSS calc() functionality.

## Working Example

See `test.html` in tests directory.

### Changelog

#### Version 1.3.0

* added support for percentage based gutters

#### Version 1.2.0

* removed horizontal grid visualization and tracking
* increased efficiency 

#### Version 1.1.0

* added horizontal grid visualization and tracking
* added grid toggle ui control

#### Version 1.0.0

* initial release
