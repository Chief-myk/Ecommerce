import React from 'react'

const Title = ({ text1, text2 }) => {
    return (
        <div className='flex flex-col md:flex-row gap-2 justify-center items-center mb-8 text-3xl md:text-4xl font-bold'>
            <p className='text-blue-100'>{text1}</p>
            <span className='text-teal-300'>{text2}</span>
        </div>
    );
};


export default Title