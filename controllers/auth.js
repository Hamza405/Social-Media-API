const User = require( "../models/User" );
const RefreshToken = require( "../models/RefreshToken" )
const bcrypt = require( "bcrypt" );
const jwt = require( "jsonwebtoken" );
const { errorHandler } = require( "../utils" );

function validateEmail( email ) {
    var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test( email );
}

function generateAccessToken( userId, userName ) {
    return jwt.sign( { userId, userName }, process.env.TOKEN_SECRET_KEY, { expiresIn: '10m' } );
}

function generateRefreshToken( userId, refreshTokenId ) {
    return jwt.sign( {
        userId: userId,
        tokenId: refreshTokenId
    }, process.env.TOKEN_SECRET_KEY, {
        expiresIn: '30d'
    } );
}

exports.register = errorHandler( async ( req, res ) => {
    const userName = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    ( !userName || userName.length === 0 ) && res.status( 404 ).json( { error: "username is required!" } );
    ( !email || !validateEmail( email ) ) && res.status( 404 ).json( { error: email.length > 0 ? "please enter valid email" : "email is required!" } );
    ( !password || password.length === 0 ) && res.status( 404 ).json( { error: "password is required!" } );
    try {
        //generate new password
        const salt = await bcrypt.genSalt( 10 );
        const hashedPassword = await bcrypt.hash( req.body.password, salt );

        //create new user
        const newUser = new User( {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        } );

        const refreshTokenDoc = new RefreshToken( {
            owner: newUser.id
        } )

        //save user and respond
        const user = await newUser.save();
        await refreshTokenDoc.save();

        const accessToken = generateAccessToken( newUser.id, newUser.username );
        const refreshToken = generateRefreshToken( newUser.id, );

        return { user, accessToken, refreshToken };
    } catch ( err ) {
        console.log( err )
        if ( err.keyPattern.username ) {
            return res.status( 401 ).json( { error: 'Error when signup', message: "This user name is used before!" } )
        } else if ( err.keyPattern.email ) {
            return res.status( 401 ).json( { error: 'Error when signup', message: "This email is used before!" } )
        } else {
            return res.status( 500 ).json( { error: 'Error when signup', message: err } )
        }
    }
} );

exports.login = async ( req, res ) => {
    try {
        const user = await User.findOne( { email: req.body.email } );
        !user && res.status( 404 ).json( { error: "user not found" } );

        const validPassword = await bcrypt.compare( req.body.password, user.password )
        !validPassword && res.status( 400 ).json( { error: "wrong password" } )

        res.status( 200 ).json( user )
    } catch ( err ) {
        res.status( 500 ).json( { error: 'Error when signup', message: JSON.stringify( err ) } )
    }
};