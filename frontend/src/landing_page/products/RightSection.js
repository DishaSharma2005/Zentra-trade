import React from "react";

function RightSection({
  imageUrl,
  tryDemo,
  productName,
  productDescription,
  learnMore,
  googlePlay,
  appStore,
}) {
  return (
    <div className="container">
      <div className="row align-items-center">
        
        {/* TEXT SECTION */}
        <div className="col-md-6">
          <h2>{productName}</h2>
          <p>{productDescription}</p>

          <div>
            {tryDemo && <a href={tryDemo}>Try Demo</a>}
            {tryDemo && learnMore && " | "}
            {learnMore && <a href={learnMore}>Learn More</a>}
          </div>

          <br />

          {googlePlay && (
            <a href={googlePlay}>
              <img
                src="media/images/googlePlayBadge.svg"
                alt="googlePlay"
                className="img-fluid m-2"
              />
            </a>
          )}

          {appStore && (
            <a href={appStore}>
              <img
                src="media/images/appstoreBadge.svg"
                alt="appStore"
                className="img-fluid m-2"
              />
            </a>
          )}
        </div>

        {/* IMAGE SECTION */}
        <div className="col-md-6 p-3 text-center">
          <img src={imageUrl} alt="productImage" className="img-fluid" />
        </div>

      </div>
    </div>
  );
}

export default RightSection;
