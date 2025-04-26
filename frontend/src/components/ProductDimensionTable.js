import React, { useState } from 'react';
import axios from 'axios';

const EditProductDimensions = ({ productId, existingDimensions }) => {
  const [dimensions, setDimensions] = useState(existingDimensions || []);

  const handleAddDimension = () => {
    setDimensions([...dimensions, { label: '', value: '' }]);
  };

  const handleDimensionChange = (index, field, value) => {
    const updatedDimensions = [...dimensions];
    updatedDimensions[index][field] = value;
    setDimensions(updatedDimensions);
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/products/${productId}/dimensions`, {
        dimensions,
      });
      alert('Dimensions updated successfully!');
    } catch (error) {
      console.error('Failed to update dimensions:', error);
      alert('Failed to update dimensions.');
    }
  };

  return (
    <div>
      <h4>Edit Dimensions</h4>
      {dimensions.map((dim, index) => (
        <div key={index} className="mb-2">
          <input
            type="text"
            placeholder="Label"
            value={dim.label}
            onChange={(e) => handleDimensionChange(index, 'label', e.target.value)}
            className="form-control mb-1"
          />
          <input
            type="text"
            placeholder="Value"
            value={dim.value}
            onChange={(e) => handleDimensionChange(index, 'value', e.target.value)}
            className="form-control"
          />
        </div>
      ))}
      <button className="btn btn-primary mt-3" onClick={handleAddDimension}>
        Add Row
      </button>
      <button className="btn btn-success mt-3 ms-3" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default EditProductDimensions;
