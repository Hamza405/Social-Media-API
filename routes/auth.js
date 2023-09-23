const router = require( "express" ).Router();
const controller = require( "../controllers/auth" );

// REGISTER
router.post( "/register", controller.register );
// LOGIN
router.post( "/login", controller.login );
// New Refresh Token
router.post( "/newRefreshToken", controller.newRefreshToken );
// New Access Token
router.post( "/newAccessToken", controller.newAccessToken );
// LOGOUT From all
router.post( "/logoutAll", controller.logoutAll );
// LOGOUT
router.post( "/logout", controller.logout );

module.exports = router;