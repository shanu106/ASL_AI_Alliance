import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import LoadingOverlay from './LoadingOverlay';

/* Use REACT_APP_BASE_URL (CRA) or BASE_URL as a fallback; default to localhost */
const SideDrawer = ({ isOpen, onClose }) => {
  const { isDark, toggleTheme } = useTheme();
  const [videoFile, setVideoFile] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [transcript, setTranscript] = useState('')
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
 
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file && file.type === 'video/mp4') {
      setVideoFile(file);
      // show loading while uploading/transcribing
      setLoading(true);
      setLoadingMessage('Uploading video and transcribing...');
      sendForAsl(file).finally(() => {
        setLoading(false);
        setLoadingMessage('');
      });
      console.log('Video uploaded:', file.name);
    }
  };

 async function sendForAsl(video) {
 const formData = new FormData();
formData.append("video", video);
  const response = await axios.post(`${import.meta.env.VITE_VIDEO_TO_TEXT_BASE_URL}/transcribe`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    setTranscript(response.data)
    alert("Video uploaded successfully")
    console.log(response.data)
  }

  const handleYoutubeSubmit =async () => {
try {
  console.log(youtubeLink)
  setLoading(true);
  setLoadingMessage('Fetching YouTube transcript...');
  const response = await axios.get(`${import.meta.env.VITE_VIDEO_TO_TEXT_BASE_URL}/yt`, {
    params: { url: youtubeLink }
  });
    // setTranscript(res.data)
    setTranscript(response.data)
    alert("YouTube Transcript fetched successfully")
    console.log(response.data)
    setLoading(false);
    setLoadingMessage('');
} catch (error) {
  console.error('Error fetching YouTube transcript:', error);
  setLoading(false);
  setLoadingMessage('');
}

  
   
  };

  const handleConvert = async() =>{
    try {
      if(!transcript) {
        alert("Please upload a video or add a YouTube link first.")
        return;
      }
      console.log("helo",transcript.response)
      setLoading(true);
      setLoadingMessage('Generating ASL video — this can take a while...');
      const response = await axios.get(`${import.meta.env.VITE_BLENDER_BASE_URL}/generate`, {
        params: {text: transcript.response},
        responseType: "blob",
      })
       const url = window.URL.createObjectURL(new Blob([response.data]));

    // Option A: trigger download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "output.mp4"); // custom name
    document.body.appendChild(link);
    link.click();
    alert("Video Generated Successfully")

      console.log(response)
    } catch (error) {
      console.log(error)
      setLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`fixed top-0 left-0 h-full w-80 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-2xl`}>
    <div className={`p-6 h-full overflow-y-auto ${loading ? 'loading-blur-target' : ''}`}>
          <div className="flex justify-between items-center mb-8">
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Convert Options</h2>
            <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
              <button onClick={toggleTheme} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDark ? 'bg-purple-600' : 'bg-gray-300'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Upload MP4 Video</h3>
            <label className={`block w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDark ? 'border-gray-700 hover:border-purple-500 bg-gray-800' : 'border-gray-300 hover:border-purple-400 bg-gray-50'}`}>
              <input type="file" accept="video/mp4" onChange={handleFileUpload} className="hidden" />
              <div className="text-center">
                <svg className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{videoFile ? videoFile.name : 'Click to upload MP4'}</p>
              </div>
            </label>
          </div>

          <div className="mb-6">
            <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>YouTube Video Link</h3>
            <div className="space-y-3">
              <input type="text" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} placeholder="https://youtube.com/watch?v=..." className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
              <button onClick={handleYoutubeSubmit} className="w-full gradient-bg text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">Add YouTube Video</button>
            </div>
          </div>

          <div className="mb-6">
            <button onClick={handleConvert} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Convert to ASL</span>
            </button>
          </div>

          <div className="border-t pt-6 space-y-2">
            <a href="#" className={`block px-4 py-2 rounded-lg transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>Dashboard</a>
            <a href="#" className={`block px-4 py-2 rounded-lg transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>History</a>
            <a href="#" className={`block px-4 py-2 rounded-lg transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>Settings</a>
          </div>
        </div>
        </div>

        {/* Global loading overlay */}
        <LoadingOverlay visible={loading} message={loadingMessage} onCancel={() => { setLoading(false); setLoadingMessage(''); }} />
    </>
  );
};

export default SideDrawer;
