import express from 'express';
const router = express.Router();
import ArtistController from '../controllers/artist.controller';

router.get('/:name', ArtistController.searchArtist);

module.exports = router;