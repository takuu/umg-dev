import TrackController from '../controllers/track.controller';
import ArtistController from '../controllers/artist.controller';

import trackRoutes from './track.routes';
import artistRoutes from './artist.routes';

export default (app) => {
  app.use('/track', trackRoutes);
  app.use('/artist', artistRoutes);


  // app.post('/create', TrackController.create);
  // app.get('/track/:isrc', TrackController.getTrackByISRC);
  // app.get('/artist/:name', ArtistController.searchArtist);

// Create a catch-all route for testing the installation.
app.all('*', (req, res) => res.status(200).send({
  message: 'Application started',
}));
};