import React from 'react'
import { Link } from 'react-router-dom';

function Stats() {
    return ( 
    <div className='container p-3 p-md-4'>
        <div className='row'>
            <div className='col-12 col-md-6 mb-4 mb-md-0'>
                <h1 className='mb-4 mt-4 fs-3 fs-md-1 text-center text-md-start'>Trust with confidence</h1>
                <h3 className='mb-2 mt-2'>Customer-first always</h3>
                <p className='text-muted'>That's why 1.6+ crore customers trust Zerodha with ~ ₹6 lakh crores of 
                     investments, making us India’s largest broker; contributing to 15% of daily retail exchange volumes in India.</p>
                <h3 className='mb-2 mt-2'>No spam or gimmicks</h3>
                <p className='text-muted'>No gimmicks, spam, "gamification", or annoying push notifications. 
                    High quality apps that you use at your pace, the way you like.</p>
                <h3 className='mb-2 mt-2'>The Zerodha universe</h3>
                <p className='text-muted'>Not just an app, but a whole ecosystem. Our investments in 30+ fintech 
                    startups offer you tailored services specific to your needs.</p>
                <h3 className='mb-2 mt-2'>Do better with money</h3> 
                <p className='text-muted'>With initiatives like Nudge and Kill Switch, we don't just facilitate transactions, 
                    but actively help you do better with your money.</p>   
            </div>
            <div className='col-12 col-md-6 mt-4 mt-md-5 text-center text-md-start'>
                <img src="media/images/ecosystem.png" alt="Users Icon" className="img-fluid mb-4" />
                <div className='d-flex flex-column flex-md-row justify-content-center justify-content-md-start gap-3'>
        
                    <Link  to='/product' className='text-decoration-none'>Explore our Products <i className="fa fa-long-arrow-right"></i></Link>
                    <Link  to='/product' className='text-decoration-none'>Try our demo kit <i className="fa fa-long-arrow-right"></i></Link>
                </div>
            </div>
        </div>
    </div>);
}

export default Stats;