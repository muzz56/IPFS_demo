import React, { Component } from 'react';
import './App.css';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient('https://ipfs.infura.io:5001')

function App() {

  const [buffer, setBuffer] = React.useState(null); // State for setting buffer for reading and writing a file
  const [fileHash, setFileHash] = React.useState("QmSjqyrxFwobZF8Cx4tGcJZocsfenhPCrhsLJuo4g8JHPy"); // State for storing filehash of the file

  // Captures the file from the computer..!!
  const captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      setBuffer(Buffer(reader.result));
      console.log(buffer);

    }
  }

  // Adding the  captured file from the computer to the ipfs..!!
  const onSubmit = async (event) => {
    event.preventDefault()
    
    const ver = await ipfs.version()
    console.log("IPFS Version=", ver)

    console.log("Submitting file to ipfs...")
    //const result = await ipfs.add(this.state.buffer)
    var hash = ""
    
    for await (const result of ipfs.add(buffer)) {
      console.log(result)
      hash = result.path
    }

    console.log('Ipfs result', hash)
    setFileHash(hash);
    console.log(fileHash);
    
  }

  return  (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 d-flex text-center">
          <div className="content mr-auto ml-auto">
            <img alt="" src={`https://ipfs.io/ipfs/${fileHash}`}/>
            <p>&nbsp;</p>
            <h2>Change File</h2>
            <form onSubmit={onSubmit} >
              <input type='file' onChange={captureFile} />
              <input type='submit' />
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
