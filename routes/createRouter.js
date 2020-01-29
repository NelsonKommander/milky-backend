const glob = require('glob');
const express = require('express');
const Router = require('express').Router({mergeParams: true});


/*
*   Usando o módulo glob para pesquisar todos os arquivos
* que tenham a extensão .js em toda subpasta e retornar um array
* com o nome dos arquivos
*/
// glob.sync('**/*.js', { cwd: `${__dirname}`);

/*
*   Aplicando um map no array que executa o require() para cada
* arquivo .js e retorna um array com os objetos exportados
*/
// .map(filename =: require(`./${filename}`))

/*
*   Aplicando um filtro para manter apenas os objetos do tipo
* Router no array de objetos
*/
// .filter(router => Object.getPrototypeOf(router) == Router)
/*
*   Aplicando uma redução no array, juntando todos os Routers
* em um só (no rootRouter) e exportando apenas o rootRouter com os
* seus filhos
*/
//.reduce((rootRouter, router) => rootRouter.use(router), Router({ mergeParams: true }));
/*
*   Esse agregador vai juntar os roteadores da pasta api em um unico roteador.
* As rotas dos roteadores filhos devem seguir o formato /rota/
*/
module.exports = () => glob
    .sync('**/*.js', { cwd: `${__dirname}/` })
    .map(filename => require(`./${filename}`))
    .filter(router => Object.getPrototypeOf(router) == express.Router)
    .reduce((rootRouter, router) => rootRouter.use(router), Router);