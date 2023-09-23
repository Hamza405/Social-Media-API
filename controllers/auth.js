const User = require( "../models/User" );
const RefreshToken = require( "../models/RefreshToken" )
const bcrypt = require( "bcrypt" );
const jwt = require( "jsonwebtoken" );
const { errorHandler, HttpError, withTransaction } = require( "../utils" );

function validateEmail( email ) {
    var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test( email );
}

function generateAccessToken( userId, userName ) {
    return jwt.sign( { userId, userName }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '10m' } );
}

function generateRefreshToken( userId, userName, refreshTokenId ) {
    return jwt.sign( {
        userId: userId,
        userName: userName,
        tokenId: refreshTokenId
    }, process.env.REFRESH_TOKEN_SECRET_KEY, {
        expiresIn: '30d'
    } );
}


const validateRefreshToken = async ( token ) => {
    const decodeToken = () => {
        try {
            return jwt.verify( token, process.env.REFRESH_TOKEN_SECRET_KEY );
        } catch ( err ) {
            // err
            throw new HttpError( 400, 'Unauthorised' );
        }
    }

    const decodedToken = decodeToken();
    const tokenExists = await RefreshToken.exists( { _id: decodedToken.tokenId, owner: decodedToken.userId } );
    if ( tokenExists ) {
        return decodedToken;
    } else {
        throw new HttpError( 401, 'Unauthorised in database' );
    }
};


exports.register = errorHandler( withTransaction( async ( req, res, session ) => {
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
        const user = await newUser.save( { session } );
        await refreshTokenDoc.save( { session } );

        const accessToken = generateAccessToken( newUser.id, newUser.username );
        const refreshToken = generateRefreshToken( newUser.id, newUser.username, refreshTokenDoc.id );

        return { user, accessToken, refreshToken };
    } catch ( err ) {
        console.log( err )
        if ( err.keyPattern.username ) {
            throw new HttpError( 401, "This user name is used before!" );
        } else if ( err.keyPattern.email ) {
            throw new HttpError( 401, "This email is used before!" );
        } else {
            throw new HttpError( 500, err );
        }
    }
} ) );

exports.login = errorHandler( withTransaction( async ( req, res, session ) => {
    try {
        const user = await User.findOne( { email: req.body.email } );
        if ( !user ) {
            throw new HttpError( 400, "user not found" );
        }

        const validPassword = await bcrypt.compare( req.body.password, user.password )
        if ( !validPassword ) {
            throw new HttpError( 400, "Wrong password" );
        }

        // create refresh token
        const refreshTokenDoc = new RefreshToken( {
            owner: user.id
        } );
        await refreshTokenDoc.save( { session } );

        const accessToken = generateAccessToken( user.id, user.username );
        const refreshToken = generateRefreshToken( user.id, user.username, refreshTokenDoc.id );

        return { user, accessToken, refreshToken };
    } catch ( err ) {
        throw new HttpError( err.statusCode, err );
    }
} ) );

exports.newRefreshToken = errorHandler( withTransaction( async ( req, res, session ) => {
    try {
        const currentRefreshToken = await validateRefreshToken( req.body.refreshToken );
        const refreshTokenDoc = new RefreshToken( {
            owner: currentRefreshToken.userId
        } );

        await refreshTokenDoc.save( { session } );
        await RefreshToken.deleteOne( { _id: currentRefreshToken.tokenId }, { session } );

        const refreshToken = generateRefreshToken( currentRefreshToken.userId, currentRefreshToken.username, refreshTokenDoc.id );
        const accessToken = generateAccessToken( currentRefreshToken.userId, currentRefreshToken.userName );

        return {
            id: currentRefreshToken.userId,
            accessToken,
            refreshToken
        };
    } catch ( err ) {
        throw new HttpError( err.statusCode || 500, err )
    }
} ) );

exports.newAccessToken = errorHandler( async ( req, res ) => {
    const refreshToken = await validateRefreshToken( req.body.refreshToken );
    const accessToken = generateAccessToken( refreshToken.userId, refreshToken.userName );

    return {
        id: refreshToken.userId,
        accessToken,
        refreshToken: req.body.refreshToken
    };
} );

exports.logoutAll = errorHandler( withTransaction( async ( req, res, session ) => {
    try {
        const refreshToken = await validateRefreshToken( req.body.refreshToken );
        await RefreshToken.deleteMany( { owner: refreshToken.userId }, { session } );
        return { success: true };
    } catch ( err ) {
        throw new HttpError( err.statusCode || 500, err )
    }
} ) );

exports.logout = errorHandler( withTransaction( async ( req, res, session ) => {
    try {
        const refreshToken = await validateRefreshToken( req.body.refreshToken );
        await RefreshToken.deleteOne( { _id: refreshToken.tokenId }, { session } );
        return { success: true };
    } catch ( err ) {
        throw new HttpError( err.statusCode || 500, err )
    }
} ) );