import React from 'react';
function Hero() {
    return (  
        <div className='container p-5'>
            <div className='row text-center'>
                   <img src="media/images/homeHero.png" class="img-fluid rounded mb-5" width="1100" height="1000" alt="image" />
               <h1 class="mt-5">Investing for everyone</h1>
               <p>Online platform to invest in stocks </p>
               <button className='btn btn-primary fs-5' style={{width:"25%", margin: "0 auto"}}>Signup Now </button>
            </div>

        </div>
    );
}

export default Hero;