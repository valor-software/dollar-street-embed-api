'use strict';

import mongoose = require('mongoose');
import { ObjectID } from 'mongodb';
import { get } from 'lodash';

const Embed = mongoose.model('Embed');

module.exports = (app: any) => {
  app.get('/show-embed-set',
    showEmbedSet);

    function showEmbedSet(req: any, res: any) {
      const query = req.query;
      const embedId = query.embed;

      Embed
        .findOne({_id: embedId})
        .lean()
        .exec((err: any, data: any) => {
          if (err) {
            return res.json({success: !err, msg: [], data: null, error: err});
          }

          if (req.headers.referer) {
            res.redirect(`${data.targetUrl}`);
            return;
          }

            res.writeHeader(200, {"Content-Type": "text/html"});
          let html = `
            <!DOCTYPE html>
            <html lang="en" prefix="og: http://ogp.me/ns#">
            <head>
              <meta property="og:image" content="${data.imageUrl}">
              <meta property="twitter:image" content="${data.imageUrl}">
              <meta property="og:title" content="Dollar Street">
              <meta property="og:description" content="Imagine the world as a street where everyone lives. The poorest live to the left and the richest, to the right. Everybody else lives somewhere in between. Visit Dollar Street to see beds, stoves, toothbrushes and hundreds of other things in homes from all over the World at dollarstreet.org">
              <meta property="og:url" content="${data.targetUrl}">
              <meta property="og:type" content="article">
              <meta property="fb:app_id" content="135732313883245">
              <meta property="og:image:width" content="${ get(data.imageSize, 'width', '')}">
              <meta property="og:image:height" content="${ get(data.imageSize, 'height', '')}">
              <meta property="og:image:type" content="image/jpeg" />
              <meta property="og:image:alt" content="dollarstreet.org page preview" />
            </head>
          `;
          res.write(html);
          res.end();
        });
    }
};
