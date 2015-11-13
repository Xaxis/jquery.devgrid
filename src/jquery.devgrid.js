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
      toggleGutter: false,
      breakpoints: [],
      distributeGutter: false,
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
        float: 'left',
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
      plugin              = this,
      vert_devgrid        = $('<div class="devgrid devgrid-vert">'),
      overlay_devgrid     = $('<div class="devgrid devgrid-overlay">'),
      gutter_width        = parseFloat(this.options.gutterWidth.match(/\d+([\/.]\d+)?/g)[0]),
      gutter_width_unit   = this.options.gutterWidth.replace(/\d+([\/.]\d+)?/g, '');

    // Modify gutter width if distributed
    if (this.options.distributeGutter) {
      gutter_width = gutter_width / 2;
    }

    // Remove any previous devgrids
    $('.devgrid').remove();

    // Apply dev grid container styles
    vert_devgrid.css($.extend(this._defaults.gridStyle, this.options.gridStyle));
    overlay_devgrid.css($.extend(this._defaults.gridStyle, this.options.gridStyle));

    // Construct media queries
    this.createMediaQueries();

    // Create visual grid
    for (var i = 1; i <= this.options.columns; i++) {

      /*
       * CREATE - Grid columns
       */

      // Create number box
      var vert_number_box = $('<div class="devgrid-number-box">' + i + '</div>');

      // Apply number box styles
      vert_number_box.css($.extend(this._defaults.numBoxStyle, this.options.numBoxStyle));

      // Create column/gutter
      var column = $('<div class="devgrid-col devgrid-col' + i + '"></div>');
      var l_gutter = $('<div class="devgrid-gutter devgrid-l-gutter devgrid-gutter' + i + '">');

      // For distributed gutters create two gutters per column
      var r_gutter = (this.options.distributeGutter) ? $('<div class="devgrid-gutter devgrid-r-gutter">') : null;

      // Append number box to column
      column.append(vert_number_box);

      // Apply base styles to column and gutter
      column
        .css($.extend(this._defaults.columnStyle, this.options.columnStyle))
        .css({
          width: this.options.columnWidth
        });
      l_gutter
        .add(r_gutter)
        .css($.extend(this._defaults.gutterStyle, this.options.gutterStyle))
        .css({
          width: gutter_width + gutter_width_unit
        });

      // Distributed gutters
      if (this.options.distributeGutter) {
        vert_devgrid.append(l_gutter);
        vert_devgrid.append(column);
        vert_devgrid.append(r_gutter);
      }

      // Only toggle gutters when not distributed
      else {
        if (this.options.toggleGutter) {
          vert_devgrid.append(l_gutter);
          vert_devgrid.append(column);
        }
        else {
          vert_devgrid.append(column);
          vert_devgrid.append(l_gutter);
        }
      }
    }

    // Append the devgrids
    plugin.elm.append(vert_devgrid);
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

    // Do we show the toggle gutter option
    var toggle_gutter = (!options.distributeGutter)
      ? '<div><input class="devgrid-control devgrid-control-toggle-gutter" type="checkbox" ' + (this.options.toggleGutter ? 'checked' : '') + ' ><strong> Toggle Gutter</strong></div>'
      : '';

    // Add elements to info box
    info_box.append(
      '<div class="devgrid-info-row devgrid-column-total"><strong>Breakpoints X:</strong> <span></span></div>' +
      '<div class="devgrid-info-row devgrid-window-width"><strong>Window W:</strong> <span></span></div>' +
      '<div class="devgrid-info-row devgrid-viewport-width"><strong>Viewport W:</strong> <span></span></div>' +
      '<div class="devgrid-info-row devgrid-gutter-width"><strong>Gutter Size:</strong> <span></span></div>' +
      '<div class="devgrid-info-row devgrid-column-width"><strong>Unit Size:</strong> <span></span></div>' +
      '<div class="devgrid-info-row devgrid-grid-column-width"><strong>Unit Total Size:</strong> <span></span></div>' +
      '<div class="devgrid-info-row devgrid-active-breakpoint"><strong>Active Breakpoint:</strong> <span></span></div>' +
      '<div class="devgrid-controls">' +
      '<div>' +
      '<div><input class="devgrid-control devgrid-control devgrid-control-x-grid" type="checkbox" ' + (this.options.vertical ? 'checked' : '') + ' ><strong> X Grid</strong></div>' +
      toggle_gutter +
      '<div><input class="devgrid-control devgrid-control-distribute-gutter" type="checkbox" ' + (this.options.distributeGutter ? 'checked' : '') + ' ><strong> Distribute Gutter</strong></div>' +
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
      vert_ghostgrid.attr('id', 'devgrid-ghostgrid-vert').css({left: -99999, display: 'block', 'z-index': 99999});
      plugin.elm.append(vert_ghostgrid);

      // Start tracking and attach tracking event
      this.trackBreakPoint.call(this.trackBreakPoint);
      $(window).on('resize', this.trackBreakPoint);
    }

    // Rebuild media queries on screen resize for percentage gutters
    if (this.options.gutterWidth.match(/\%/)) {
      $(window).on('resize', function() {
        plugin.createMediaQueries.call(plugin);
      });
    }

    // Inclosure a window resize event to update info fields
    var updateInfoFields = function() {

      // Calculate info values
      var
        column_total_str        = plugin.options.columns,
        row_total_str           = column_total_str,
        window_width_str        = $(window).outerWidth() + 'px',
        viewport_width          = function() {
          var e = window, a = 'inner';
          if (!('innerWidth' in window )) {
            a = 'client';
            e = document.documentElement || document.body;
          }
          return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
        }().width,
        viewport_width_str      = viewport_width + 'px',
        gutter_width            = parseFloat(plugin.options.gutterWidth.match(/\d+([\/.]\d+)?/g)[0]),
        gutter_width_str        = plugin.options.gutterWidth,
        column_width            = parseFloat(plugin.options.columnWidth.match(/\d+([\/.]\d+)?/g)[0]),
        column_width_unit       = plugin.options.columnWidth.replace(/\d+([\/.]\d+)?/g, ''),
        column_width_str        = plugin.options.columnWidth,
        grid_column_width_str   = gutter_width + column_width + column_width_unit,
        active_breakpoint       = plugin.trackBreakPoint.call(plugin.trackBreakPoint),
        active_breakpoint_str   = active_breakpoint;

      // Reference info value elements
      var
        column_total_elm        = info_box.find('.devgrid-column-total span'),
        row_total_elm           = info_box.find('.devgrid-row-total span'),
        window_width_elm        = info_box.find('.devgrid-window-width span'),
        viewport_width_elm      = info_box.find('.devgrid-viewport-width span'),
        column_width_elm        = info_box.find('.devgrid-column-width span'),
        gutter_width_elm        = info_box.find('.devgrid-gutter-width span'),
        grid_column_width_elm   = info_box.find('.devgrid-grid-column-width span'),
        active_breakpoint_elm   = info_box.find('.devgrid-active-breakpoint span');

      // Populate elements with values
      column_total_elm.html(column_total_str);
      row_total_elm.html(row_total_str);
      window_width_elm.html(window_width_str);
      viewport_width_elm.html(viewport_width_str);
      column_width_elm.html(column_width_str);
      gutter_width_elm.html(gutter_width_str);
      grid_column_width_elm.html(grid_column_width_str);
      active_breakpoint_elm.html(active_breakpoint_str);
    };
    updateInfoFields();
    $(window).on('resize', updateInfoFields);

    // Display visualization only when instructed
    if (this.options.visible) {
      vert_devgrid.css('display', 'block');
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
          vert_devgrid.find('.devgrid-col, .devgrid-gutter').show();
        } else {
          options.vertical = false;
          vert_devgrid.find('.devgrid-col, .devgrid-gutter').hide();
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

      // Toggle gutter location
      else if (target.hasClass('devgrid-control-distribute-gutter')) {
        checked = $('.devgrid-control-distribute-gutter:checked').length;
        if (checked) {
          $(element).devgrid($.extend({}, options, {distributeGutter: true}));
          $('.devgrid-control-toggle-gutter').parent().hide();
        } else {
          $(element).devgrid($.extend({}, options, {distributeGutter: false}));
          $('.devgrid-control-toggle-gutter').parent().show();
        }
      }
    };
    $('.devgrid-control').on('click', handleDevgridToggleControls);
  };

  /**
   * Create media queries responsible for hiding visualization elements as well as tracking elements.
   */
  Plugin.prototype.createMediaQueries = function() {
    var
      styles                  = $('<style class="devgrid-styles">'),
      window_w                = $(window).outerWidth(),
      gutter_width            = parseFloat(this.options.gutterWidth.match(/\d+([\/.]\d+)?/g)[0]),
      column_width            = parseFloat(this.options.columnWidth.match(/\d+([\/.]\d+)?/g)[0]),
      column_width_total      = 0,
      column_break_point      = 0,
      column_indicator_bp     = 0;

    // Remove any previously created media queries
    $('.devgrid-styles').remove();

    // Determine the scroll bar width
    // @todo - When there is no scroll bar media queries fire out of line of the actual viewport width by the
    // missing scrollbar width. Determine how to account for this
    //var body_style              = document.body.currentStyle || window.getComputedStyle(document.body, ""),
    //    scroll_active           = body_style['overflow-y'] == 'hidden' ? false : true;
    //if (scroll_active) {
    //  var scroll_parent = $('<div style="width:50px; height:50px; overflow:auto"><div/></div>').appendTo('body');
    //  var scroll_child = scroll_parent.children();
    //  var scroll_width = scroll_child.innerWidth() - scroll_child.height(99).innerWidth();
    //  scroll_parent.remove();
    //}

    // Create media query grid
    for (var i = 1; i <= this.options.columns; i++) {

      // Calculate values differently based on unit (px vs. %)
      if (!this.options.gutterWidth.match(/\%/)) {
        column_width_total      = column_width + gutter_width;
        column_break_point      = parseFloat(column_width_total * i);
        column_indicator_bp     = column_break_point + column_width;
      } else {
        var perc_gutter_width   = (gutter_width / 100) * window_w;
        column_width_total      = column_width + perc_gutter_width;
        column_break_point      = parseFloat(column_width_total * i);
        column_indicator_bp     = column_break_point + column_width;
      }

      // Construct vertical column breakpoint indicator media query
      styles[0].textContent +=
        '@media only screen and (max-width: ' + (column_indicator_bp) + 'px) {\n' +
        ' .devgrid .devgrid-col' + i + ' {\n' +
        '   background: rgba(0, 255, 0, 0.3) !important;\n' +
        '   opacity: .5;\n' +
        '   transition: opacity 0.6s ease;\n' +
        ' }\n' +
        ' .devgrid .devgrid-col' + i + ' + .devgrid-gutter {\n' +
        '   background: rgba(0, 255, 255, 0.2) !important;\n' +
        ' }\n' +
        '}\n';

      // Construct vertical column breakpoint media query
      styles[0].textContent +=
        '@media only screen and (max-width: ' + (column_break_point) + 'px) {\n' +
        ' .devgrid .devgrid-col' + i + ', .devgrid .devgrid-gutter' + i + ' {\n' +
        '   z-index: -999;\n' +
        '   opacity: 0;\n' +
        '   transition: opacity 1s ease;\n' +
        ' }\n' +
        '}\n';
    }

    // Attach media queries
    $('head').append(styles);
  };

  /**
   * Method used to update which breakpoints are currently active as the data attribute 'data-devgrid-x-breakpoint'
   * @returns {Number} The number of the next breakpoint.
   */
  Plugin.prototype.trackBreakPoint = function() {

    // Identify columns in ghost grid
    var ghost_cols = $('#devgrid-ghostgrid-vert').find('.devgrid-col').filter(function(idx, elm) {
      return ($(elm).css('z-index') != '-999');
    });


    // Identify and set column breakpoint on body
    var vert_breakpoint = ghost_cols.length;
    if (this.vert_breakpoint != vert_breakpoint) {
      this.vert_breakpoint = vert_breakpoint;
      $('body').attr('data-devgrid-x-breakpoint', this.vert_breakpoint);
    }

    return this.vert_breakpoint;
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
