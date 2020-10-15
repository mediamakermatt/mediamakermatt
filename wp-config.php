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
define( 'AUTH_KEY',         'mC>LSUgV$Qe]/iH<j0k;BUY6></wU:8Q5W(OJVTI/~hT<H[10dF~tT0#lpzSeyIk' );
define( 'SECURE_AUTH_KEY',  'nas(1f+k~!X@H:}K`G98i%<MxV/hOOY QA+8]{{?LdSWo8=+,&#pXC*I]tX$zJY:' );
define( 'LOGGED_IN_KEY',    'Jwp<X1hhg]xCEBxNprQ|.W%s#b%|pp4pzINl6$Ijl+Dzdx:+fbJN4_L@l;X5?j^n' );
define( 'NONCE_KEY',        '&9OWLH47)8H+V_-B)4!EBP)} s5JpNMD[y2{<Zb%+G1r>azbg`z1Gto%iPFPl:$.' );
define( 'AUTH_SALT',        'reLQ1{rI;S<rTGxS7sPyCjnZAcPa9|j+!u$QCV$lQFki%O%m/l{/h6,u3K4=WFFZ' );
define( 'SECURE_AUTH_SALT', 'qC,Pu&WW&2$q_v{p|uR.L!57WY2cEog:N^OT 6+4d1^C`&LmP6K}60U*]^2R4mx+' );
define( 'LOGGED_IN_SALT',   '(quo,Uh+L4d&8F5P%cPw+/ofkd)Vtegt^oyQ!GhSpSH84ot],@/*xVi %3?@rTWU' );
define( 'NONCE_SALT',       '0.jSktmj:fg##X?NDjLl&xxq<9@ @Egqi!&@5pKB)pF$&@XVsh;c`D`u/BZ}xz|f' );

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
