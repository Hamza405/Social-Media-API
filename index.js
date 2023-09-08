const express = require( "express" );
const dotenv = require( "dotenv" );
const helmet = require( "helmet" );
const morgan = require( "morgan" );

const userRouter = require( './routes/users' );
const authRouter = require( './routes/auth' );

dotenv.config();

const app = express();
// Connecting Database
require( "./utils/database" ).mongooseConnect();

// Middleware
app.use( express.json() );
app.use( helmet() );
app.use( morgan( "common" ) );

app.use( "/test", ( req, res ) => {
    res.status( 200 ).send( "Server is running" );
} );

app.use( "/api", authRouter );
app.use( "/api/users", userRouter );

app.listen( 8000, () => {
    console.log( 'Server is ready' );
} );