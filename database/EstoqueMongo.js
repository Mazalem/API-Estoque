require("dotenv").config();
const mongodb = require("mongodb");

const ClienteMongo = mongodb.MongoClient;
var cliente;

const conexao_bd = async () => {
    if (!cliente)
        cliente = await ClienteMongo.connect(process.env.URL_BANCO);
};

const bd = () => {
    return cliente.db("api_estoque");
};

class EstoqueMongo {
    async close() {
        if (cliente) cliente.close();
        cliente = undefined;
    }

}
module.exports = new EstoqueMongo();
