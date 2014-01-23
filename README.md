# SnapSlider

SnapSlider enhances a scrolling gallery of images, videos or other content with the ability to snap to the nearest element boundary. It also enables paging, page lists and zooming, with an experimental zoom to page feature.


## Usage

SnapSlider works using data-attributes. All you need to do is include the script in your page, and SnapSlider will automatically enhance any gallery element which is marked up with a `data-snapslider` attribute.

Your gallery should follow the basic pattern shown below:

```html
<div class="gallery" data-snapslider>
    <div class="gallery__slider" data-snapslider-slider>
        <ul class="gallery__items">
            <li class="gallery__item" data-snapslider-item>
                <!-- Your content goes here -->
            </li>
        </ul>
    </div>
</div>
```

You can visit [the example page][example] for a demonstration, created using an extended version of the pattern as shown above. You can use the [HTML][html] and basic [CSS][css] from the demonstration pages as a base to get you up and running with a basic snapslider.

[example]: http://abitgone.github.io/snapslider/
[html]: //github.com/abitgone/snapslider/blob/gh-pages/index.html
[css]:  //github.com/abitgone/snapslider/blob/gh-pages/snapslider.css


## Options

SnapSlider is configured through the use of data attributes. Simply apply these to the same element you add `data-snapslider`. It is important to remember that SnapSlider does not watch the data attributes. If you change the value of the data-attributes after SnapSlider has been initialised, the new values will not be reflected.

You can use the following options to change the behaviour of SnapSlider:

Data Attribute                    | Description
:---------------------------------|:---------------------------------------------------------------------------
`data-ss-enable-pagination`       | Set to `false` to disable pagination.
`data-ss-enable-pagelist`         | Set to `false` to disable the page list at the bottom of the slider.
`data-ss-enable-zoom`             | Set to `true` to enable the experimental zoom features.
`data-ss-enable-zoomtopage`       | Set to `true` to enable the experimental zoom-to-page features.
`data-ss-disable-keyboard-events` | Set to `true` to disable keyboard events.

The zoom and zoom-to-page features are largely experimental and may not function as you require. Pull requests around the zoom functionality are welcomed.

Data Attribute                    | Default Value | Description
:---------------------------------|:--------------|:-----------------------------------------------------------
`data-ss-anim-duration`           | 250 (ms)      | Duration of the snap/paging animation
`data-ss-scroll-delay`            | 250 (ms)      | Delay between scroll finishing and the snap event firing
`data-ss-resize-delay`            | 100 (ms)      | Delay between resize finishing and the snap event firing

SnapSlider applies classnames to the target element when it is activated. You can change the default values by using the following data-attributes:

Data Attribute                    | Default Value
:---------------------------------|:---------------------------------------------------------------------------
`data-ss-activated`               | `ss--active`
`data-ss-pagination-activated`    | `ss--pagination-active`
`data-ss-pagelist-activated`      | `ss--pagelist-active`
`data-ss-zoom-activated`          | `ss--zoom-active`

By default, SnapSlider uses `&lsaquo;` and `&rsaquo;` for the page controls. These can be overridden by using `data-ss-pager-prev-html` and `data-ss-pager-next-html`.

If you wish to configure other aspects of SnapSlider, take a look at the `SnapSlider.DEFAULTS` object in [abg-snapslider.js][js].

[js]: /abg-snapslider.js


## License

You may use SnapSlider under the terms of the [MIT Licence][license].

[license]: http://abitgone.mit-license.org/2014
