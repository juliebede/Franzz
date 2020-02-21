const { errm } = require('../utils/logger');
const { extractJWT } = require('../utils/helpers/authHelper');
const { updateLocations, updateChannel } = require('../utils/helpers/mapHelper');

// socket (client)
module.exports = (io, socket) => {
  socket.on('update location', async ({ authorization, location }, callback) => {
    try {
      const user = await extractJWT(authorization);
      updateLocations(socket.id, user.username, location, user.channels, callback, io);
    } catch (err) {
      errm(err);
    }
  });

  socket.on('update maps', async ({ channel, authorization, location }) => {
    try {
      const user = await extractJWT(authorization);
      updateChannel(socket.id, user.username, channel, location, io);
    } catch (err) {
      errm(err);
    }
  });
};
