'use strict';

import apiCache from 'apicache';
import express from 'express';
const router = express.Router();

/*
 * GET apiCache index (for the curious).
 * @example: /api/cache/index
 */
router.get('/index', (req, res, next) => {
  res.status(200).json(apiCache.getIndex());
});

/*
 * Clear a specific cache
 * @example: /api/clear/cache => clear cache for everything
 * @example: /api/cache/pages => clear cache for all pages
 * @example: /api/cache/entries => clear cache for all entries
 */
router.get('/clear/:key?', (req, res, next) => {
  res.status(200).json(apiCache.clear(req.params.key || req.query.key));
});

module.exports = router;
