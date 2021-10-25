import { Op } from 'sequelize';
import NodeCache from 'node-cache';
import { orderBy, get } from 'lodash';
import request from 'request-promise-native';
import model from '../models';

const cache = new NodeCache();
require('dotenv').config();

const { track, artist } = model;

async function _getAccessToken () {
    const base64Credentials = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');
  
    let accessData = cache.get('access_data');
    if(accessData === undefined) {
      accessData = await request({
        method: 'POST',
        uri: 'https://accounts.spotify.com/api/token',
        headers: {
          Authorization: `Basic ${base64Credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials',
        json: true
      });
      cache.set('access_data', accessData, accessData.expires_in);

    } else {
      console.log('access data is cached:', accessData);
    }
    return accessData;
}
export default {
  async create(req, res) {
    try {
        const { isrc } = req.body;
  
        const accessData = await _getAccessToken();
  
        if (accessData) {
          const token = accessData.access_token;
          
          const trackData = await request({
            method: 'GET',
            uri: `https://api.spotify.com/v1/search?q=isrc:${isrc}&type=track`,
            headers: {
              Authorization: `Bearer ${token}`
            },
            json: true
          });
      
          const tracks = (trackData && trackData.tracks.items) || [];
          
          const { name, artists, album, id, duration_ms, external_ids } = orderBy(tracks, ['popularity'], 'desc').shift();;
          const images = album.images;

          const found = await track.findOne({ where: { isrc: get(external_ids, 'isrc') } });

          if(!found) {
            const newTrack = await track.create({
                name,
                isrc: get(external_ids, 'isrc'),
                imageUrl: images[0].url,
                spotifyId: id,
                durationMs: duration_ms
            });
            for(let i=0; i<artists.length; i++) {
              await artist.create({
                  name: artists[i].name,
                  href: artists[i].href,
                  trackId: get(newTrack, 'dataValues.id'),
                  spotifyId: artists[i].id
              });
            }
          }
          return res.status(200).send({message: found ? 'duplicate found' : 'successfully created'});
        } else {
          return res.status(500).send({message: 'unable to create access token'});
        }
      
      } catch(e) {
        console.log('err', e);
      }
  },
  async getTrackByISRC(req, res) {
    try {
      const { isrc } = req.params;
      if(!isrc) return res.status(500).send({ msg: 'isrc is required' });

      const found = await track.findOne({ where: { isrc } });
      return res.status(200).send({ data: found.dataValues });

    } catch(e) {
      console.log('err', e);
    }
  }
}