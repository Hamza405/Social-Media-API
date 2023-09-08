const router = require( "express" ).Router();
const controller = require( "../controller/users" );

// UPDATE USER
router.put( "/:id", controller.updateUser );

// DELETE USER
router.delete( "/:id", controller.deleteUser );

// GET USER INFO
router.get( "/:id", controller.getUser );

app.put( "/:id/follow", controller.followUser );

app.put( "/:id/unfollow", controller.unFollowUser );

module.exports = router;