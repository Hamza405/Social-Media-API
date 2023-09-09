const router = require( "express" ).Router();
const controller = require( "../controllers/users" );

// UPDATE USER
router.put( "/:id", controller.updateUser );

// DELETE USER
router.delete( "/:id", controller.deleteUser );

// GET USER INFO
router.get( "/:id", controller.getUser );

router.put( "/:id/follow", controller.followUser );

router.put( "/:id/unfollow", controller.unFollowUser );

module.exports = router;