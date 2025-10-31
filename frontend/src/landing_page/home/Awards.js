import React from 'react';
function Awards() {
    return (  
        <div className='container mt-5'>
            <div className='row'>
                <div className ='col-6 p-5'>
                    <img src='media/images/largestBroker.svg' />
                </div>
                <div className ='col-6 p-5 mt-5'>
                    <h2>Largest Stock Broker </h2>
                    <p className='mb-5'>2+ million Zerodha clients contribute to over 15% of all retail order volumes
                        in india daily by trading and investing in : </p>
                        <div className='row'>
                            <div className='col-6'>
                                <ul>
                                    <li>Equities</li>
                                    <li>Derivatives</li>
                                    <li>Commodities</li>
                                </ul>
                            </div>
                            <div className='col-6'>
                                <ul>
                                    <li>Mutual Funds</li>
                                    <li>Bonds</li>
                                    <li>ETFs</li>
                                </ul>
                            </div>
                        </div>
                  <img src='media/images/pressLogos.png' className='mt-4' width="600" height="40"/>      
                </div>
            </div>
        </div>

    );
}

export default Awards;