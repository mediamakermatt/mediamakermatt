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
define( 'DB_NAME', 'mediamakermatt' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define( 'DB_PASSWORD', '' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

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
define( 'AUTH_KEY',         'h73lV2mCzS)R#rhF{/dh;VEuhD^`KYP0/SE,+<TK3~<8LiS9#FsXn[2sk{_nv&o_' );
define( 'SECURE_AUTH_KEY',  '5VMVu]]sx/bE,hH2~ewx&x&5/[box._nxUz4}[qOyOtmzn)2f2l|:8l+ROQ).j,-' );
define( 'LOGGED_IN_KEY',    'rv<_Vi,3C_? UnRFg?3NT^zXWxfi_#}aO7*:-aL|uxpakW`!=&<~j<UZ*lrRb?z[' );
define( 'NONCE_KEY',        'eqOB(c&Yz]qJgJ#YnfdX<;_BR-&H:[-D`9zGlQr%HHJyd@9(#wdl08dFTv(xMvoh' );
define( 'AUTH_SALT',        'DiI*@.O*q:oTz+FV_]h9cHVlfyKp==]!@v#dg,fJskJsKe4/s? `an?4FDD@haP$' );
define( 'SECURE_AUTH_SALT', 'onT,NsM/Y6PyE/6_@at0<S_I^TJ~T^Hg+t,Sg,::|ENH1D 6e~t9fzX?aV5k2y(r' );
define( 'LOGGED_IN_SALT',   '!y+(xNOza,4H5[;QwF&05o}:IZ;vQpkA2nxDWHg)4=/Ec]qsU0|Sy; rNc@@uc{F' );
define( 'NONCE_SALT',       'UA]nbdKO1@|j1Hn/):!~]:HX>{34T*H^oEyCK{sGw44neQKs5Uni Vw_8L$^*Nu;' );

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
