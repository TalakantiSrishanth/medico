"use client";
import { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";

export default function ClientHome(){
    const [data,setData]=useState([]);
    const [search,setSearch]=useState("");
    useEffect(()=>{
        async function getdiseases() {
           const res=await axios.get("/api/diseases");
           setData(res.data);
        }
        getdiseases();
    },[]);
    return (
        <>
        <div  className="text-white space-y-3"   style={{
        backgroundImage: "url('/images/MedicalBackground.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}>
       <div className="flex justify-between"> <h1 className="text-center grow text-4xl font-bold"> Display</h1> <input className="ml-auto"type="text" value={search} placeholder="search" onChange={(e)=>setSearch(e.target.value)}/> </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {data.filter((item)=>{
                if(search.length){
                    if(item.symptom.toLowerCase().includes(search.toLowerCase())) return true;
                    return false;
                }
                 return true;
            }
            ).map((item)=>{
               return <Card key={item.id} data={item}/>
            })}
        </div>
        </div>
       </>
    );
}