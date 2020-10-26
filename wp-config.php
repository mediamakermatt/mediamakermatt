<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'mediamk0_mediamakermatt' );

$actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]"; 
if (strpos($actual_link, 'mediamakermatt') !== false) {
	// PRODUCTION
	/** MySQL database username */
	define( 'DB_USER', 'mediamk0_mediamakermatt' );
	/** MySQL database password */
	define( 'DB_PASSWORD', 'Or!ch1maru20XX' );
	/** MySQL hostname */
	define( 'DB_HOST', 'localhost:3306' );
} else {
	// LOCAL
	/** MySQL database username */
	define( 'DB_USER', 'root' );
	/** MySQL database password */
	define( 'DB_PASSWORD', '' );
	/** MySQL hostname */
	define( 'DB_HOST', 'localhost' );
}

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '-]/,}Gw$1MO#Z3a>e&Bv0cA=!rc{ 8f}nu<AV:U`qcn]$EF;ZajWC`3Bao%dL)wR' );
define( 'SECURE_AUTH_KEY',  'nmR[bgF3o)O34OT!gd<+H>RBeY.z:- zd]aK#>v#Y(?H,:74M@;T=L@CHfbSB=Qm' );
define( 'LOGGED_IN_KEY',    '-P;omQv7a-$mgp~V}Ah~iI6P9BHr@Lql;:tT@h<F-IG0m?kr;OXrx]{Ye7%Od$^v' );
define( 'NONCE_KEY',        'P%@CBNNf^S.X:ln|AIrEQ9d8J%.Lx,[VEXB|a-79<n-NVk79$ZI!b&@0^-Ug>v)w' );
define( 'AUTH_SALT',        '@(nafzILRtm*c&]Y$r)M76Y[2izkJ/?kuV3 h%At&j2lT%z;OpKz&&P=VR+LjmI-' );
define( 'SECURE_AUTH_SALT', 'YnUlA=4H^hj+@pC{-YF5?UaGvyy=[h/$3,q,vJ_Ee`AB{sHz=m9Sur5Gm6cHV{[%' );
define( 'LOGGED_IN_SALT',   'd5*nx$1JY;h9hYWGTVwAs0W;5d}  2C4[ugk&E2OfelNtnbLjlZF` d*/OIB+j_C' );
define( 'NONCE_SALT',       ' {cmO].%SOuNxe}EqA{-vr.5%o0ZSRzHE)i@C;&! VLAwWz`Ud554jK6[l>6YZfv' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
