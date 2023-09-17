export function errorHandler( fn ) {
    return async function ( req, res, next ) {
        try { const result = await fn( req, res ); res.json( result ) } catch ( e ) { next( e ) }
    }
}

export class HttpError extends Error {
    constructor ( statusCode, message ) {
        super( message );
        this.statusCode = statusCode;
    }
}