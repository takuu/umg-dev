import express from 'express';
const router = express.Router();
import TrackController from '../controllers/track.controller';

router.post('/create', TrackController.create);
router.get('/:isrc', TrackController.getTrackByISRC);

module.exports = router;