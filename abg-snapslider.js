/*
    abg-snapslider.js
    =================

    SnapSlider enhances a scrolling gallery of images, videos or other content with the ability to 
    snap to the nearest element boundary. It also enables paging, page lists and experimental zoom.

    Copyright (c) 2014 Anthony Williams. You may use SnapSlider under the terms of the MIT license.
    If you wish to remove this copyright notice or are concatenating and minifying your scripts you
    must include a copy of the LICENSE file, which can be found in this script's GitHub repository,
    somewhere on your website or in your software.
    
*/
+function ($) {


    //  SnapSlider Class Definition
    //  ===========================

    var SnapSlider = function (element, options) {
        this.$element               = $(element);
        this.$slider                = this.$element.find("[data-snapslider-slider]");
        this.$window                = $(window);

        this.element                = element;
        this.slider                 = this.$slider[0];
        this.options                = options;

        if (!this.slider) {
            console && console.warn && console.warn("SnapSlider could not find a [data-snapslider-slider] and has not been enabled.");
            return;
        }

        this.sliderWidth            = 
        this.sliderItemCount        = 
        this.sliderItemIndex        = 
        this.sliderItemIndexTrans   = 
        this.sliderItemWidth        = 
        this.sliderItemsShown       = 
        this.sliderScrollLeft       = 
        this.sliderScrollDirection  = 
        this.sliderScrollExcess     = 
        this.sliderScrollTarget     = 
        this.sliderSnapTimeout      = null;

        this.initialise();
    }

    SnapSlider.DEFAULTS = {
        //
        //  You can either change the items below in the script (pull requests that change these 
        //  with no good reason will be closed) or on a per-gallery basis by using the attribute
        //  as shown on the right of each option:
        //
        ssEnablePagination      : true,                      // data-ss-enable-pagination
        ssEnablePagelist        : true,                      // data-ss-enable-pagelist
        ssEnableZoom            : false,                     // data-ss-enable-zoom (experimental)
        ssEnableZoomtopage      : false,                     // data-ss-enable-zoomtopage (experimental)
        ssDisableKeyboardEvents : false,                     // data-ss-disable-keyboard-events
        ssActivated             : "ss--active",              // data-ss-activated
        ssPaginationActivated   : "ss--pagination-active",   // data-ss-pagination-activated
        ssPagelistActivated     : "ss--pagelist-active",     // data-ss-pagelist-activated
        ssZoomActivated         : "ss--zoom-active",         // data-ss-zoom-activated
        ssBaseClass             : "gallery",                 // data-ss-base-class
        ssElementSeparator      : "__",                      // data-ss-element-separator
        ssModifierSeparator     : "--",                      // data-ss-modifier-separator
        ssGroupingSeparator     : "-",                       // data-ss-grouping-separator
        ssPagerClass            : "pager",                   // data-ss-pager-class
        ssPagerNextModifier     : "next",                    // data-ss-pager-next-modifier
        ssPagerPrevModifier     : "prev",                    // data-ss-pager-prev-modifier
        ssPagerActiveModifier   : "active",                  // data-ss-pager-active-modifier
        ssPagelistClass         : "pagelist",                // data-ss-pagelist-class
        ssPagelistListElement   : "ul",                      // data-ss-pagelist-list-element
        ssPagelistItemElement   : "li",                      // data-ss-pagelist-item-element
        ssPagerContainerElement : "div",                     // data-ss-pager-container-element
        ssPagerElement          : "a",                       // data-ss-pager-element
        ssPagerInnerElement     : "span",                    // data-ss-pager-inner-element
        ssPagerPrevHtml         : "&lsaquo;",                // data-ss-pager-prev-html
        ssPagerNextHtml         : "&rsaquo;",                // data-ss-pager-next-html
        ssHiddenModifier        : "hidden",                  // data-ss-hidden-modifier
        ssZoomModifier          : "zoom",                    // data-ss-zoom-modifier
        ssAnimDuration          : 250,                       // data-ss-anim-duration
        ssScrollDelay           : 250,                       // data-ss-scroll-delay
        ssResizeDelay           : 100,                       // data-ss-resize-delay
        ssSnapTolerance         : 0.1                        // data-ss-snap-tolerance
    }


    //  Initialisation Functions
    //  ------------------------

    SnapSlider.prototype.initialise = function () {
        this.$sliderItems           = this.$slider.find("[data-snapslider-item]"); 
        this.sliderItemCount        = this.$sliderItems.length;
        this.sliderScrollLeft       = this.slider.scrollLeft;
        this.sliderScrollDirection  = 0;

        this.setItemWidth();

        this.$slider.on("scroll", $.proxy(this.scroll, this));
        this.$window.on("resize", $.proxy(this.resize, this));

        //  Initialise optional features
        this.options.ssEnablePagination          && this.enablePagination();
        this.options.ssEnablePagelist            && this.enablePagelist();
        this.options.ssEnableZoom                && this.enableZoom();
        !this.options.ssDisableKeyboardEvents    && this.enableKeyboardEvents();

        //  Snap the slider
        this.snap();

        //  Mark the slider as activated by adding a class
        this.$element.addClass(this.options.ssActivated);
    }


    SnapSlider.prototype.enablePagination = function () {
        //  Build the classnames
        var containerClass = this.options.ssBaseClass + this.options.ssElementSeparator + this.options.ssPagerClass + "s",
            pagerClass = this.options.ssBaseClass + this.options.ssElementSeparator + this.options.ssPagerClass;
        var pagerPrevClass = pagerClass + this.options.ssModifierSeparator + this.options.ssPagerPrevModifier,
            pagerNextClass = pagerClass + this.options.ssModifierSeparator + this.options.ssPagerNextModifier;

        //  Create the pager elements
        var pagerDiv = document.createElement(this.options.ssPagerContainerElement),
            pagerPrev = document.createElement(this.options.ssPagerElement),
            pagerNext = document.createElement(this.options.ssPagerElement);

        //  If the pager is an anchor element, set its href attribute
        if (this.options.ssPagerElement == "a") pagerPrev.href = pagerNext.href = "#";

        //  Set the classnames on the elements
        pagerDiv.className = containerClass;
        pagerPrev.className = pagerNext.className = pagerClass;
        pagerPrev.className += " " + pagerPrevClass;
        pagerNext.className += " " + pagerNextClass;

        // If the pagers require inner elements (we do in our examples), set them here
        if (this.options.ssPagerInnerElement) {
            var pagerPrevInner = document.createElement(this.options.ssPagerInnerElement),
                pagerNextInner = document.createElement(this.options.ssPagerInnerElement);
            pagerPrevInner.innerHTML = this.options.ssPagerPrevHtml;
            pagerNextInner.innerHTML = this.options.ssPagerNextHtml;
            pagerPrev.appendChild(pagerPrevInner);
            pagerNext.appendChild(pagerNextInner);
        }
        // Otherwise, just set the innerHTML of the pager elements themselves
        else {
            pagerPrev.innerHTML = this.options.ssPagerPrevHtml;
            pagerNext.innerHTML = this.options.ssPagerNextHtml;
        }

        //  We'll need to reference the individual pagers and set their visibility accordingly later
        this.$sliderPagerPrev = $(pagerPrev);
        this.$sliderPagerNext = $(pagerNext);

        //  Set the necessary functions and use $.proxy to bind them to `this`
        $(pagerPrev).on("click", $.proxy(function (e) { e.preventDefault(); this.paginate(-1); }, this));
        $(pagerNext).on("click", $.proxy(function (e) { e.preventDefault(); this.paginate(1); }, this));

        //  Add the pagers to the pager container, and then add the pager container to the slider
        pagerDiv.appendChild(pagerPrev);
        pagerDiv.appendChild(pagerNext);
        this.slider.parentNode.appendChild(pagerDiv);

        //  Set the visibility of the pagination links
        this.setPaginationVisibility();

        //  Mark pagination as activated on the slider by adding a class
        this.$element.addClass(this.options.ssPaginationActivated);
    }

    SnapSlider.prototype.enablePagelist = function () {
        //  Build the classnames
        var pagelistClass = this.options.ssBaseClass + this.options.ssElementSeparator + this.options.ssPagelistClass;
        var pagelistPagerClass = pagelistClass + this.options.ssGroupingSeparator + this.options.ssPagerClass;
        var pageListPagerContainerClass = pagelistPagerClass + "s";
        this.sliderPagelistPagerActiveClass = pagelistPagerClass + this.options.ssModifierSeparator + this.options.ssPagerActiveModifier;

        //  Create the pagelist
        var $pagelistContainer = $("<table class=\"" + pagelistClass + "\"><tr><td><" + this.options.ssPagelistListElement + " class=\"" + pageListPagerContainerClass + "\"></" + this.options.ssPagelistListElement + "></td></tr></table>");
        var $pagelist = $pagelistContainer.find(this.options.ssPagelistListElement);

        //  Create the pagelist pager elements
        for (var i = 0; i < this.sliderItemCount; i++) {
            var $pagelistItem = $("<" + this.options.ssPagelistItemElement + " class=\"" + pagelistPagerClass + "\"><" + this.options.ssPagerInnerElement + ">" + (i+1) + "</" + this.options.ssPagerInnerElement + "></" + this.options.ssPagelistItemElement + ">");
            $pagelistItem.on("click", $.proxy(this.goToPage, this, i));
            $pagelist.append($pagelistItem);
        }

        //  Add the Page List to the slider
        this.$pagelistItems = $pagelist.find("." + pagelistPagerClass);
        this.$slider.parent().append($pagelistContainer);

        //  Highlight the displayed (active) pages
        this.setPagelistItemVisibility();

        //  Mark the pagelist as activated on the slider by adding a class
        this.$element.addClass(this.options.ssPagelistActivated);
    }

    SnapSlider.prototype.enableZoom = function () {
        //
        //  A note, dear reader
        //  -------------------
        //  Zooming is very much a "use at your own risk" feature, which is why - by default - it
        //  is disabled and requires enabling either by changing the DEFAULTS value or by setting
        //  data-ss-enable-zoom="true" and data-ss-enable-zoomtopage="true" on your elements.
        //  
        //  Enabling zooming isn't a simple thing to do when coupling transitions, jQuery animate
        //  functions and the myriad timeout functions that we're using here. This implementation
        //  is far from perfect, but whilst it's jumpy and not what you'd expect, it works and it
        //  zooms into the item as requested.
        //  
        //  I would welcome pull requests that address these issues.
        //
        for (var i = 0; i < this.sliderItemCount; i++) {
            $(this.$sliderItems[i]).on("click", $.proxy(this.zoom, this, i));
        };

        //  In cases where transitions are used to zoom in and out (by default, we aren't using the
        //  jQuery.animate functions), we need to ensure that this.transition() is called, so as to 
        //  make sure that we perform operations as we do when the browser window is resized
        this.$slider.bind("webkitTransitionEnd oTransitionEnd otransitionend transitionend", $.proxy(this.transition, this));;

        //  Set ssIsZoomed based on whether or not the snapslider is zoomed by default using a class
        this.sliderZoomClass = this.options.ssBaseClass + this.options.ssModifierSeparator + this.options.ssZoomModifier;
        this.sliderZoomed = this.$element.hasClass(this.sliderZoomClass);

        //  All the initalisation required for the zooming is complete - add the activated class
        this.$element.addClass(this.options.ssZoomActivated);
    }

    SnapSlider.prototype.enableKeyboardEvents = function () {
        //  Set the tabindex of the main snapslider container element to 0 if it's not already set
        !$("[data-snapslider]").attr("tabindex") && $("[data-snapslider]").attr("tabindex", "0");

        this.$element.bind("keydown", $.proxy(this.keydown, this));
        this.$element.bind("keyup",   $.proxy(this.keyup,   this));
    }


    //  Event Functions 
    //  ---------------

    SnapSlider.prototype.scroll = function () {
        this.sliderScrollDirection = this.slider.scrollLeft > this.sliderScrollLeft ? 1 : -1;
        this.sliderScrollLeft = this.slider.scrollLeft;
        this.setSnapTimeout(this.options.ssScrollDelay);
    }

    SnapSlider.prototype.resize = function () {
        this.setItemWidth();
        this.setSnapTimeout(this.options.ssResizeDelay);
    }

    SnapSlider.prototype.transition = function () {
        this.sliderScrollLeft = this.slider.scrollLeft;
        this.setItemWidth();
        if (this.options.ssEnableZoomtopage) {
            this.goToPage(this.sliderItemIndexTrans);
        }
        else {
            this.snap();
        }
    }

    SnapSlider.prototype.keydown = function(e) {
        // We are only interested in left (37) and right (39) key presses - ignore everything else
        if (e.keyCode == 37 || e.keyCode == 39) {
            e.preventDefault();
        }
        else return;
    }

    SnapSlider.prototype.keyup = function(e) {
        // We are only interested in left (37) and right (39) key presses - ignore everything else
        if (e.keyCode == 37 || e.keyCode == 39) {
            this.goToPage(this.sliderItemIndex + (e.keyCode == 37 ? -1 : 1));
            e.preventDefault();
        }
        else return;
    }


    //  Setters
    //  -------

    SnapSlider.prototype.setItemWidth = function () {
        this.sliderItemWidth = this.slider.scrollWidth / this.sliderItemCount;
        this.sliderItemsShown = Math.round(this.slider.clientWidth / this.sliderItemWidth);
    }

    SnapSlider.prototype.setSnapTimeout = function (duration) {
        window.clearTimeout(this.sliderSnapTimeout);
        this.sliderSnapTimeout = window.setTimeout($.proxy(this.snap, this), duration);
    }

    SnapSlider.prototype.setPaginationVisibility = function () {        
        var classHidden = this.options.ssBaseClass + this.options.ssElementSeparator + this.options.ssPagerClass +this.options.ssModifierSeparator + this.options.ssHiddenModifier;

        if (this.sliderItemIndex <= 0) {
            this.$sliderPagerPrev.addClass(classHidden);
        }
        else {
            this.$sliderPagerPrev.removeClass(classHidden);
        }
        if (this.sliderItemIndex >= this.sliderItemCount - this.sliderItemsShown) {
            this.$sliderPagerNext.addClass(classHidden);
        }
        else {
            this.$sliderPagerNext.removeClass(classHidden);
        }
    }

    SnapSlider.prototype.setPagelistItemVisibility = function () {
        for (var i = 0; i < this.sliderItemCount; i++) {
            if (i >= this.sliderItemIndex && i < (this.sliderItemIndex + this.sliderItemsShown)) {
                $(this.$pagelistItems[i]).addClass(this.sliderPagelistPagerActiveClass);
            }
            else {
                $(this.$pagelistItems[i]).removeClass(this.sliderPagelistPagerActiveClass);
            }
        }
    }


    // Actions
    // -------

    SnapSlider.prototype.snap = function () {
        this.sliderItemIndex = this.sliderScrollLeft / this.sliderItemWidth;
        this.sliderScrollExcess = this.sliderItemIndex % 1;

        //  If there is no excess, we've already snapped, so there's nothing else to do
        if (this.sliderScrollExcess == 0) {
            this.options.ssEnablePagination && this.setPaginationVisibility();
            this.options.ssEnablePagelist   && this.setPagelistItemVisibility();
            return;
        }

        var targetItemIndex = this.sliderItemIndex;

        //  If the excess is within the tolerance level, snap to the nearest item
        if ((this.sliderScrollExcess < 0.5 && this.sliderScrollExcess <= this.options.ssSnapTolerance) || (this.sliderScrollExcess > 0.5 && this.sliderScrollExcess >= (1 - this.options.ssSnapTolerance))) {
            if (this.sliderScrollExcess < 0.5) {
                targetItemIndex = Math.floor(targetItemIndex);
            }
            else {
                targetItemIndex = Math.ceil(targetItemIndex);
            }
        }
        //  Otherwise, snap in the direction of travel
        else {
            targetItemIndex = Math.floor(targetItemIndex) + Math.max(0, this.sliderScrollDirection);
        }

        this.sliderItemIndex = targetItemIndex;
        this.animate();
        this.options.ssEnablePagination && this.setPaginationVisibility();
        this.options.ssEnablePagelist   && this.setPagelistItemVisibility();
    }

    SnapSlider.prototype.animate = function () {
        this.sliderScrollTarget = this.sliderItemWidth * this.sliderItemIndex;
        this.$slider.animate({ scrollLeft: this.sliderScrollTarget}, this.options.ssAnimDuration);
    }

    SnapSlider.prototype.paginate = function (direction) {
        this.goToPage(this.sliderItemIndex + (direction <= 0 ? -1 : 1));
    }

    SnapSlider.prototype.goToPage = function (itemIndex) {
        this.sliderItemIndex = Math.max(0, Math.min(this.sliderItemCount - this.sliderItemsShown, itemIndex));
        this.animate();
        this.options.ssEnablePagination && this.setPaginationVisibility();
        this.options.ssEnablePagelist   && this.setPagelistItemVisibility();
    }

    SnapSlider.prototype.zoom = function (itemIndex) {       

        // First of all, zoom in
        this.$element.toggleClass(this.sliderZoomClass);
        this.sliderZoomed = this.$element.hasClass(this.sliderZoomClass);
        this.setItemWidth();

        // If the experimental zoom to page setting is enabled, go to the page
        if (this.options.ssEnableZoomtopage) {
            this.sliderItemIndex = this.sliderItemIndexTrans = itemIndex;
            this.goToPage(itemIndex);
        }
        // Otherwise, just snap to the nearest item
        else {
            this.snap();
        }

    }


    //  SnapSlider Plugin Definition
    //  ============================

    var old = $.fn.slapSlider;


    $.fn.snapSlider = function (option) {
        return this.each(function () {
            var $this     = $(this);
            var data      = $this.data("abg.snapslider");
            var options   = $.extend({}, SnapSlider.DEFAULTS, $this.data(), typeof option == "object" && option);

            if (!data) {
                $this.data("abg.snapslider", (data = new SnapSlider(this, options)));  
            } 
            if (typeof option == "string") {
                data[option]();
            }
        });
    }


    $.fn.snapSlider.Constructor = SnapSlider;


    //  SnapSlider No Conflict
    //  ======================
      
    $.fn.snapSlider.noConflict = function () {
        $.fn.snapSlider = old;
        return this;
    }


    //  SnapSlider Data-API
    //  ===================

    $(function () {
        $("[data-snapslider]").each(function () {
            var $snapSlider = $(this);
            var option = $snapSlider.data("abg.snapslider") ? "initialise" : $snapSlider.data()
            $snapSlider.snapSlider(option);
        });
    });


}(jQuery);
