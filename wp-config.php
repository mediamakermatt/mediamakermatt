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
define( 'DB_NAME', 'mediamakermatt_localhost' );

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
define( 'AUTH_KEY',         '$*+a2AJ$gH|6]f2~={cpkygdH532c-.oWb|gZH63%lh(PXvk_&rr}vFEQ*M14-~m' );
define( 'SECURE_AUTH_KEY',  '?3Mg_;]1xmr xq3FbvOBvsU>5Q;3 O@jFh;0-DzTTtmwqf}B5EtS-pbw$Z^)Pcnl' );
define( 'LOGGED_IN_KEY',    'wG7jz,)la&WS8tQ,yc)q$/g[VQ2JP25Z0#HJ?:.gcZT)f/JT7n% Z5vB-};F?E+e' );
define( 'NONCE_KEY',        '7LK~q9!krRZt?.+vfc- J)=>B7,$fozy661ZMjAh>p 7cYAC~+na;Wt<|H.CL;>Z' );
define( 'AUTH_SALT',        '8NkJxB`7L<b0Df@VhY]RR(:@0-u72*KvhOxkZnW0$U7(7`b9l@]jw a}X7r9{Q~:' );
define( 'SECURE_AUTH_SALT', '~z#;=9<ccdR*dF.d;8h88,Ur3qo.Z3vJ!!!wXNF^hfc$YcfNVX*n6Mp[FV)#m_:?' );
define( 'LOGGED_IN_SALT',   'd,K^yP!Lv <25[M3~S 1 ?(CPNyHZ]l(85QCWtSp-|-MP5A12uii7?UK>8hj0?8;' );
define( 'NONCE_SALT',       ':Pm%#v$$p6W.Y=Y5bD{ 39M(,mckEDqw$GU8,hCcuwSyQN^$yzRCmkB@Cq`k&ut%' );

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
