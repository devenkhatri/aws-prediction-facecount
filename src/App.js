import './App.css';
import { useState } from 'react'
import { Storage, Predictions } from 'aws-amplify'

function App() {
  const [file, setFile] = useState();
  const [uploaded, setUploaded] = useState(false);
  const [hasFace, setHasFace] = useState(false);
  return (
    <div className="App">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={async () => {
        const storageResult = await Storage.put(file.name, file, {
          level: 'public',
          type: file.type
        })
        console.log("******** file", file)
        setUploaded(true)
        console.log(storageResult);
        setHasFace(false)
        await Predictions.identify({
          labels: {
            source: {
              file,
            },
            type: "LABELS"
          }
        })
          .then(response => {
            const { labels } = response;
            labels.forEach(object => {
              const { name } = object
              console.log("****** name", name)
              if(name === 'Face') setHasFace(true)
          });
          })
          .catch(err => console.log({ err }));
      }}>Upload and count the number of faces in an image!</button>
      <div>
        {uploaded
          ? <div>Your image is uploaded!</div>
          : <div>Upload a photo to get started</div>}
        {hasFace
          ? <div> This image contains a face</div>
          : <div> This image doesn't have a face </div>}
      </div>
    </div>
  );
}

export default App;
