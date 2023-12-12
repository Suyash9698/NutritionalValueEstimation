import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';
import { FiLogOut } from 'react-icons/fi';
import axios from 'axios';
import Chart from "react-apexcharts";

function Upload() {
  const [isFocused, setIsFocused] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [todoItem, setTodoItem] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [imageFinal, setImageFinal] = useState(null);
  const [showImageFinal, setShowImageFinal] = useState(false);
  const [buttonText, setButtonText] = useState('Preview Image');
  const [isRunning, setIsRunning] = useState(false);
  const [hashmapData, setHashmapData] = useState(null);
  const [showGraph, setShowGraph] = useState(false);
  

  const toggleImagePreview = () => {
    if (!selectedFile) {
      toast.error('Please select a file first', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }
    setShowImagePreview(!showImagePreview);
    setButtonText(showImagePreview ? 'Preview Image' : 'Hide Image');
  }

  const updateHashmapData = (hashmap) => {
    setHashmapData(hashmap);
  }

  const handleDeleteFinalImage = () => {
    setImageFinal(null);
    setShowImageFinal(false);
  }

  const handleRunPythonScript = async () => {
    if (!selectedFile) {
      toast.error('Please select a file before running the Python script', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }
    setIsRunning(true);
    toast.success('Loading...This may take a while.', {
      position: 'top-center',
      autoClose: false,
      hideProgressBar: true,
      closeButton: false,
      style: {
        borderLeft: '6px solid green',
        borderRight: '6px solid green',
        borderRadius: '5%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }
    });

    const formData = new FormData();
    formData.append('filePath', selectedFile.name);

    axios
      .post("http://localhost:3001/runPythonScript", formData)
      .then((response) => {
        const { message, imagePath, hashmap } = response.data;
        updateHashmapData(hashmap);
        setShowGraph(true);

        if (imagePath) {
          displayModifiedImage(imagePath);
        }
        toast.success(message, {
          position: 'top-center',
          autoClose: 3000,
        });
      })
      .catch((error) => {
        toast.error('Error running the Python script', {
          position: 'top-center',
          autoClose: 3000,
        });
      })
      .finally(() => {
        setIsRunning(false);
        toast.dismiss();
      });
  }

  const displayModifiedImage = async (imagePath) => {
    setImageFinal(null);
    setShowImageFinal(false);
    const desired = imagePath.split("/client/")[1];
    setImageFinal(desired);
    setShowImageFinal(true);
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(null);
    setImagePreview(null);
    setShowImagePreview(false);
    setImageFinal(null);
    setShowImageFinal(false);
    setShowGraph(false);
    setHashmapData(false);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setImageFinal(null);
      setShowImageFinal(false);
    };
    reader.readAsDataURL(file);
  }

  const handlePreviewImage = () => {
    setShowImagePreview(true);
  }

  const handleUploadImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setShowImagePreview(false);
    setImageFinal(null);
    setShowImageFinal(false);
  }

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  }

  return (
    <div className="todo-container">
      <h1 style={{ color: 'lightgrey', textAlign: 'center' }}>Weigh My Plate</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div></div>
        <div className="logout-button" onClick={handleLogout} style={{ height: '40px', width: '20px' }}>
          <FiLogOut style={{ fontSize: '25px', marginLeft: '-10px', marginTop: '-10px' }} />
        </div>
      </div>
      <div className="input-container" >
        <label style={{ color: 'lightgray', fontSize: '23px', marginLeft: "-1230px"
        }}>Upload File:</label>
        <input type="file" onChange={handleFileChange} className='custom' />
      </div>
      <button className="create-button" onClick={toggleImagePreview}>
        {buttonText}
      </button>
     <button className="display-button" onClick={handleRunPythonScript} style={{marginLeft:"50px"}}>
        Run Script
     </button>

      <br></br>
      {showImagePreview && imagePreview && (
        <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', height: '200%',marginTop:"20px" }} />
      )}
      
      {/* Toggle between displaying the table and the graph */}
      <br></br>
      {hashmapData && (
       <button
        className="display-button"
         onClick={() => setShowGraph(!showGraph)}
      >
     {showGraph ? 'Show Table' : 'Show Graph'}
         </button>
     )}

      {/* Conditionally render the graph or table based on the state of showGraph */}
      {showGraph ? <GraphComponent hashmapData={hashmapData} finalImage={imageFinal}/> : <ResultDisplay hashmapData={hashmapData} finalImage={imageFinal} />}
      <ToastContainer />
    </div>
  )
}


function ResultDisplay({ hashmapData, finalImage }) {
  return (
    <div className="result-display" style={{marginLeft:"-20px"}}>


      {finalImage && (
        <div className="final-image-container" style={{ width: "50%", height:"200%",float: "left",marginTop:"10px" }}>
          <img src={finalImage + `?t=${new Date().getTime()}`} alt="final" style={{ maxWidth: '100%', height: '50%',marginTop:"10px" }} />
        </div>
      )}

      {hashmapData && (
        <div className="table-container" style={{ width: "50%",float: "left",marginTop:"20px" }}>
          <table style={{height:"20%"}}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Calories</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(hashmapData).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      
    </div>
  );
}

function GraphComponent({ hashmapData, finalImage }) {
  const keys = Object.keys(hashmapData);
  const values = Object.values(hashmapData);

  const series = [
    {
      name: 'Values',
      data: values,
      color: 'green',
      stroke: 'green',
    },
  ];

  const chartOptions = {
    xaxis: {
      categories: keys,
      axisBorder: {
        color: 'white',
      },
      labels: {
        style: {
          colors: 'orange', 
        },
      },
    },
    yaxis: {
      axisBorder: {
        color: 'blue',
      },
      labels: {
        style: {
          colors: 'orange',
        },
      },
    }};
    
    return (
      <div className="graph-container" style={{marginLeft:"-20px"}}>
  <div className="final-image-container" style={{ width: "50%", float: "left",height:"200%",marginTop:"10px" }}>
    {finalImage && (
      <img src={`${finalImage}?t=${new Date().getTime()}`} alt="final" style={{ maxWidth: '100%', height: '50%' }} />
    )}
  </div>
  <div style={{ width: "50%", float: "right" }}>
    <Chart options={chartOptions} series={series} type="line" width="500" />
  </div>
</div>

    );
}

export default Upload;
