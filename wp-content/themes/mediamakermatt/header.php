<html>
    <head>
        <title>MediaMakerMatt</title>
        <link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Raleway:wght@100;400;600;900&display=swap">
        <script src="wp-content/themes/mediamakermatt/scripts/jquery.js"></script>
        <script src="wp-content/themes/mediamakermatt/scripts/light-dark-switch.js"></script>
    </head>
    <body>
        <div class="container">

            <div id="main_body">

                <header>
                    <div class="container">
                        <div class="row">
                            <div class="col flex-left">
                                <a href="/">
                                    <img class="header-logo header-logo-dark" src="wp-content\themes\mediamakermatt\images\header-logo-dark.png"/>
                                    <img class="header-logo header-logo-light" src="wp-content\themes\mediamakermatt\images\header-logo-light.png"/>
                                </a>
                                <div class="day-night-switch">
                                    <div class="btn-container">
                                        <i class="fa fa-sun-o" aria-hidden="true"></i>
                                        <label class="switch btn-color-mode-switch">
                                            <input type="checkbox" name="color_mode" id="color_mode" value="0">
                                            <label for="color_mode" data-on="Light" data-off="Dark" class="btn-color-mode-switch-inner"></label>
                                        </label>
                                        <i class="fa fa-moon-o" aria-hidden="true"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col flex-right">
                                <ul>
                                    <a href="/test-page-1/"><li>Test Page 1</li></a>
                                    <a href="/test-page-2/"><li>Test Page 2</li></a>
                                    <a href="/test-page-3/"><li>Test Page 3</li></a>
                                </ul>
                            </div>
                        </div>
                    </div>
                </header>