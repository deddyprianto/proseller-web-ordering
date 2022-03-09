function hexToRGB(h, o = null) {
  let r = 0,
    g = 0,
    b = 0;
  if (h.length === 4) {
    r = '0x' + h[1] + h[1];
    g = '0x' + h[2] + h[2];
    b = '0x' + h[3] + h[3];
  } else if (h.length === 7) {
    r = '0x' + h[1] + h[2];
    g = '0x' + h[3] + h[4];
    b = '0x' + h[5] + h[6];
  }

  if (o) return 'rgba(' + +r + ',' + +g + ',' + +b + ',' + +o + ')';
  return 'rgb(' + +r + ',' + +g + ',' + +b + ')';
}

const menuCategoriesTop = '0px';

const styles = {
  '@global': {
    button: { backgroundColor: (e) => e.theme.color.primary },
    '.button, #scrollUp, .header-v1, .header-v2, .header-v3, .header-v4, .header-v5, .added_to_cart, input[type="reset"], input[type="submit"], input[type="button"], .dark .create-your-own a, .owl-dots .owl-dot.active, .pizzaro-handheld-footer-bar, .widget_nav_menu .menu li:hover, .related > h2:first-child:after, .upsells > h2:first-child:after, .widget_nav_menu .menu li::after, .section-products .section-title:after, .pizzaro-handheld-footer-bar ul li > a, .banners .banner .caption .banner-price, .section-tabs .nav .nav-item.active a::after, .products-with-gallery-tabs.section-tabs .nav, .section-recent-post .post-info .btn-more:hover, .section-sale-product .price-action .button:hover, .list-no-image-view ul.products li.product::before, .woocommerce-account .customer-login-form h2::after, .section-coupon .caption .coupon-info .button:hover, .page-template-template-homepage-v2 .header-v2.stuck, .woocommerce-cart .pizzaro-order-steps ul .cart .step, .list-no-image-cat-view ul.products li.product::before, .pizzaro-handheld-footer-bar ul li.search .site-search, .widget.widget_price_filter .ui-slider .ui-slider-handle, .list-no-image-view .products .owl-item > .product::before, .list-no-image-view ul.products li.product .button:hover, .woocommerce-checkout .pizzaro-order-steps ul .cart .step, .woocommerce-cart .cart-collaterals + .cross-sells h2::after, .footer-v1.site-footer .site-address .address li + li::before, .list-no-image-cat-view ul.products li.product .button:hover, .header-v4.lite-bg .primary-navigation .menu > li > a::before, .woocommerce-checkout .pizzaro-order-steps ul .checkout .step, .kc-section-tab.kc_tabs .kc_tabs_nav > .ui-tabs-active > a::after, .list-no-image-view .products .owl-item > .product .button:hover, .page-template-template-homepage-v6 .footer-social-icons ul li a:hover, .list-view.left-sidebar.columns-1 ul.products li.product .button:hover, .products-card .media .media-left ul.products li.product .button:hover, .products-card .media .media-right ul.products li.product .button:hover, .page-template-template-homepage-v6 .primary-navigation > ul > li:hover, .list-view.right-sidebar.columns-1 ul.products li.product .button:hover, .page-template-template-homepage-v6 .secondary-navigation .menu li:hover, .page-template-template-homepage-v6 .secondary-navigation .menu li::after, .page-template-template-homepage-v6 .main-navigation ul.menu ul li:hover > a, .list-view.left-sidebar.columns-1 .products .owl-item > .product .button:hover, .list-view.right-sidebar.columns-1 .products .owl-item > .product .button:hover, .woocommerce-order-received.woocommerce-checkout .pizzaro-order-steps ul .step, .page-template-template-homepage-v6\n  .main-navigation\n  ul.nav-menu\n  ul\n  li:hover\n  > a, .page-template-template-homepage-v2\n  .products-with-gallery-tabs.section-tabs\n  .nav, .stretch-full-width .store-locator .store-search-form form .button, .banner.social-block .caption .button:hover, .wpsl-search #wpsl-search-btn, .lite-bg.header-v4 .primary-navigation .menu .current-menu-item > a::before':
      {
        backgroundColor: (e) => e.theme.color.primary,
        color: (e) => e.theme.color.textButtonColor,
      },
    '.custom .tp-bullet.selected, .home-v1-slider .btn-primary, .home-v2-slider .btn-primary, .home-v3-slider .btn-primary, .products-with-gallery-tabs.kc_tabs > .kc_wrapper > .kc_tabs_nav, .products-with-gallery-tabs.kc_tabs .kc_tabs_nav li.ui-tabs-active a::after':
      {
        backgroundColor: (e) => e.theme.color.primary,
      },
    '.lite-bg.header-v4 .pizzaro-logo, .lite-bg.header-v3 .pizzaro-logo, .site-footer.footer-v5 .pizzaro-logo, .site-footer.footer-v4 .footer-logo .pizzaro-logo, .page-template-template-homepage-v4 .header-v3 .pizzaro-logo, .page-template-template-homepage-v6 .header-v1 .site-branding .pizzaro-logo, .page-template-template-homepage-v6 .header-v2 .site-branding .pizzaro-logo, .page-template-template-homepage-v6 .header-v3 .site-branding .pizzaro-logo, .page-template-template-homepage-v6 .header-v4 .site-branding .pizzaro-logo, .page-template-template-homepage-v6 .header-v5 .site-branding .pizzaro-logo, .page-template-template-homepage-v6 .header-v6 .site-branding .pizzaro-logo':
      {
        fill: (e) => e.theme.color.primary,
      },
    '.section-events .section-title, .section-product-categories .section-title, .section-products-carousel-with-image .section-title, .section-product .product-wrapper .product-inner header .sub-title, .section-recent-post .post-info .btn-more, .section-coupon .caption .coupon-code, .widget_layered_nav li:before, .product_list_widget .product-title, .product_list_widget li > a, #payment .payment_methods li label a:hover, article.post.format-link .entry-content p a, .page-template-template-contactpage .store-info a':
      {
        color: (e) => e.theme.color.primary,
      },
    '.section-recent-posts .section-title, .terms-conditions .entry-content .section.contact-us p a':
      {
        color: '#7c0619',
      },
    'button, input[type="button"], input[type="reset"], input[type="submit"], .button, .added_to_cart, .section-sale-product .price-action .button:hover, .section-recent-post .post-info .btn-more, .section-recent-post .post-info .btn-more:hover, .section-coupon .caption .coupon-info .button:hover, .widget.widget_price_filter .ui-slider .ui-slider-handle:last-child, #order_review_heading::after, #customer_details .woocommerce-billing-fields h3::after, #customer_details .woocommerce-shipping-fields h3::after, .woocommerce-cart .pizzaro-order-steps ul .cart .step, .woocommerce-checkout .pizzaro-order-steps ul .checkout .step, .page-template-template-homepage-v6 .footer-social-icons ul li a:hover, .woocommerce-order-received.woocommerce-checkout\n  .pizzaro-order-steps\n  ul\n  .complete\n  .step, .cart-collaterals h2::after, .widget_nav_menu .menu li:hover a, .page-template-template-contactpage .contact-form h2:after, .page-template-template-contactpage .store-info h2:after, .banner.social-block .caption .button:hover, #byconsolewooodt_checkout_field h2::after':
      {
        borderColor: (e) => e.theme.color.primary,
        color: (e) => e.theme.color.textButtonColor,
      },
    '.pizzaro-order-steps ul .step': {
      borderColor: (e) => e.theme.color.primary,
    },
    '.button:hover, .added_to_cart:hover, #respond input[type="submit"], input[type="button"]:hover, input[type="reset"]:hover, input[type="submit"]:hover, .dark .create-your-own a:hover, .wc-proceed-to-checkout .button, .main-navigation ul.menu ul a:hover, .main-navigation ul.menu ul li:hover > a, .main-navigation ul.nav-menu ul a:hover, .main-navigation ul.nav-menu ul li:hover > a, .main-navigation div.menu ul.nav-menu ul a:hover, .main-navigation div.menu ul.nav-menu ul li:hover > a, .stretch-full-width .store-locator .store-search-form form .button:hover':
      {
        backgroundColor: (e) => hexToRGB(e.theme.color.primary, 0.8),
        color: (e) => e.theme.color.textButtonColor,
      },
    '#respond input[type="submit"]:hover': {
      backgroundColor: (e) => hexToRGB(e.theme.color.primary, 0.8),
      color: (e) => e.theme.color.textButtonColor,
    },
    '@media (max-width: 1025px)': {
      '.page-template-template-homepage-v5 .header-v5': {
        backgroundColor: (e) => e.theme.color.primary,
      },
    },
    '.modal-dialog-centered': {
      display: 'flex',
      fallbacks: [{ display: '-ms-flexbox' }],
      msFlexAlign: 'center',
      alignItems: 'center',
      minHeight: 'calc(80% - 1rem)',
    },
    '.modal-title': { color: (e) => e.theme.color.primary },
    'button.close.btn-close-modal-product': {
      backgroundColor: (e) => e.theme.color.primary,
    },
    '.use-select': {
      backgroundColor: (e) => e.theme.color.primary,
      width: '50%',
      fontSize: '12',
      height: '40',
      borderRadius: '0',
    },
    '.un-select': {
      backgroundColor: '#D0D0D0',
      width: '50%',
      fontSize: '12',
      height: '40',
      borderRadius: '0',
      color: (e) => e.theme.color.primary,
    },
    '.border-ordering-mode': {
      borderColor: (e) => e.theme.color.secondary,
      borderStyle: 'solid',
      borderWidth: 'thin',
    },
    '.border-theme': {
      borderColor: (e) => e.theme.color.primary,
      borderWidth: '1',
      borderStyle: 'solid',
      color: (e) => e.theme.color.primary,
    },
    '.profile-dashboard, .select-gender': {
      backgroundColor: (e) => e.theme.color.primary,
      color: (e) => e.theme.color.textButtonColor,
    },
    '.navigation-theme': {
      backgroundColor: (e) => e.theme.color.navigationColor,
    },
    '.un-select-gender': { backgroundColor: '#F0F0F0', color: 'gray' },
    '.customer-group-name': { color: (e) => e.theme.color.primary },
    '.transparent-backgroud': { backgroundColor: 'rgba(192, 10, 39, 0.8)' },
    '.color': { color: (e) => e.theme.color.primary },
    '.color-active': { color: (e) => e.theme.color.primary },
    '.color-nonactive': { color: (e) => e.theme.color.font },
    '.text-warning-theme': { color: (e) => e.theme.color.textWarningColor },
    '.text-btn-theme, button, .button': {
      color: (e) => e.theme.color.textButtonColor,
      borderRadius: 5,
      padding: 0,
    },
    '.background-theme, .header-modifier, .styles_modal__-5Oi3, .list-view.columns-2 ul.products li.product, .modal-content, .pizzaro-handheld-footer-bar, .styles_phoneCountryCode__3IXI3, .styles_phoneCountryCode__ZedHA, .close':
      {
        backgroundColor: (e) => e.theme.color.background,
        color: (e) => e.theme.color.font,
      },
    ".font-color-theme, [class*=' po-']:before, .header-v4 .primary-navigation .current-menu-item > a, .menu-item":
      {
        color: (e) => e.theme.color.font,
      },
    '.react-calendar__navigation button, .react-calendar__tile, .react-calendar__month-view__weekdays__weekday':
      {
        color: (e) => 'gray',
      },
    'button.react-calendar__tile.react-calendar__tile--active.react-calendar__tile--range':
      {
        background: (e) => e.theme.color.primary,
        color: (e) => e.theme.color.textButtonColor,
      },
    'button.react-calendar__tile.react-calendar__tile--now.react-calendar__month-view__days__day':
      {
        background: (e) => '#F0F0F0',
      },
    '.menu-category': {
      width: 'auto',
      zIndex: 50,
      left: 0,
      right: 0,
      marginTop: (e) => {
        if (e.theme.withBanners) {
          return 0;
        }
        return 100;
      },
    },
    '.menu-category > .categories': {
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: '#D0D0D0',
    },
    'ul.menu-category.relative-position': {
      position: 'relative',
      marginLeft: 0,
    },
    'ul.menu-category.sticky': {
      position: 'fixed',
      left: '130px',
      right: '130px',
      top: (e) => {
        if (e.theme.withBanners) {
          return 80;
        }
        return -20;
      },
    },
    'ul.menu-category .menu-item': {
      whiteSpace: 'nowrap',
      fontSize: 18,
      padding: 10,
      fontWeight: 'bold',
      backgroundColor: '#D0D0D0',
      color: 'white',
    },
    '.menu-category .menu-item.active': {
      backgroundColor: (e) => e.theme.color.primary,
      color: 'white',
    },
    '.nav-buttons-page': {
      flexDirection: 'row',
      position: 'fixed',
      zIndex: 50,
      width: '100%',
      top: '8rem',
      left: '0',
      '& a, button': {
        height: 40,
        fontSize: '2rem',
      },
    },
    '.pizzaro-handheld-footer-bar': {
      backgroundColor: (e) => e.theme.color.secondary,
      color: (e) => e.theme.color.textButtonColor,
      zIndex: 102,
    },
    '#product-catalog': {
      paddingTop: 0,
    },
    '@media (max-width: 750px)': {
      '.menu-category': {
        width: '100vw',
        marginTop: 100,
      },
      '.menu-category > .categories': {
        overflowX: 'scroll',
      },
      'ul.menu-category.relative-position': {
        position: 'absolute',
        top: (e) => {
          if (e.theme.withBanners) {
            return 20;
          }
          return -20;
        },
      },
      'ul.menu-category.sticky': {
        width: 'auto',
        right: 0,
        left: 0,
        top: -20,
      },
      '#product-catalog': {
        paddingTop: (e) => {
          if (e.theme.withBanners) {
            return 60;
          }
          return 140;
        },
      },
    },
  },
};
export default styles;
