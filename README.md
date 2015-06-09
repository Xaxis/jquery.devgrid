# jQuery DevGrid

Version 1.0.0

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
your site updated with the `data-devgrid-x-breakpoint` and `data-devgrid-y-breakpoint` attributes so you can track which 
breakpoints are active programmatically, do the following:

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
the `data-devgrid-x-breakpoint` and `data-devgrid-y-breakpoint` attributes with an observer or during a window resize 
event can provide just the feedback you need to fire your code when you need to.

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

### Initialize DevGrid Visualization w/ Horizontal (rows) Grid

It is sometimes useful to track vertical changes in your responsive design as well. Enabling the horizontal grid gives
you the ability to track and visualize vertical screen space. Vertical tracking is accomplished by monitoring the 
`data-devgrid-y-breakpoint` attribute on the `<body>` element.

```javascript
// jQuery.devgrid initialization w/ horizontal grid
$('body').devgrid({
    columns: 12,
    columnWidth: '40px',
    gutterWidth: '20px',
    visible: true,
    vertical: false,
    horizontal: true
});
```

### Initialize DevGrid Visualization w/ Info Box Only

```javascript
// jQuery.devgrid initialization with only info box
$('body').devgrid({
    columns: 12,
    columnWidth: '40px',
    gutterWidth: '20px',
    visible: true,
    vertical: false,
    horizontal: false
});
```

You can also toggle which grid visualizations are showing using the UI toggle controls.

![DevGrid Breakpoint Tracking](https://raw.githubusercontent.com/Xaxis/jquery.devgrid/master/test/jquery_devgrid_toggle_demo.gif)

### Centered DevGrid Visualization

Centering the overlay on screen is as simple as applying a `max-width` to the `gridStyle` properties object.

```javascript
// jQuery.devgrid initialization with only info box
$('body').devgrid({
    columns: 12,
    columnWidth: '40px',
    gutterWidth: '20px',
    visible: true,
    vertical: false,
    horizontal: false,
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

Many gutter systems have half of the gutter space on each side of the columns.

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

The result:

![DevGrid Visualization Styles](https://raw.githubusercontent.com/Xaxis/jquery.devgrid/master/test/jquery_devgrid_style_demo_2.png)

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

Works in IE9+, Chrome 14+, Safari 4+, Firefox 3.0+, Opera 10+.

## Working Example

See `test.html` in tests directory.

### Changelog

#### Version 1.1.0

* added horizontal grid visualization and tracking
* added grid toggle ui control

#### Version 1.0.0

* initial release
