import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/messages', {
        ...formData,
        read: false // Ensure message is marked as unread for admin
      });
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage('Your message has been sent successfully!');
        setErrorMessage('');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      setErrorMessage('There was an error sending your message.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="container contact-section mt-5 text-white">
      <h2 className="text-center fw-bold">Contact Us</h2>
      <br />
      <div className="row">
        <div className="col-md-6">
          <p><strong>Email:</strong> crosscrateexim@gmail.com</p>
          <p><strong>Phone:</strong> +91 94955 22449</p>
          <p><strong>Address:</strong> Crosscrate International Exim Private Limited, Al Ameen, Parimanam, Muttom-Allepey, Kerala, India- 690511</p>
          <div className="map-responsive mt-3 rounded">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100344.82666746552!2d76.2590449318168!3d9.50079350323095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0885ab61befe03%3A0xa65884cbfbb1fa57!2sAlappuzha%20Beach!5e1!3m2!1sen!2sin!4v1748316986980!5m2!1sen!2sin"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map"
            ></iframe>
          </div>
        </div>

        <div className="col-md-6">
          <h4 className="mt-4 mt-md-0">Send Us a Message</h4>
          {successMessage && <p className="text-success">{successMessage}</p>}
          {errorMessage && <p className="text-danger">{errorMessage}</p>}

          <form onSubmit={handleSubmit}>
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
      </div>
    </div>
  );
}

export default Contact;
