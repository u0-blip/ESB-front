import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactCrop from 'react-image-crop';

const FileInput = props => {
  const [upImg, setUpImg] = useState();
  const [crop, setCrop] = useState({ unit: '%', width: 40, aspect: 1 });

  const cropRef = useRef(null);

  const handleFileChange = async croppedImgBase64 => {
    props.handleChangeFile(croppedImgBase64);
  };

  const onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = useCallback(img => {
    cropRef.current = img;
  }, []);

  const handleCropComplete = async crop => {
    if (crop.width && crop.height) {
      makeClientCrop(crop);
    }
  };

  const makeClientCrop = async crop => {
    if (cropRef.current && crop.width && crop.height) {
      const nowMilli = Date.now();
      const croppedImgBase64 = await getCroppedImgBase64(cropRef.current, crop, `${nowMilli}.jpeg`);
      handleFileChange(croppedImgBase64);
    }
  };

  const getCroppedImgBase64 = async (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // const base64Image = canvas.toDataURL('image/jpeg');
    // return base64Image;

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        blob.name = fileName;
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  return (
    <>
      <div className="file has-name">
        <label className="file-label">
          <input
            className="file-input"
            type="file"
            name="resume"
            onChange={onSelectFile}
          />
          <span className="file-cta">
            <span className="file-icon">
              <i className="fas fa-upload"></i>
            </span>
            <span className="file-label">
              Upload a file…
            </span>
          </span>
          <span className="file-name">{''}</span>
        </label>
      </div>
      <br />
      { upImg ? (
        <ReactCrop ruleOfThirds={true} src={upImg} crop={crop} onChange={newCrop => setCrop(newCrop)} onImageLoaded={onLoad} onComplete={handleCropComplete} />
        ) : (
          <>
          <div className="columns">
            <div className="column">
              <img src={`${process.env.REACT_APP_ESB_COMPETITOR_ASSETS}${props.value}`} alt="competitor"/>
            </div>
          </div>
          </>
      )}
    </>
  );
};

FileInput.propTypes = {
  category: PropTypes.string,
  handleChangeFile: PropTypes.func,
  value: PropTypes.string
};

export default FileInput;
