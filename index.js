const express = require( "express" );
const cors = require( "cors" );
const dotenv = require( "dotenv" );
const helmet = require( "helmet" );
const morgan = require( "morgan" );

const authRouter = require( './routes/auth' );
const usersRouter = require( './routes/users' );
const postsRouter = require( './routes/posts' );
const { ErrorHandler, VerifyAccessToken } = require( "./middleware" );

dotenv.config();

// app.use( express.urlencoded( { extended: true } ) )
// Connecting Database
require( "./services/databases" ).mongooseConnect();

// Middleware
const app = express();
app.use( cors() );
app.use( express.json() );
app.use( helmet() );
app.use( morgan( "common" ) );

app.use( "/test", VerifyAccessToken, ( req, res ) => {
    res.status( 200 ).send( "Server is running" );
} );


app.use( "/api", authRouter );
app.use( "/api/users", usersRouter );
app.use( "/api/posts", postsRouter );


app.use( ErrorHandler );

app.listen( 8000, () => {
    console.log( 'Server is ready' );
} );