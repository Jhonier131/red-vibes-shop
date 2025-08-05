const { connect, set } = require('mongoose');

const DB_URI = `mongodb+srv://jhonier:13052002@restaurant.hluhpeu.mongodb.net/workshop?retryWrites=true&w=majority&appName=workshop`;


console.log("Holaaa");
const dbInit = async () => {
    set("strictQuery", false);
    await connect(`${DB_URI}`);
};

module.exports = {
    dbInit
}