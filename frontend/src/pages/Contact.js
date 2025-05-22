import React, { useState } from 'react';
import axios from 'axios';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/messages', formData);

      if (response.status === 200) {
        setSuccessMessage('Your message has been sent successfully!');
        setErrorMessage('');
        setFormData({ name: '', email: '', message: '' }); // Clear form
      }
    } catch (error) {
      setErrorMessage('There was an error sending your message.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Contact Us</h2>
      <p><strong>Email:</strong> crosscrateexim@gmail.com</p>
      <p><strong>Phone:</strong> +91 94955 22449</p>
      <p><strong>Address:</strong> Crosscrate International Exim Private Limited, Al Ameen, Parimanam, Muttom-Allepey, Kerala, India- 690511</p>

      <h4 className="mt-4">Send Us a Message</h4>
      
      {/* Success or Error Message */}
      {successMessage && <p className="text-success">{successMessage}</p>}
      {errorMessage && <p className="text-danger">{errorMessage}</p>}

      <form onSubmit={handleSubmit} style={{width:'30%'}}>
        <input 
          type="text" 
          name="name"
          placeholder="Your Name" 
          className="form-control mb-2" 
          required 
          value={formData.name}
          onChange={handleChange}
        />
        <input 
          type="email" 
          name="email"
          placeholder="Your Email" 
          className="form-control mb-2" 
          required 
          value={formData.email}
          onChange={handleChange}
        />
        <textarea 
          name="message"
          placeholder="Your Message" 
          className="form-control mb-2" 
          rows="4" 
          required 
          value={formData.message}
          onChange={handleChange}
        ></textarea>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default Contact;
