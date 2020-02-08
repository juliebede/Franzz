import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import auth from './service/authService';
import channelService from './service/channelService';

const Channel = React.lazy(() => import('./components/Channel/Channel'));

const socket = io('http://localhost:8001/');

const App = () => {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    auth.login({
      email: 'email@gmail.com',
      password: 'password',
    });

    channelService
      .getMessages()
      .then((channelMessages) => {
        setChannels([...channelMessages]);
      });
    console.log(socket);
    socket.on('connect', () => {
      // from servers
      socket.on('server message', (data) => {
        console.log(data);
      });

      const joinChannelsObj = {
        authorization: window.localStorage.getItem('authorization'),
        username: window.localStorage.getItem('username'),
      };
      console.log(joinChannelsObj)
      socket.emit('join channels', joinChannelsObj, (data) => {
        console.log(data);
      });
    });
  }, []);


  console.log(channels);
  const channelViews = channels.map(({ channel, messages }) => (
    <Channel
      key={channel}
      socket={socket}
      channel={channel}
      messages={messages}
    />
  ));

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      {channelViews}
    </React.Suspense>
  );
};

export default App;
