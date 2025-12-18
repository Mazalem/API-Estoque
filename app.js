const createError = require("http-errors");
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const vendaRouter = require("./routes/VendaRouter");
const estoqueRouter = require("./routes/EstoqueRouter");
const produtoRouter = require("./routes/ProdutoRouter");

const { swaggerDocs } = require("./config/swagger");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/vendas', vendaRouter);
app.use('/estoque', estoqueRouter);
app.use('/produto', produtoRouter);
// swagger
swaggerDocs(app);

// erro 404
app.use(function(req, res, next) {
  next(createError(404));
});

// handler de erros
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.send({
    erro: err.message,
    status: err.status || 500
  });
});

module.exports = app;
