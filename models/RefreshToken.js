const mongoose = require( "mongoose" );

const RefreshTokenSchema = new mongoose.Schema( {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
} );


module.exports = mongoose.model( "RefreshToken", RefreshTokenSchema );