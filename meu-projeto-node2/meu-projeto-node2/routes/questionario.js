const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.get('/', (req, res) => {
  res.render('questionario', {
    title: 'Questionário sobre Futebol',
    data: {},
    errors: {}
  });
});

router.post('/',
  [
    body('nome')
      .trim().isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres.')
      .escape(),

    body('time_favorito')
      .trim().isLength({ min: 2 }).withMessage('Informe seu time favorito.')
      .escape(),

    body('jogava')
      .isIn(['sim', 'nao']).withMessage('Selecione se você jogava futebol.'),

    body('posicao')
      .optional({ checkFalsy: true })
      .isIn(['goleiro', 'zagueiro', 'lateral', 'meio', 'atacante'])
      .withMessage('Posição inválida.'),

    body('camisa_numero')
      .optional({ checkFalsy: true })
      .isInt({ min: 1, max: 99 }).withMessage('Número da camisa deve estar entre 1 e 99.'),

    body('estadio_visitado')
      .trim().isLength({ min: 3 }).withMessage('Informe um estádio que já visitou.')
      .escape(),

    body('melhor_jogador')
      .trim().isLength({ min: 3 }).withMessage('Informe o melhor jogador para você.')
      .escape(),

    body('comp_torce')
      .isIn(['brasileirao', 'libertadores', 'champions', 'copa-do-mundo'])
      .withMessage('Competição inválida.'),

    body('tecnicos_gostados')
      .optional({ checkFalsy: true })
      .customSanitizer(v => Array.isArray(v) ? v : (v ? [v] : []))
      .custom(arr => {
        const valid = ['tite', 'diniz', 'ancelotti', 'guardiola', 'mourinho'];
        return arr.every(x => valid.includes(x));
      }).withMessage('Técnico inválido.'),

    body('comentario')
      .trim().isLength({ min: 10, max: 300 })
      .withMessage('Comentário deve ter entre 10 e 300 caracteres.')
      .escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    const data = req.body;

    if (!errors.isEmpty()) {
      return res.status(400).render('questionario', {
        title: 'Questionário sobre Futebol',
        data,
        errors: errors.mapped()
      });
    }

    return res.render('questionario-sucesso', {
      title: 'Questionário enviado!',
      data
    });
  }
);

module.exports = router;
