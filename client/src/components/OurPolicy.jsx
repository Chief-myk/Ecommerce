import { Headphones, RotateCcw, BadgeCheck, Shield, Truck, CreditCard } from 'lucide-react';
import React from 'react';
import Title from './Title';

const OurPolicy = () => {
  

    const PolicyCard = ({ icon, title, description, color = 'teal' }) => {
        const colorClasses = {
            teal: 'text-teal-300',
            blue: 'text-blue-400',
            purple: 'text-purple-400',
            amber: 'text-amber-400'
        };

        return (
            <div className='flex flex-col items-center p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
                <div className={`p-4 rounded-full bg-slate-700 mb-4 ${colorClasses[color]}`}>
                    {icon}
                </div>
                <h2 className={`text-xl font-semibold mb-3 ${colorClasses[color]}`}>{title}</h2>
                <p className='text-blue-100/80 text-center'>{description}</p>
            </div>
        );
    };

    return (
        <section className='container mx-auto px-4 py-16 md:py-20'>
            <header className='text-center mb-16'>
                <Title text1={"OUR"} text2={"POLICY"} />
                <p className='text-blue-100/80 max-w-2xl mx-auto text-lg'>
                    Customer-Friendly Policies - Committed to Your Satisfaction And Safety
                </p>
            </header>
            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
                <PolicyCard
                    icon={<RotateCcw size={32} />}
                    title="Easy Exchange Policy"
                    description="Exchange made easy, quick, simple and customer friendly"
                    color="teal"
                />
                
                <PolicyCard
                    icon={<BadgeCheck size={32} />}
                    title="7 Day Return Policy"
                    description="Shop with confidence - 7 days easy guarantee"
                    color="blue"
                />
                
                <PolicyCard
                    icon={<Headphones size={32} />}
                    title="24/7 Customer Support"
                    description="Trusted Customer Support - Your satisfaction is our priority"
                    color="purple"
                />
                
                <PolicyCard
                    icon={<Shield size={32} />}
                    title="Secure Payments"
                    description="Your transactions are protected with advanced security"
                    color="amber"
                />
                
                <PolicyCard
                    icon={<Truck size={32} />}
                    title="Free Shipping"
                    description="Free delivery on orders above ₹999 across India"
                    color="teal"
                />
                
                <PolicyCard
                    icon={<CreditCard size={32} />}
                    title="Flexible Payment Options"
                    description="Multiple payment methods including EMI options"
                    color="blue"
                />
            </div>

            <div className='mt-16 text-center bg-slate-800/30 p-8 rounded-2xl backdrop-blur-sm'>
                <h3 className='text-xl font-semibold text-teal-300 mb-4'>Our Commitment to You</h3>
                <p className='text-blue-100/80 max-w-3xl mx-auto'>
                    We believe in transparent, customer-first policies that ensure your shopping experience 
                    is hassle-free and enjoyable. Every policy is designed with your convenience and satisfaction in mind.
                </p>
            </div>
        </section>
    );
};

export default OurPolicy;