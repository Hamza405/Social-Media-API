const mongoose = require( "mongoose" );
const dotenv = require( "dotenv" );
const { HttpError } = require( "../utils" );

dotenv.config();

const mongooseConnect = () => {
    return mongoose
        .connect( process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true } )
        .then( () => console.log( "Database Connected" ) )
        .catch( ( err ) => { console.log( err ); throw HttpError( 500, 'Database Start Error!' ) } );
};

exports.mongooseConnect = mongooseConnect;