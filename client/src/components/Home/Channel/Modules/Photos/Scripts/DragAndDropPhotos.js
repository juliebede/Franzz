function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

async function uploadFile(file, channelId, albumName, emitSendMessage, viewUpdatedAlbum) {
  const url = 'http://localhost:8001/api/photos/uploadPhotos';
  const formData = new FormData();
  formData.append('file', file);
  formData.append('channel', `${channelId}`);
  let path = `albums/${albumName}`;
  if (albumName === 'chat') {
    path = 'chat';
  }
  formData.append('album', path);


  fetch(url, {
    method: 'POST',
    body: formData,
  })
    // send the url of image/video to socket to be used for messaging
    .then((res) => res.json())
    .then((data) => {
      if (albumName === 'chat') {
        emitSendMessage(data.result.url, data.video, data.image);
      } else {
        setTimeout(() => {
          viewUpdatedAlbum();
        }, 1000);
      }
    })
    .catch((err) => { console.log(err); });
}

function handleFiles(files, channelId, albumName, emitSendMessage, viewUpdatedAlbum) {
  [...files].forEach((file) => {
    uploadFile(file, channelId, albumName, emitSendMessage, viewUpdatedAlbum);
  });
}

function handleDrop(e, channelId, albumName, emitSendMessage) {
  // get emitsendmessage to be passed through as a function
  preventDefaults(e);
  const dt = e.dataTransfer;
  const { files } = dt;

  handleFiles(files, channelId, albumName, emitSendMessage);
}


module.exports = {
  preventDefaults,
  handleDrop,
  handleFiles,
};