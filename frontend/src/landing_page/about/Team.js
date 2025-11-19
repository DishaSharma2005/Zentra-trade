import react from 'react';
function Team() {
return (
 <div className="container">
        <div className="row p-4 mt-5 mb-5 border-top">
            <h1 className='fs-2 mt-3 text-center'>
                People behind the technology.
            </h1>
        </div>
        <div className="row p-4 mt-2 mb-5  text-muted fs-5 " style={{lineHeight:"1.7"}}>
            <div className="col-md-6 p-3" style={{textAlign: "center"}}>
                 <img src="/media/images/nithinKamath.jpg" alt="Nithin Kamath" style={{width:"50%", borderRadius:"100%"}}/>
                 
                     <h3 className='mt-3'>Nithin Kamath</h3>
                     <p>Founder & CEO</p>
                 
            </div>
            <div className="col-md-6 p-3 fs-5.7" >
                   <p>Nithin Kamath is the founder and CEO of Zerodha. He started his trading journey in 2003 and after years of experience in the markets, he founded Zerodha in 2010 with the vision to make trading and investing accessible to everyone in India.</p>
                     <p>Under his leadership, Zerodha has grown to become India's largest retail stockbroker, known for its innovative technology and customer-centric approach. Nithin is passionate about leveraging technology to simplify financial markets and empower individual investors.</p>
            </div>
        </div>
    </div>
);
}
export default Team;    