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
      columns: 18,
      columnWidth: '60px',
      gutterWidth: '20px',
      visible: false,
      track: true,
      vertical: true,
      horizontal: false,
      toggleGutter: false,
      breakpoints: [],
      gridStyle: {
        display: 'none',
        position: 'fixed',
        left: 0,
        right: 0,
        'margin-left': 'auto',
        'margin-right': 'auto',
        top: 0,
        width: '100%',
        height: '100%',
        'z-index': '99999',
        'box-sizing': 'border-box'
      },
      columnStyle: {
        width: '20px',
        height: '100%',
        float: 'left',
        background: 'rgba(0, 191, 255, 0.15)',
        position: 'relative',
        'box-sizing': 'border-box'
      },
      gutterStyle: {
        position: 'absolute',
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
    this.init(element, options);
  }

  /**
   * Initialization method called with devgrid instantiation
   */
  Plugin.prototype.init = function( element, options ) {
    var
      plugin            = this,
      vert_devgrid      = $('<div class="devgrid devgrid-vert">'),
      horz_devgrid      = $('<div class="devgrid devgrid-horz">'),
      overlay_devgrid   = $('<div class="devgrid devgrid-overlay">'),
      styles            = $('<style class="devgrid-styles">');

    // Remove previous devgrids and media query style elements
    $('.devgrid').remove();
    $('.devgrid-styles').remove();

    // Apply dev grid container styles
    vert_devgrid.css($.extend(this._defaults.gridStyle, this.options.gridStyle));
    horz_devgrid.css($.extend(this._defaults.gridStyle, this.options.gridStyle));
    overlay_devgrid.css($.extend(this._defaults.gridStyle, this.options.gridStyle));

    // Create grid
    for (var i = 1; i <= this.options.columns; i++) {

      // Parse gutter/column dimensions
      var
        gutter_width            = parseFloat(this.options.gutterWidth.match(/\d+([\/.]\d+)?/g)[0]),
        gutter_width_unit       = this.options.gutterWidth.replace(/\d+([\/.]\d+)?/g, ''),
        column_width            = parseFloat(this.options.columnWidth.match(/\d+([\/.]\d+)?/g)[0]),
        column_width_total      = column_width + gutter_width,
        column_width_unit       = this.options.columnWidth.replace(/\d+([\/.]\d+)?/g, ''),
        column_break_point      = parseFloat(column_width_total * i),
        indicator_break_point   = column_break_point + column_width;

      // Handle some errors
      if (gutter_width_unit != column_width_unit) {
        throw new Error('jQuery.' + plugin_name + ' :: ' + ' columnWidth and gutterWidth unit type must be the same! Currently ' + gutter_width_unit + ' vs ' + column_width_unit);
      }

      /*
       * CREATE - Grid columns
       */

      // Construct vertical column breakpoint indicator media query
      styles[0].textContent +=
        '@media only screen and (max-width: ' + indicator_break_point + column_width_unit + ') {\n' +
        ' .devgrid .devgrid-col' + i + ' {\n' +
        '   background: rgba(0, 255, 0, 0.3) !important;\n' +
        '   opacity: .5;\n' +
        '   transition: opacity 0.6s ease;\n' +
        ' }\n' +
        ' .devgrid .devgrid-col' + i + ' .devgrid-gutter {\n' +
        '   background: rgba(0, 255, 255, 0.2) !important;\n' +
        ' }\n' +
        '}\n';

      // Construct vertical column breakpoint media query
      styles[0].textContent +=
        '@media only screen and (max-width: ' + column_break_point + column_width_unit + ') {\n' +
        ' .devgrid .devgrid-col' + i + ' {\n' +
        '   display: none;\n' +
        ' }\n' +
        '}\n';

      // Create number box
      var vert_number_box = $('<div class="devgrid-number-box">' + i + '</div>');

      // Apply number box styles
      vert_number_box.css($.extend(this._defaults.numBoxStyle, this.options.numBoxStyle));

      // Create column/gutter
      var column = $('<div class="devgrid-col devgrid-col' + i + '"></div>');
      var l_gutter = $('<div class="devgrid-gutter devgrid-l-gutter">');

      // Append number box to column
      column.append(vert_number_box);

      // Append gutter to column
      column.append(l_gutter);

      // Apply base styles to column and gutter
      column
        .css($.extend(this._defaults.columnStyle, this.options.columnStyle))
        .css({
          width: this.options.columnWidth
        });
      l_gutter
        .css($.extend(this._defaults.gutterStyle, this.options.gutterStyle))
        .css({
          width: gutter_width + gutter_width_unit
        });

      // Gutters on the left of columns
      if (this.options.toggleGutter) {
        column
          .css({
            'margin-left': this.options.gutterWidth
          });
        l_gutter
          .css({
            left: (-gutter_width) + gutter_width_unit
          });
      }

      // Gutters on right of columns
      else {
        column
          .css({
            'margin-right': this.options.gutterWidth
          });
        l_gutter
          .css({
            right: (-gutter_width) + gutter_width_unit
          });
      }

      // Add column/gutter to grid
      vert_devgrid.append(column);

      /*
       * CREATE - Grid rows
       */

      // Construct horizontal row breakpoint indicator media query
      styles[0].textContent +=
        '@media only screen and (max-height: ' + indicator_break_point + column_width_unit + ') {\n' +
        ' .devgrid .devgrid-row' + i + ' {\n' +
        '   background: rgba(0, 255, 0, 0.3) !important;\n' +
        '   opacity: .5;\n' +
        '   transition: opacity 0.6s ease;\n' +
        ' }\n' +
        ' .devgrid .devgrid-row' + i + ' .devgrid-gutter {\n' +
        '   background: rgba(0, 255, 255, 0.2) !important;\n' +
        ' }\n' +
        '}\n';

      // Construct horizontal row breakpoint media query
      styles[0].textContent +=
        '@media only screen and (max-height: ' + (column_break_point) + column_width_unit + ') {\n' +
        ' .devgrid .devgrid-row' + i + ' {\n' +
        '   display: none;\n' +
        ' }\n' +
        '}\n';

      // Create number box
      var horz_number_box = $('<div class="devgrid-number-box">' + i + '</div>');

      // Apply number box styles
      horz_number_box
        .css($.extend(this._defaults.numBoxStyle, this.options.numBoxStyle))
        .css({
          width: 'auto',
          'min-width': '20px',
          height: '100%',
          padding: '0 4px',
          'line-height': this.options.columnWidth
        });

      // Create row/gutter
      var row = $('<div class="devgrid-row devgrid-row' + i + '"></div>');
      var t_gutter = $('<div class="devgrid-gutter devgrid-t-gutter">');

      // Add row to grid
      horz_devgrid.append(row);

      // Append gutters to columns
      row.append(t_gutter);

      // Apply base styles to row and gutter
      row
        .css($.extend(this._defaults.columnStyle, this.options.columnStyle))
        .css({
          width: '100%',
          'margin-left': 0,
          float: 'none',
          height: this.options.columnWidth
        });
      t_gutter
        .css($.extend(this._defaults.gutterStyle, this.options.gutterStyle))
        .css({
          width: '100%',
          height: gutter_width + gutter_width_unit
        });

      // Gutters above row
      if (this.options.toggleGutter) {
        row
          .css({
            'margin-top': this.options.gutterWidth
          });
        t_gutter
          .css({
            top: (-gutter_width)
          });
      }

      // Gutters below row
      else {
        row
          .css({
            'margin-bottom': this.options.gutterWidth
          });
        t_gutter
          .css({
            bottom: (-gutter_width) + gutter_width_unit
          });
      }

      // Apply row styles
      var n = (i-1);

      // Append number box to column
      row.append(horz_number_box);
    }

    // Append media queries
    $('head').append(styles);

    // Append the devgrids
    plugin.elm.append(vert_devgrid);
    plugin.elm.append(horz_devgrid);
    plugin.elm.append(overlay_devgrid);

    /*
     * CREATE - Breakpoint visualizations
     */

    // Proceed when specified by user config
    if (this.options.breakpoints.length) {
      var last_bp = 0;
      var bps = this.options.breakpoints;
      for (var i = 0; i < bps.length; i++) {

        // Reference breakpoint object
        var bp_obj = bps[i];

        // Create breakpoint visualization element
        var bp_elm = $('<div class="devgrid-bp-visu">');

        // Apply styles
        bp_elm
          .css({
            position: 'absolute',
            height: '100%',
            'border-right': '1px solid black',
            width: (last_bp == 0) ? 'calc(' + bp_obj.bp + ')' : 'calc(' + bp_obj.bp + ' - ' + last_bp + ')',
            left: (last_bp == 0) ? 'calc(' + bp_obj.bp + ' - ' + bp_obj.bp  + ')' : 'calc(' + last_bp  + ')'
          })
          .css(bp_obj.css);

        // Append element to grid
        vert_devgrid.append(bp_elm);

        // Create bp tag
        var bp_tag = $('<div class="devgrid-bp-tag">' + bp_obj.tag + '</div>');

        // Style tag
        bp_tag
          .css($.extend(this._defaults.numBoxStyle, this.options.numBoxStyle))
          .css({
            width: 'auto',
            'max-height': '24px',
            padding: '6px 4px',
            position: 'absolute',
            right: 0,
            top: 0
          });

        // Append tag
        bp_elm.append(bp_tag);

        // Update last breakpoint position value
        last_bp = bp_obj.bp;
      }
    }

    /*
     * CREATE - Controls and event handlers
     */

    // Create info box
    var info_box = $('<div class="devgrid-info-box">');

    // Do we show the major breakpoint visualization?
    var bp_visu = (this.options.breakpoints.length)
      ? '<div><input class="devgrid-control devgrid-control-toggle-bp-visu" type="checkbox" checked><strong> Toggle Breakpoints</strong></div>'
      : '';

    // Add elements to info box
    info_box.append(
      '<div class="devgrid-info-row devgrid-column-total"><strong>Breakpoints X:</strong> <span></span></div>' +
      '<div class="devgrid-info-row devgrid-row-total"><strong>Breakpoints Y:</strong> <span></span></div>' +
      '<div class="devgrid-info-row devgrid-window-width"><strong>Window X:</strong> <span></span></div>' +
      '<div class="devgrid-info-row devgrid-window-height"><strong>Window Y:</strong> <span></span></div>' +
      '<div class="devgrid-info-row devgrid-gutter-width"><strong>Gutter Size:</strong> <span></span></div>' +
      '<div class="devgrid-info-row devgrid-column-width"><strong>Unit Size:</strong> <span></span></div>' +
      '<div class="devgrid-info-row devgrid-grid-column-width"><strong>Unit Total Size:</strong> <span></span></div>' +
      '<div class="devgrid-info-row devgrid-grid-width"><strong>Grid Size:</strong> <span></span></div>' +
      '<div class="devgrid-info-row devgrid-active-breakpoint"><strong>Active Breakpoint:</strong> <span></span></div>' +
      '<div class="devgrid-controls">' +
        '<div>' +
          '<div><input class="devgrid-control devgrid-control devgrid-control-x-grid" type="checkbox" ' + (this.options.vertical ? 'checked' : '') + ' ><strong> X Grid</strong></div>' +
          '<div><input class="devgrid-control devgrid-control-y-grid" type="checkbox" ' + (this.options.horizontal ? 'checked' : '') + ' ><strong> Y Grid</strong></div>' +
          '<div><input class="devgrid-control devgrid-control-toggle-gutter" type="checkbox" ' + (this.options.toggleGutter ? 'checked' : '') + ' ><strong> Toggle Gutter</strong></div>' +
          bp_visu +
        '</div>' +
      '</div>'
    );

    // Apply info box styles
    info_box.css($.extend(this._defaults.infoBoxStyle, this.options.infoBoxStyle));

    // Append info box
    overlay_devgrid.append(info_box);

    // Initialize ghost grid tracking
    if (this.options.track) {

      // Append vertical ghost grid for breakpoint tracking
      var vert_ghostgrid = vert_devgrid.clone();
      vert_ghostgrid.attr('id', 'devgrid-ghostgrid-vert').css({left: -99999, display: 'block', 'z-index': -99999});
      plugin.elm.append(vert_ghostgrid);

      // Append horizontal ghost grid for breakpoint tracking
      var horz_ghostgrid = horz_devgrid.clone();
      horz_ghostgrid.attr('id', 'devgrid-ghostgrid-horz').css({left: -99999, display: 'block', 'z-index': -99999});
      plugin.elm.append(horz_ghostgrid);

      // Start tracking and attach tracking event
      this.trackBreakPoint.call(this.trackBreakPoint);
      $(window).on('resize', this.trackBreakPoint);
    }

    // Inclosure a window resize event to update info fields
    var updateInfoFields = function() {

      // Calculate info values
      var
        column_total_str        = plugin.options.columns,
        row_total_str           = column_total_str,
        window_width_str        = $(window).outerWidth() + 'px',
        window_height_str       = $(window).outerHeight() + 'px',
        gutter_width            = parseFloat(plugin.options.gutterWidth.match(/\d+([\/.]\d+)?/g)[0]),
        gutter_width_str        = plugin.options.gutterWidth,
        column_width            = parseFloat(plugin.options.columnWidth.match(/\d+([\/.]\d+)?/g)[0]),
        column_width_unit       = plugin.options.columnWidth.replace(/\d+([\/.]\d+)?/g, ''),
        column_width_str        = plugin.options.columnWidth,
        grid_size               = (gutter_width + column_width) * column_total_str + 'px',
        grid_width_str          = grid_size + ' x ' + grid_size,
        grid_column_width_str   = gutter_width + column_width + column_width_unit,
        active_breakpoints      = plugin.trackBreakPoint.call(plugin.trackBreakPoint),
        active_breakpoint_str   = 'X: '+ active_breakpoints[0] + '  ' + 'Y: ' + active_breakpoints[1];

      // Reference info value elements
      var
        column_total_elm        = info_box.find('.devgrid-column-total span'),
        row_total_elm           = info_box.find('.devgrid-row-total span'),
        window_width_elm        = info_box.find('.devgrid-window-width span'),
        window_height_elm       = info_box.find('.devgrid-window-height span'),
        column_width_elm        = info_box.find('.devgrid-column-width span'),
        gutter_width_elm        = info_box.find('.devgrid-gutter-width span'),
        grid_width_elm          = info_box.find('.devgrid-grid-width span'),
        grid_column_width_elm   = info_box.find('.devgrid-grid-column-width span'),
        active_breakpoint_elm   = info_box.find('.devgrid-active-breakpoint span');

      // Populate elements with values
      column_total_elm.html(column_total_str);
      row_total_elm.html(row_total_str);
      window_width_elm.html(window_width_str);
      window_height_elm.html(window_height_str);
      column_width_elm.html(column_width_str);
      gutter_width_elm.html(gutter_width_str);
      grid_width_elm.html(grid_width_str);
      grid_column_width_elm.html(grid_column_width_str);
      active_breakpoint_elm.html(active_breakpoint_str);
    };
    updateInfoFields();
    $(window).on('resize', updateInfoFields);

    // Display visualization only when instructed
    if (this.options.visible) {
      if (this.options.vertical) {
        vert_devgrid.css('display', 'block');
      }
      if (this.options.horizontal) {
        horz_devgrid.css('display', 'block');
      }
      overlay_devgrid.css('display', 'block');
    }

    // Handle show/hide toggle controls
    var handleDevgridToggleControls = function(e) {
      var
        target    = $(e.currentTarget),
        checked   = 0;

      // Show/hide X grid
      if (target.hasClass('devgrid-control-x-grid')) {
        checked = $('.devgrid-control-x-grid:checked').length;
        if (checked) {
          options.vertical = true;
          vert_devgrid.show();
        } else {
          options.vertical = false;
          vert_devgrid.hide();
        }
      }

      // Show/hide Y grid
      else if (target.hasClass('devgrid-control-y-grid')) {
        checked = $('.devgrid-control-y-grid:checked').length;
        if (checked) {
          options.horizontal = true;
          horz_devgrid.show();
        } else {
          options.horizontal = false;
          horz_devgrid.hide();
        }
      }

      // Toggle gutter location
      else if (target.hasClass('devgrid-control-toggle-gutter')) {
        checked = $('.devgrid-control-toggle-gutter:checked').length;
        if (checked) {
          $(element).devgrid($.extend({}, options, {toggleGutter: true}));
        } else {
          $(element).devgrid($.extend({}, options, {toggleGutter: false}));
        }
      }

      // Toggle breakpoint visualization
      else if (target.hasClass('devgrid-control-toggle-bp-visu')) {
        checked = $('.devgrid-control-toggle-bp-visu:checked').length;
        if (checked) {
          $('.devgrid-bp-visu').show();
        } else {
          $('.devgrid-bp-visu').hide();
        }
      }
    };
    $('.devgrid-control').on('click', handleDevgridToggleControls);
  };


  /**
   * Method used to update which breakpoints are currently active as the data attributes 'data-devgrid-x-breakpoint' and
   * 'data-devgrid-y-breakpoint' on the body.
   * @returns {Number} An array containing two numbers (the X and Y next breakpoints for columns and rows)
   */
  Plugin.prototype.trackBreakPoint = function() {

    // Identify columns in ghost grid
    var ghost_cols = $('#devgrid-ghostgrid-vert').find('.devgrid-col').filter(function(idx, elm) {
      return ($(elm).css('display') != 'none');
    });

    // Identify rows in ghost grid
    var ghost_rows = $('#devgrid-ghostgrid-horz').find('.devgrid-row').filter(function(idx, elm) {
      return ($(elm).css('display') != 'none');
    });

    // Identify and set column breakpoint on body
    var vert_breakpoint = ghost_cols.length;
    if (this.vert_breakpoint != vert_breakpoint) {
      this.vert_breakpoint = vert_breakpoint;
      $('body').attr('data-devgrid-x-breakpoint', this.vert_breakpoint);
    }

    // Identify and set row breakpoint on body
    var horz_breakpoint = ghost_rows.length;
    if (this.horz_breakpoint != horz_breakpoint) {
      this.horz_breakpoint = horz_breakpoint;
      $('body').attr('data-devgrid-y-breakpoint', this.horz_breakpoint);
    }

    return [this.vert_breakpoint, this.horz_breakpoint];
  };


  // Public methods
  var public_methods = {

    /**
     * Hide the devgrid
     */
    hide: function() {
      $('.devgrid').hide();
    },

    /**
     * Show the devgrid
     */
    show: function() {
      $('.devgrid').show();
    },

    /**
     * Toggle devgrid visibility
     */
    toggle: function() {
      if ($('.devgrid').css('display') == 'block') {
        public_methods.hide();
      } else {
        public_methods.show();
      }
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
