import React from 'react';
function Hero() {
    return (  
        <div className='container p-3 p-md-5'>
            <div className='row text-center'>
                <div className='col-12'>
                   <img src="media/images/homeHero.png" className="img-fluid rounded mb-4 mb-md-5" alt="image" />
                   <h1 className="mt-4 mt-md-5 fs-2 fs-md-1">Investing for everyone</h1>
                   <p className="fs-6 fs-md-5">Online platform to invest in stocks </p>
                   <button className='btn btn-primary fs-6 fs-md-5' style={{width: "100%", maxWidth: "250px", margin: "0 auto"}}>Signup Now </button>
                </div>
            </div>

        </div>
    );
}

export default Hero;