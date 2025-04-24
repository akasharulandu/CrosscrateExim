import React from 'react';

function Contact() {
  return (
    <div className="container mt-5">
      <h2>Contact Us</h2>
      <p><strong>Email:</strong> crosscrateexim@gmail.com</p>
      <p><strong>Phone:</strong> +91 94955 22449</p>
      <p><strong>Address:</strong>  Crosscrate International Exim Private Limited
 Al Ameen, Parimanam, Muttom-Allepey, Kerala, India- 690511</p>

      <h4 className="mt-4">Send Us a Message</h4>
      <form>
        <input type="text" placeholder="Your Name" className="form-control mb-2" required />
        <input type="email" placeholder="Your Email" className="form-control mb-2" required />
        <textarea placeholder="Your Message" className="form-control mb-2" rows="4" required></textarea>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default Contact;