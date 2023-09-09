const router = require( "express" ).Router();
const controller = require( "../controllers/posts" );

router.post( "/", controller.createPost );

router.put( "/:id", controller.updatePost );

router.delete( "/:id", controller.deletePost );

router.put( "/:id/like", controller.likePost );

router.get( "/:id", controller.getPost );

router.get( "/timeline/all", controller.getTimelinePosts );

module.exports = router;