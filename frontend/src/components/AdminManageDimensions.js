import React, { useState } from 'react';
import axios from 'axios';

const AdminManageDimensions = ({ productId, initialDimensions = [] }) => {
  const [dimensions, setDimensions] = useState(initialDimensions);

  const addRow = () => {
    setDimensions([...dimensions, { ref: '', grade: '', length: '', width: '', height: '', recommendedFor: '', extraOptions: '' }]);
  };

  const updateRow = (index, field, value) => {
    const updated = [...dimensions];
    updated[index][field] = value;
    setDimensions(updated);
  };

  const saveDimensions = async () => {
    try {
      await axios.put(`/api/product/${productId}/dimensions`, { dimensions }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming token stored in localStorage
        }
      });
      alert('Dimensions updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update dimensions');
    }
  };

  return (
    <div>
      <h5 className="my-3">Manage Dimensions</h5>
      {dimensions.map((row, idx) => (
        <div key={idx} className="mb-3">
          {Object.keys(row).map((key) => (
            <input
              key={key}
              type="text"
              placeholder={key}
              value={row[key]}
              onChange={(e) => updateRow(idx, key, e.target.value)}
              className="m-1"
            />
          ))}
        </div>
      ))}
      <button className="btn btn-primary m-2" onClick={addRow}>Add Row</button>
      <button className="btn btn-success" onClick={saveDimensions}>Save</button>
    </div>
  );
};

export default AdminManageDimensions;
