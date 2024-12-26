import { useState } from 'react';

function ImageUpload({ onFileUpload }) {
  const [file, setFile] = useState(null);

  function handleChange(e) {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    const reader = new FileReader();
    
    reader.onloadend = () => {
      onFileUpload(reader.result.split(',')[1]); // Pass base64 string to parent
    };
    if (uploadedFile) {
      reader.readAsDataURL(uploadedFile);
    }
  }

  return (
    <div className="image-upload">
      <h2>Add Image:</h2>
      <input type="file" onChange={handleChange} className="file-input" />
    </div>
  );
}

export default ImageUpload;
