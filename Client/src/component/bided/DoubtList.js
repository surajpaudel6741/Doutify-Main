import React, { useEffect, useState } from 'react';
import BidPopup from './BidPopup';
import Cookies from "js-cookie"
import './styles.css'; // Import CSS for styles



const DoubtList = () => {
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [doubts , setDoubts] = useState(null)
  const [doubtid, setDoubtId] = useState(null)
  const [doubtTitle, setDoubtTitle] = useState(null)
  const token = Cookies.get("token")
  
  console.log("doubt length")
   doubts && console.log(doubts.length)

  useEffect(()=>{
    const arraydata = []
    
    console.log("useeffect section .......")
    

    // fetch logic 
    try{
      fetch("http://localhost:8080/request/biddedlist", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'

        },
         
        body: JSON.stringify( {
          username:"sg"
        })
      }).then((data)=>data.json())
        .catch((err)=>console.log(err))
        .then((data)=>
        {
          console.log("data is ")
          console.log(data)
     

          data.doubtlists.map((d)=>{
            arraydata.push(JSON.parse(d))
          })

          console.log(arraydata)

          setDoubts(arraydata)
        }
        )
    }

    catch(err){
      console.log(err)
    }

  },[])




  const handleDoubtClick = (doubt,doubtId, doubtTitle) => {
    setSelectedDoubt(doubt);
    setDoubtId(doubtId)
    setDoubtTitle(doubtTitle)

  };

  const closePopup = () => {
    setSelectedDoubt(null);
  };

  
  return (
    <div className="doubt-list-container">
      <h2 className="header">Your Posted Doubts</h2>
      <ul className="doubt-list">
        {  Array.isArray(doubts) && doubts.map((doubt) => (
          // instead of doubts send the doubts on click
          <li key={doubt.id} className="doubt-item" onClick={() => handleDoubtClick(doubts,doubt.doubtId,doubt.doubtTitle)}>
            {doubt.doubtTitle} <span className="date-posted">({doubt.datePosted})</span>
          </li>
        ))}
      </ul>
      {selectedDoubt && 
      <BidPopup 
      doubt={selectedDoubt} 
      doubtid={doubtid}
      expertname={selectedDoubt.expertname} 
      finalPrice={selectedDoubt.finalPrice}  
      time = {selectedDoubt.finalTime}
      selectedDoubt = {setSelectedDoubt}
      onClose={closePopup}
       />}
    </div>
  );
};

export default DoubtList;