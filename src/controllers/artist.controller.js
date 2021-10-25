import { Op } from 'sequelize';
import model from '../models';

const { artist } = model;

export default {
  async searchArtist(req, res) {
    try {
      const { name } = req.params;
      if(!name) return res.status(500).send({ msg: 'artist name is required' });

      const results = await artist.findAll({ 
        where: { 
          name: {
            [Op.iLike]: `%${name}%`
          }
        }
      });
    
      return res.status(200).send({ data: results });
    } catch(e) {
      console.log('err', e);
    }
  }
  
}