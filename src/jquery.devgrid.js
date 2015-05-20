/**
 * jQuery.devgrid()
 *
 * (a) Wil Neeley
 * (c) Code may be freely distributed under the MIT license.
 */
;(function ( $, window, document, undefined ) {
  var
    plugin_name   = 'devgrid',
    plugin_ref    = null,
    defaults      = {
      columns: 16,
      columnWidth: '40px',
      gutterWidth: '20px',
      visible: false,
      track: true,
      gridStyle: {
        display: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        'z-index': '99999',
        'box-sizing': 'border-box'
      },
      columnStyle: {
        width: '20px',
        height: '100%',
        float: 'left',
        margin: '0 20px',
        background: 'rgba(0, 191, 255, 0.15)',
        position: 'relative',
        'box-sizing': 'border-box'
      },
      gutterStyle: {
        position: 'absolute',
        top: 0,
        height: '100%',
        'box-sizing': 'border-box',
        background: 'rgba(255, 255, 0, 0.4)'
      },
      numBoxStyle: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        'text-align': 'center',
        background: 'rgba(255, 255, 255, 0.5)',
        'box-sizing': 'border-box',
        padding: '2px 0',
        'font-size': '12px',
        'font-family': 'sans-serif'
      },
      infoBoxStyle: {
        width: '280px',
        position: 'absolute',
        top: '20px',
        left: '20px',
        padding: '10px',
        'box-sizing': 'border-box',
        border: '1px solid black',
        background: 'white',
        'font-size': '12px',
        'font-family': 'sans-serif',
        'line-height': '16px'
      }
    };

  // Plugin constructor
  function Plugin( element, options ) {
    this.elm = $(element);
    this.options = $.extend( {}, defaults, options);
    this._defaults = defaults;
    this.init();
  }

  /**
   * Initialization method called with devgrid instantiation
   */
  Plugin.prototype.init = function() {
    var plugin    = this,
        devgrid   = $('<div class="devgrid">'),
        styles    = $('<style class="devgrid-styles">');

    // Remove old dev grid and media query styles
    $('.devgrid').remove(true);
    $('.devgrid-styles').remove(true);

    // Apply dev grid container styles
    devgrid.css($.extend(this._defaults.gridStyle, this.options.gridStyle));

    // Create a new dev grid
    for (var i = 1; i <= this.options.columns; i++) {

      // Parse gutter/column dimensions
      var
        gutter_width            = parseFloat(this.options.gutterWidth.match(/\d+([\/.]\d+)?/g)[0]),
        gutter_width_unit       = this.options.gutterWidth.replace(/\d+([\/.]\d+)?/g, ''),
        column_width            = parseFloat(this.options.columnWidth.match(/\d+([\/.]\d+)?/g)[0]),
        column_width_total      = column_width + (gutter_width * 2),
        column_width_unit       = this.options.columnWidth.replace(/\d+([\/.]\d+)?/g, ''),
        column_break_point      = parseFloat(column_width_total * i),
        indicator_break_point   = column_break_point + column_width;

      // Handle some errors
      if (gutter_width_unit != column_width_unit) {
        throw new Error('jQuery.' + plugin_name + ' :: ' + ' columnWidth and gutterWidth unit type must be the same! Currently ' + gutter_width_unit + ' vs ' + column_width_unit);
      }

      // Construct next breakpoint indicator media query
      styles[0].textContent +=
        '@media only screen and (max-width: ' + indicator_break_point + column_width_unit + ') {\n' +
        ' .devgrid .devgrid-col' + i + ' {\n' +
        '   background: rgba(0, 255, 0, 0.3) !important;\n' +
        ' }\n' +
        ' .devgrid .devgrid-col' + i + ' .devgrid-gutter {\n' +
        '   background: rgba(0, 255, 255, 0.2) !important;\n' +
        ' }\n' +
        '}\n';

      // Construct breakpoint media query
      styles[0].textContent +=
        '@media only screen and (max-width: ' + column_break_point + column_width_unit + ') {\n' +
        ' .devgrid .devgrid-col' + i + ' {\n' +
        '   display: none;\n' +
        ' }\n' +
        '}\n';

      // Create number box
      var number_box = $('<div class="devgrid-number-box">' + i + '</div>');

      // Apply number box styles
      number_box.css($.extend(this._defaults.numBoxStyle, this.options.numBoxStyle));

      // Create breakpoint columns
      var column = $('<div class="devgrid-col devgrid-col' + i + '"></div>');

      // Append number box to column
      column.append(number_box);

      // Apply column styles
      column
        .css($.extend(this._defaults.columnStyle, this.options.columnStyle))
        .css({
          width: this.options.columnWidth,
          margin: '0 ' + this.options.gutterWidth
        });

      // Create/append gutter "columns"
      var l_gutter = $('<div class="devgrid-gutter devgrid-l-gutter">')
        .css($.extend(this._defaults.gutterStyle, this.options.gutterStyle))
        .css({
          width: gutter_width + gutter_width_unit,
          left: (-gutter_width) + gutter_width_unit
        });
      var r_gutter = $('<div class="devgrid-gutter devgrid-r-gutter">')
        .css($.extend(this._defaults.gutterStyle, this.options.gutterStyle))
        .css({
          width: gutter_width + gutter_width_unit,
          right: (-gutter_width) + gutter_width_unit
        });

      // Append gutters to columns
      column.append(l_gutter).append(r_gutter);

      // Add column to grid
      devgrid.append(column);
    }

    // Append media queries
    $('head').append(styles);

    // Append the devgrid
    plugin.elm.append(devgrid);

    // Create info box
    var info_box = $('<div class="devgrid-info-box">');
    info_box.append(
      '<div class="devgrid-info-row devgrid-column-total"><strong>Column Total:</strong> <span></span></div>' +
      '<div class="devgrid-info-row devgrid-window-width"><strong>Window Width:</strong> <span></span></div>' +
      '<div class="devgrid-info-row devgrid-column-width"><strong>Column Width:</strong> <span></span></div>' +
      '<div class="devgrid-info-row devgrid-gutter-width"><strong>Gutter Width:</strong> <span></span></div>' +
      '<div class="devgrid-info-row devgrid-grid-column-width"><strong>Grid Column Width:</strong> <span></span></div>' +
      '<div class="devgrid-info-row devgrid-active-breakpoint"><strong>Active Breakpoint:</strong> <span></span></div>'
    );

    // Apply info box styles
    info_box.css($.extend(this._defaults.infoBoxStyle, this.options.infoBoxStyle));

    // Append info box
    devgrid.append(info_box);

    // Initialize ghost grid tracking
    if (this.options.track) {

      // Append ghost grid for breakpoint tracking
      var ghostgrid = devgrid.clone();
      ghostgrid.attr('id', 'devgrid-ghostgrid').css({left: -99999, display: 'block', 'z-index': -99999});
      plugin.elm.append(ghostgrid);

      // Start tracking and attach tracking event
      this.trackBreakPoint.call(this.trackBreakPoint);
      $(window).on('resize', this.trackBreakPoint);
    }

    // Display visualization only when instructed
    if (this.options.visible) {
      devgrid.css('display', 'block');

      // Inclosure a window resize event to update info fields
      var updateInfoFields = function() {

        // Calculate info values
        var
          column_total_str        = plugin.options.columns,
          window_width_str        = $(window).outerWidth() + 'px',
          gutter_width            = parseFloat(plugin.options.gutterWidth.match(/\d+([\/.]\d+)?/g)[0]),
          gutter_width_str        = plugin.options.gutterWidth,
          column_width            = parseFloat(plugin.options.columnWidth.match(/\d+([\/.]\d+)?/g)[0]),
          column_width_unit       = plugin.options.columnWidth.replace(/\d+([\/.]\d+)?/g, ''),
          column_width_str        = plugin.options.columnWidth,
          grid_column_width_str   = (gutter_width * 2) + column_width + column_width_unit,
          active_breakpoint_str   = plugin.trackBreakPoint.call(plugin.trackBreakPoint);

        // Reference info value elements
        var
          column_total_elm        = info_box.find('.devgrid-column-total span'),
          window_width_elm        = info_box.find('.devgrid-window-width span'),
          column_width_elm        = info_box.find('.devgrid-column-width span'),
          gutter_width_elm        = info_box.find('.devgrid-gutter-width span'),
          grid_column_width_elm   = info_box.find('.devgrid-grid-column-width span'),
          active_breakpoint_elm   = info_box.find('.devgrid-active-breakpoint span');

        // Populate elements with values
        column_total_elm.html(column_total_str);
        window_width_elm.html(window_width_str);
        column_width_elm.html(column_width_str);
        gutter_width_elm.html(gutter_width_str);
        grid_column_width_elm.html(grid_column_width_str);
        active_breakpoint_elm.html(active_breakpoint_str);
      };
      updateInfoFields();
      $(window).on('resize', updateInfoFields);
    }
  };


  /**
   * Method used to update which breakpoint is currently active as the data attribute 'data-devgrid-breakpoint' on the
   * body.
   * @returns {Number} The number of the next breakpoint column
   */
  Plugin.prototype.trackBreakPoint = function() {

    // Identify columns in ghost grid
    var ghost_cols = $('#devgrid-ghostgrid').find('.devgrid-col').filter(function(idx, elm) {
      return ($(elm).css('display') != 'none');
    });

    // Identify and set breakpoint on body
    var breakpoint = ghost_cols.length;
    if (this.breakpoint != breakpoint) {
      this.breakpoint = breakpoint;
      $('body').attr('data-devgrid-breakpoint', this.breakpoint);
    }

    return this.breakpoint;
  };


  // Public methods
  var public_methods = {

    hide: function() {
      $('.devgrid').hide();
    },

    show: function() {
      $('.devgrid').show();
    }
  };

  // Plugin wrapper around constructor
  $.fn[plugin_name] = function ( options ) {

    // Reference the plugin globally
    plugin_ref = this;

    // Call methods or init plugin as appropriate
    if (typeof options == 'string') {
      var method_name = options;
      var args = $(arguments).toArray();
      args.shift();
      args.unshift(this);
      return public_methods[method_name].apply(this, args);
    } else {
      return this.each(function () {
        $.data(this, 'plugin_' + plugin_name, new Plugin( this, options ));
      });
    }
  };

})( jQuery, window, document );
