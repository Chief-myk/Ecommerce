import React from 'react';
import Title from '../components/Title';
const About = () => {


  const FeatureCard = ({ title, description, icon }) => {
    return (
      <div className='flex flex-col items-center bg-slate-800 border border-gray-700 rounded-xl p-6 md:p-8 transition-all duration-300 hover:bg-slate-750 hover:shadow-lg hover:-translate-y-1'>
        <div className='mb-4 p-3 bg-teal-700/20 rounded-full'>
          {icon}
        </div>
        <h3 className='font-semibold text-lg mb-3 text-teal-300'>{title}</h3>
        <p className='text-center text-gray-300'>{description}</p>
      </div>
    );
  };

  return (
    <div className='relative min-h-screen pt-24 pb-16 bg-gradient-to-l from-slate-700 to-slate-900'>
      <div className='container mx-auto px-4 md:px-8'>
        {/* Hero Section */}
        <div>
          <Title text1={"ABOUT"} text2={"US"} />
          <p className='text-center text-gray-300 max-w-2xl mx-auto mb-12'>
            Learn more about our story, mission, and what makes us the preferred choice for thousands of customers.
          </p>
        </div>

        {/* Main Content */}
        <div className='flex flex-col md:flex-row justify-between items-center gap-10 mb-16'>
          <div className='w-full md:w-2/5 flex justify-center'>
            <div className='relative'>
              <img 
                src="/dark.jpg" 
                alt="Our eCommerce store" 
                className='w-full max-w-md rounded-2xl object-contain shadow-lg'
              />
              <div className='absolute -bottom-4 -right-4 w-24 h-24 bg-teal-400/10 rounded-xl border-2 border-teal-300/30 z-0'></div>
            </div>
          </div>
          
          <div className='w-full md:w-3/5 text-white space-y-4'>
            <p className='text-lg'>
              Our eCommerce store is built to provide a seamless shopping experience with a modern, user-friendly interface. 
              We offer a wide range of products carefully curated to meet the diverse needs of our customers, ensuring both quality and affordability.
            </p>
            <p className='text-lg'>
              From browsing to checkout, every step is optimized for convenience, allowing you to shop effortlessly from any device. 
              What makes our store unique is our focus on customer satisfaction and trust.
            </p>
            <p className='text-lg'>
              From browsing to checkout, every step is optimized for convenience, allowing you to shop effortlessly from any device. 
              What makes our store unique is our focus on customer satisfaction and trust.
            </p>
            <p className='text-lg'>
              From browsing to checkout, every step is optimized for convenience, allowing you to shop effortlessly from any device. 
              What makes our store unique is our focus on customer satisfaction and trust.
            </p>
            
            <div className='bg-slate-800/50 -ml-7 p-5 rounded-xl mt-6'>
              <h2 className='text-xl  font-semibold mb-3 text-teal-300'>Our Mission</h2>
              <p>
                Beyond just selling products, we aim to build a community of happy shoppers. Our dedicated support team is always ready to assist with queries, 
                while our personalized recommendations and exclusive offers keep customers engaged.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className='mb-12'>
          <Title text1={"Why"} text2={"Choose Us"} />
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-10'>
            <FeatureCard 
              title="Quality Assurance"
              description="Every product undergoes rigorous quality checks to ensure you receive only the best. We partner with trusted suppliers and maintain strict quality control standards."
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>}
            />
            
            <FeatureCard 
              title="Convenience"
              description="Shop anytime, anywhere with our mobile-optimized platform. Fast checkout, multiple payment options, and hassle-free returns make shopping a pleasure."
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>}
            />
            
            <FeatureCard 
              title="Exceptional Service"
              description="Our customer support team is available 24/7 to assist you. We believe in going the extra mile to ensure your complete satisfaction with every purchase."
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>}
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className='bg-slate-800/30 rounded-2xl p-6 mb-12'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='text-center p-4'>
              <div className='text-3xl font-bold text-teal-300 mb-2'>10K+</div>
              <div className='text-gray-300'>Happy Customers</div>
            </div>
            <div className='text-center p-4'>
              <div className='text-3xl font-bold text-teal-300 mb-2'>500+</div>
              <div className='text-gray-300'>Products</div>
            </div>
            <div className='text-center p-4'>
              <div className='text-3xl font-bold text-teal-300 mb-2'>95%</div>
              <div className='text-gray-300'>Positive Reviews</div>
            </div>
            <div className='text-center p-4'>
              <div className='text-3xl font-bold text-teal-300 mb-2'>24/7</div>
              <div className='text-gray-300'>Support</div>
            </div>
          </div>
        </div>

        {/* Team Values */}
        {/* <div className='bg-slate-800/50 rounded-2xl p-8'>
          <h2 className='text-2xl font-bold text-center mb-8 text-teal-300'>Our Values</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <h3 className='text-xl font-semibold mb-3 text-blue-100'>Customer First</h3>
              <p className='text-gray-300'>Every decision we make is with our customers in mind. Your satisfaction is our ultimate goal.</p>
            </div>
            <div>
              <h3 className='text-xl font-semibold mb-3 text-blue-100'>Innovation</h3>
              <p className='text-gray-300'>We continuously improve our platform and services to provide you with the best shopping experience.</p>
            </div>
            <div>
              <h3 className='text-xl font-semibold mb-3 text-blue-100'>Transparency</h3>
              <p className='text-gray-300'>We believe in honest business practices, clear communication, and straightforward policies.</p>
            </div>
            <div>
              <h3 className='text-xl font-semibold mb-3 text-blue-100'>Community</h3>
              <p className='text-gray-300'>We support local suppliers and give back to the community through various initiatives.</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default About;