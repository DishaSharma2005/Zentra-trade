 import React from 'react'
 import Hero from './Hero'
 import LeftSection from './LeftSection'
 import RightSection from './RightSection'
 import Universe from './Universe'
 
  function product() {
   return (
     <>
       <Hero />
       <LeftSection
         imageUrl="media/images/kite.png"
         tryDemo=""
         productName="Kite"
         productDescription="Our ultra-fast flagship trading platform with streaming market data, advanced charts, an elegant UI, and more. Enjoy the Kite experience seamlessly on your Android and iOS devices."
         learnMore=""
         googlePlay=""
         appStore=""
       />
       <RightSection
          imageUrl="media/images/console.png"
          tryDemo=""
          productName="Console"
          productDescription="The central dashboard for your Zerodha account. Gain insights into your trades and investments with in-depth reports and visualisations."
          learnMore=""
          googlePlay=""
          appStore=""
        />

        <LeftSection
         imageUrl="media/images/coin.png"
         tryDemo=""
         productName="Coin"
         productDescription="Buy direct mutual funds online, commission-free, delivered directly to your Demat account. Enjoy the investment experience on your Android and iOS devices."
         learnMore=""
         googlePlay=""
         appStore=""
       />
        <RightSection
          imageUrl="media/images/console.png"
          tryDemo=""
          productName="Console"
          productDescription="Build powerful trading platforms and experiences with our super simple HTTP/JSON APIs. If you are a startup, build your investment app and showcase it to our clientbase."
          learnMore=""
          googlePlay=""
          appStore=""
        />
        <LeftSection
         imageUrl="media/images/kiteconnect.png"
         tryDemo=""
         productName="kite connect"
         productDescription="An easy to grasp, collection of stock market lessons with in-depth coverage and illustrations. Content is broken down into bite-size cards to help you learn on the go."
         learnMore=""
         googlePlay=""
         appStore=""
       />
       <Universe />
     </>
   );
 }
 export default product;