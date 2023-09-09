const Post = require( "../models/Post" );

exports.createPost = async ( req, res ) => {
    const newPost = new Post( req.body );
    try {
        const savedPost = await newPost.save();
        res.status( 200 ).json( { message: "Post Added success", response: { post: savedPost } } );
    } catch ( e ) {
        res.status( 500 ).json( { error: e } );
    }
}

exports.updatePost = async ( req, res ) => {
    try {
        const post = await Post.findById( req.params.id );
        if ( post.userId === req.body.userId ) {
            post.updateOne( { $set: req.body } );
            res.status( 200 ).json( "the post has been updated" );
        } else {
            res.status( 403 ).json( "you can update only your post" );
        }
    } catch ( e ) {
        res.status( 500 ).json( { error: e } );
    }
}

exports.deletePost = async ( req, res ) => {
    try {
        const post = await Post.findById( req.params.id );
        if ( post.userId === req.body.userId ) {
            post.deleteOne();
            res.status( 200 ).json( "the post has been deleted" );
        } else {
            res.status( 403 ).json( "you can delete only your post" );
        }
    } catch ( e ) {
        res.status( 500 ).json( { error: e } );
    }
}

exports.likePost = async ( req, res ) => {
    try {
        const post = await Post.findById( req.params.id );
        if ( post.likes.includes( req.params.id ) ) {
            post.updateOne( { $pull: { likes: req.params.id } } )
            res.status( 200 ).json( "The post has been disliked" );
        } else {
            post.updateOne( { $push: { likes: req.params.id } } )
            res.status( 200 ).json( "The post has been liked" );
        }
    } catch ( e ) {
        res.status( 500 ).json( { error: e } );
    }
}

exports.getPost = async ( req, res ) => {
    try {
        const post = await Post.findById( req.params.id );
        res.status( 200 ).json( post );
    } catch ( err ) {
        res.status( 500 ).json( err );
    }
}

exports.getTimelinePosts = async ( req, res ) => {
    try {
        const currentUser = await User.findById( req.body.userId );
        const userPosts = await Post.find( { userId: currentUser._id } );
        const friendPosts = await Promise.all(
            currentUser.followings.map( ( friendId ) => {
                return Post.find( { userId: friendId } );
            } )
        );
        res.json( userPosts.concat( ...friendPosts ) )
    } catch ( err ) {
        res.status( 500 ).json( err );
    }
};
