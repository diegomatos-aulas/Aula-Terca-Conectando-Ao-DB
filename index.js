require('dotenv').config()
const express = require("express");
const path = require("path")
const mongoose = require("mongoose");
const app = express();

// app.use(express.urlencoded({extended : true}));
app.use(express.json())

const stringConexao = process.env.STRING_CONEXAO
mongoose.connect(stringConexao, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.on('error', err => {
    console.log("Error com a conexão com o Banco de Dados:", err);
});

mongoose.connection.on('open', () => {
    console.log("Conectado ao Banco de Dados !!");
});

let publicPath = path.join(__dirname + "/public")
app.use(express.static(publicPath))

const jogadorSchema = new mongoose.Schema({}, { strict: false })
const Jogador = mongoose.model("Jogador", jogadorSchema)

app.get("/", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "/public", "/pages", "/home.html"))
});

app.post("/cadastrar", async function CriarJogador(req, res) {
    const { nome, sexo, raca, classe } = req.body

    try {
        console.log(nome, sexo, raca, classe)
        const jogadorDB = new Jogador({
            nome,
            sexo,
            raca,
            classe
        })

        const jogadorSalvo = jogadorDB.save()
        res.status(201).json(jogadorSalvo)
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
})

app.listen(80, (err) => {
    if (err) {
        console.log("Ocorreu um erro: " + err);
        return;
    }

    console.log("Servidor Pronto !")
})
