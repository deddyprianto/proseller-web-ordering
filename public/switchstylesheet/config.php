<!-- For demo purposes – can be removed on production -->
<div id="config" class="config">
    <div id="config_wrapper">
        <?php $demo_url = 'http://transvelo.github.io/pizzaro-html/'; ?>
        <div id="config_container">
            <div class="style-main-title">Style Selector</div>
            <div class="box-title">Choose Home &#038; Static Pages</div>
            <div class="input-box">
                <div class="input">
                    <select id="home-pages" name="home_page">
                        <option value="">Choose</option>
                        <option value="<?php echo $demo_url; ?>home.html">Home v1</option>
                        <option value="<?php echo $demo_url; ?>home-v2.html">Home v2</option>
                        <option value="<?php echo $demo_url; ?>home-v3.html">Home v3</option>
                        <option value="<?php echo $demo_url; ?>home-v3-full-color.html">Home v3 Full Color</option>
                        <option value="<?php echo $demo_url; ?>about.html">About</option>
                        <option value="<?php echo $demo_url; ?>cart.html">Cart</option>
                        <option value="<?php echo $demo_url; ?>contact-v1.html">contact-v1</option>
                        <option value="<?php echo $demo_url; ?>contact-v2.html">contact-v2</option>
                        <option value="<?php echo $demo_url; ?>faq.html">FAQ</option>
                        <option value="<?php echo $demo_url; ?>store-directory.html">Store Directory</option>
                        <option value="<?php echo $demo_url; ?>terms-and-conditions.html">Terms and Conditions</option>
                        <option value="<?php echo $demo_url; ?>404.html">404</option>
                    </select>
                </div>
            </div>

            <div class="box-title">Choose Ecommerce Page</div>
            <div class="input-box">
                <div class="input">
                    <select id="demo-pages" name="demo-shop">
                        <option value="">Choose</option>
                        <option value="<?php echo $demo_url; ?>shop.html">Shop</option>
                        <option value="<?php echo $demo_url; ?>cart.html">Cart</option>
                        <option value="<?php echo $demo_url; ?>checkout.html">Checkout</option>
                        <option value="<?php echo $demo_url; ?>my-account.html">My Account</option>
                        <option value="<?php echo $demo_url; ?>compare.html">Compare</option>
                        <option value="<?php echo $demo_url; ?>wishlist.html">Wishlist</option>
                    </select>
                </div>
            </div>

            <div class="box-title">Choose Blog Style</div>
            <div class="input-box">
                <div class="input">
                    <select id="header-style" name="header">
                        <option value="">Choose</option>
                        <option value="<?php echo $demo_url; ?>blog-v1.html">Blog v1</option>
                        <option value="<?php echo $demo_url; ?>blog-v2.html">Blog v2</option>
                        <option value="<?php echo $demo_url; ?>blog-v3.html">Blog v3</option>
                        <option value="<?php echo $demo_url; ?>blog-single.html">Blog Single Post</option>
                        <option value="<?php echo $demo_url; ?>blog-fw.html">Blog Full Width</option>
                    </select>
                </div>
            </div>

            <div class="box-title">Choose Shop Pages</div>
            <div class="input-box">
                <div class="input">
                    <select id="shop-style" name="shop-style">
                        <option value="">Choose</option>
                        <option value="<?php echo $demo_url; ?>shop.html">Shop Grid</option>
                        <option value="<?php echo $demo_url; ?>shop.html#grid-extended">Shop Extended</option>
                        <option value="<?php echo $demo_url; ?>shop.html#list-view">Shop List View</option>
                        <option value="<?php echo $demo_url; ?>shop.html#list-view-small">Shop List View Small</option>
                        <option value="<?php echo $demo_url; ?>shop-fw.html">Shop Full Width</option>
                        <option value="<?php echo $demo_url; ?>shop-right-side-bar.html">Shop Right Sidebar</option>
                    </select>
                </div>
            </div>

            <div class="box-title">Choose Single Product Pages</div>
            <div class="input-box">
                <div class="input">
                    <select id="single-products" name="single-product">
                        <option value="">Choose</option>
                        <option value="<?php echo $demo_url; ?>single-product.html">Single Product</option>
                        <option value="<?php echo $demo_url; ?>single-product-extended.html">Single Product Extended</option>
                        <option value="<?php echo $demo_url; ?>single-product-sidebar.html">Single Product Sidebar</option>
                    </select>
                </div>
            </div>

            <div class="box-title">Choose Product Category </div>
            <div class="input-box">
                <div class="input">
                    <select id="product-category-col" name="product-category">
                        <option value="">Choose</option>
                        <option value="<?php echo $demo_url; ?>cat-3-col.html">3 Column Sidebar</option>
                        <option value="<?php echo $demo_url; ?>cat-4-col.html">4 Column Sidebar</option>
                        <option value="<?php echo $demo_url; ?>cat-4-fw.html">4 Column Full width</option>
                        <option value="<?php echo $demo_url; ?>product-category-6-column.html">6 Columns Full width</option>
                        <option value="<?php echo $demo_url; ?>shop-fw.html">Shop Full Width</option>
                    </select>
                </div>
            </div>

            <div class="box-title">Colors</div>
            <div id="colors" class="colors">
                <a class="changecolor green" href="#" title="Green color">Green</a>
                <a class="changecolor pink" href="#" title="Pink color">Pink</a>
                <a class="changecolor gold" href="#" title="Gold color">Gold</a>
                <a class="changecolor blue" href="#" title="Blue color">Blue</a>
                <a class="changecolor red" href="#" title="Red color">Red</a>
                <a class="changecolor orange" href="#" title="Orange color">Orange</a>
                <a class="changecolor navy" href="#" title="Navy color">Orange</a>
                <a class="changecolor flat-blue" href="#" title="Flat Blue color">Flat Blue</a>
            </div>
            <div class="box-title-text"><strong>Tons</strong> of customization you can do through Sass...</div>
        </div>
    </div>

    <div class="style-toggle open"><i class="fa fa-cog"></i></div>
</div>
<!-- For demo purposes – can be removed on production : End -->
