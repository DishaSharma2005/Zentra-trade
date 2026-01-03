import React from 'react'

function LeftSection({ imageUrl,tryDemo,productName , productDescription ,learnMore ,googlePlay, appStore})  {
    return (  
        <div className="container mt-5 mb-5"> 
           <div className="row">
                <div className="col-md-6 p-3">
                    <img src={imageUrl} alt="productImage" className="img-fluid"/>
                </div>
                 <div className="col-md-6">
                    <h2>{productName}</h2>
                    <p>{productDescription}</p>
                    <div> <a href={tryDemo}>tryDemo</a> &nbsp; | &nbsp; 
                    <a href={learnMore}>learnMore</a>
                    </div>
                    <br/>
                    <a href={googlePlay}><img src= " media/images/googlePlayBadge.svg" alt="googlePlay" className="img-fluid m-2"/></a>
                    <a href={appStore}><img src= " media/images/appstoreBadge.svg"alt="appStore" className="img-fluid m-2"/></a>  
                    
                    </div>   
           </div>
        </div>
     );
}
export default LeftSection;
