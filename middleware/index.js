const { errorHandler, HttpError } = require( "../utils" );

exports.ErrorHandler = ( err, req, res, next ) => {
    res.status( err.statusCode || 500 ).send( { error: err.message } )
}

exports.VerifyAccessToken = errorHandler( async ( req, res, next ) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split( ' ' )[1];

    if ( !token ) {
        throw new HttpError( 403, 'Unauthorized, no token' );
    }

    try {
        const decodedToken = jwt.verify( token, process.env.ACCESS_TOKEN_SECRET_KEY );
        req.userId = decodedToken.userId;
        next();
    } catch ( e ) {
        throw new HttpError( 400, 'Unauthorized:token: ' + token );
    }
} );