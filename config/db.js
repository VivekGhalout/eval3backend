const mongoose=require('mongoose');

const connection=mongoose.connect('mongodb+srv://vivek1234:vivek1234@spr3eval.dp23wri.mongodb.net/?retryWrites=true&w=majority');

module.exports={connection};