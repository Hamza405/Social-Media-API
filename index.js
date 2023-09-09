const express = require( "express" );
const dotenv = require( "dotenv" );
const helmet = require( "helmet" );
const morgan = require( "morgan" );

const authRouter = require( './routes/auth' );
const usersRouter = require( './routes/users' );
const postsRouter = require( './routes/posts' );

dotenv.config();

const app = express();
// Connecting Database
require( "./services/databases" ).mongooseConnect();

// Middleware
app.use( express.json() );
app.use( helmet() );
app.use( morgan( "common" ) );

app.use( "/test", ( req, res ) => {
    res.status( 200 ).send( "Server is running" );
} );

app.use( "/api", authRouter );
app.use( "/api/users", usersRouter );
app.use( "/api/posts", postsRouter );

app.listen( 8000, () => {
    console.log( 'Server is ready' );
} );