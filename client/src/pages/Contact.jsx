import React, { useState } from 'react';
import Title from '../components/Title';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className='relative min-h-screen pt-24 pb-16 bg-gradient-to-l from-slate-700 to-slate-900'>
      <div className='container mx-auto px-4 md:px-8'>
        {/* Hero Section */}
        <div>
          <Title text1={"Contact"} text2={"US"} />
          <p className='text-center text-gray-300 max-w-2xl mx-auto mb-12'>
            Have questions or need assistance? We're here to help. Reach out to us through any of the channels below.
          </p>
        </div>

        {/* Main Content */}
        <div className='flex flex-col lg:flex-row gap-10 mb-16'>
          {/* Contact Information */}
          <div className='w-full lg:w-2/5'>
            <div className='bg-slate-800/50 rounded-2xl p-6 md:p-8 shadow-lg'>
              <h2 className='text-2xl font-bold mb-6 text-teal-300'>Get in Touch</h2>

              <div className='space-y-6'>
                <div className='flex items-start'>
                  <div className='bg-teal-700/20 p-3 rounded-lg mr-4'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className='font-semibold text-lg text-blue-100 mb-1'>Our Store</h3>
                    <p className='text-gray-300'>A235, Club Rd Paschim Vihar<br />New Delhi-110063</p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div className='bg-teal-700/20 p-3 rounded-lg mr-4'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className='font-semibold text-lg text-blue-100 mb-1'>Helpline Number</h3>
                    <p className='text-gray-300'>+91 9990538802</p>
                    <p className='text-sm text-gray-400 mt-1'>Mon-Sat: 9AM to 7PM</p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <div className='bg-teal-700/20 p-3 rounded-lg mr-4'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className='font-semibold text-lg text-blue-100 mb-1'>Email</h3>
                    <p className='text-gray-300'>mayankixa17@gmail.com</p>
                    <p className='text-sm text-gray-400 mt-1'>We respond within 24 hours</p>
                  </div>
                </div>
              </div>

              <div className='mt-8 pt-6 border-t border-slate-700'>
                <h3 className='font-semibold text-lg text-blue-100 mb-4'>Careers at One Cart</h3>
                <p className='text-gray-300 mb-4'>Interested in joining our team? We're always looking for talented individuals.</p>
                <button className='px-5 py-2.5 bg-teal-700 hover:bg-teal-600 text-white rounded-lg transition-colors duration-300 font-medium'>
                  Explore Job Opportunities
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className='w-full lg:w-3/5'>
            <div className='bg-slate-800/50 rounded-2xl p-6 md:p-8 shadow-lg'>
              <h2 className='text-2xl font-bold mb-6 text-teal-300'>Send us a Message</h2>

              <form onSubmit={handleSubmit} className='space-y-5'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                  <div>
                    <label htmlFor="name" className='block text-gray-300 mb-2'>Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className='w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className='block text-gray-300 mb-2'>Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className='w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className='block text-gray-300 mb-2'>Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className='w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                    placeholder="What is this regarding?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className='block text-gray-300 mb-2'>Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className='w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className='w-full py-3 bg-teal-700 hover:bg-teal-600 text-white rounded-lg transition-colors duration-300 font-medium mt-2'
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className='bg-slate-800/50 rounded-2xl p-6 md:p-8 shadow-lg mb-12'>
          <h2 className='text-2xl font-bold mb-6 text-teal-300'>Find Our Store</h2>
          <div className='rounded-xl w-full overflow-hidden h-80 bg-slate-700 relative'>
            {/* This would be your map component - using a placeholder for now */}
            {/* <div className='w-full h-full flex items-center justify-center bg-gradient-to-r from-slate-700 to-slate-800'>
              <div className='text-center'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className='text-gray-300'>Map would be embedded here</p>
                <p className='text-sm text-gray-400 mt-2'>A235, Club Rd Paschim Vihar, New Delhi-110063</p>
              </div>
            </div> */}
            <div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m21!1m12!1m3!1d13842.39364284929!2d77.1145199928891!3d28.670774736225695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m6!3e6!4m0!4m3!3m2!1d28.66783370776072!2d77.11794228256645!5e1!3m2!1sen!2sin!4v1758097891289!5m2!1sen!2sin"
                style={{ border: 0, width: "100%", display: "block" }} // ✅ FIXED HEIGHT ISSUE
                className='h-80'
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className='bg-slate-800/50 rounded-2xl p-6 md:p-8 shadow-lg'>
          <h2 className='text-2xl font-bold mb-6 text-teal-300'>Frequently Asked Questions</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-slate-700/50 p-5 rounded-lg'>
              <h3 className='font-semibold text-lg text-blue-100 mb-2'>What are your delivery hours?</h3>
              <p className='text-gray-300'>We deliver from 9 AM to 9 PM, seven days a week. Same-day delivery is available for orders placed before 2 PM.</p>
            </div>

            <div className='bg-slate-700/50 p-5 rounded-lg'>
              <h3 className='font-semibold text-lg text-blue-100 mb-2'>How can I track my order?</h3>
              <p className='text-gray-300'>Once your order is shipped, you'll receive a tracking number via email and SMS to monitor your delivery in real-time.</p>
            </div>

            <div className='bg-slate-700/50 p-5 rounded-lg'>
              <h3 className='font-semibold text-lg text-blue-100 mb-2'>What is your return policy?</h3>
              <p className='text-gray-300'>We offer a 30-day return policy for most items. Products must be unused and in original packaging with receipt.</p>
            </div>

            <div className='bg-slate-700/50 p-5 rounded-lg'>
              <h3 className='font-semibold text-lg text-blue-100 mb-2'>Do you offer international shipping?</h3>
              <p className='text-gray-300'>Currently, we only deliver within India. We're working to expand our services to other countries soon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;