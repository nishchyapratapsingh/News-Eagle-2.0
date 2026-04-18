import { useState, useRef } from 'react'
import './FakeNewsDetection.css'

function FakeNewsDetection() {
  const [inputType, setInputType] = useState('text')
  const [text, setText] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (inputType === 'text' && !text.trim()) return
    if (inputType === 'image' && !imageFile) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      let response;
      if (inputType === 'text') {
        response = await fetch('http://localhost:8000/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text })
        })
      } else {
        const formData = new FormData()
        formData.append('file', imageFile)
        response = await fetch('http://localhost:8000/predict-image', {
          method: 'POST',
          body: formData
        })
      }

      if (!response.ok) {
        throw new Error('Failed to analyze the input')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const isSubmitDisabled = loading || (inputType === 'text' ? !text.trim() : !imageFile)

  return (
    <div className="app-container container">
      <div className="fake-news-wrapper">
        <header className="header">
          <div className="title-container">
            <h1 className='heading'>Fake Information Detector</h1>
          </div>
          <p>Analyze text in real-time to detect misinformation</p>
        </header>

      <main className="main-content">
        <div className="input-tabs">
          <button 
            type="button"
            className={`tab-btn ${inputType === 'text' ? 'active' : ''}`}
            onClick={() => setInputType('text')}
          >
            Text Input
          </button>
          <button 
            type="button"
            className={`tab-btn ${inputType === 'image' ? 'active' : ''}`}
            onClick={() => setInputType('image')}
          >
            Image Upload
          </button>
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          {inputType === 'text' ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter a news claim..."
              rows={6}
              className="text-input"
              disabled={loading}
            />
          ) : (
            <div 
              className="image-upload-container" 
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
                disabled={loading}
              />
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <p>Click to change image</p>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-icon">📷</span>
                  <p>Click to upload an image</p>
                </div>
              )}
            </div>
          )}

          <button type="submit" disabled={isSubmitDisabled} className="submit-btn">
            {loading ? <><span className="spinner"></span>Analyzing...</> : 'Verify News'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {result && (
          <div className="result-container fade-in">
            <div className="result-header">
              <span className={`label ${result.label.toLowerCase()}`}>
                {result.label}
              </span>
              <div className="score-container">
                <span className="score">
                  Credibility Score: <strong>{result.score}/100</strong>
                </span>
                <div className="progress-bar-container">
                  <div 
                    className={`progress-bar ${result.label.toLowerCase()}`} 
                    style={{ width: `${result.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="result-details">
              <h3>Analysis Explanation</h3>
              
              {result.extracted_text && (
                <div className="extracted-text-box">
                  <h4>Extracted Text</h4>
                  <p>"{result.extracted_text}"</p>
                </div>
              )}

              <div className="explanation-box">
                {result.explanation.split('\n').map((paragraph, index) => (
                  paragraph.trim() && <p key={index}>{paragraph}</p>
                ))}
              </div>
              
              {result.facts && result.facts.length > 0 && (
                <div className="facts-section">
                  <h4>Verified Information</h4>
                  <ul>
                    {result.facts.map((fact, index) => (
                      <li key={index}>{fact}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="meta-info" style={{ marginTop: '1.5rem' }}>
                <span className="lang-badge">
                  Detected Language: {result.detected_language}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
      </div>
    </div>
  )
}

export default FakeNewsDetection
