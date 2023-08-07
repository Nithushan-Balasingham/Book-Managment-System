import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NewBook() {


    const [title ,setTitle] = useState("")
    const [description,setDescription] = useState("")
    const navigate = useNavigate()

    const handleBookSubmit=async(e)=>{
        e.preventDefault()
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found');
        }
    
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const {data} = await axios.post('/api/books/addBook',{
            title:title,
            description:description
        },config)
        navigate('/allbooks')
        console.log(data)
    }
  return (
   <div className='text-green-400 font-semibold flex flex-col items-center justify-center'>
      <div>
        <h1 className='text-5xl font-extrabold text-green-400'>Add New Book</h1>
      </div>
        <form 
          onSubmit={handleBookSubmit} 
          className='flex flex-col bg-gray-600 rounded-2xl justify-center m-10 max-w-xl p-10'
          >
            <div className='flex flex-col items-center justify-center'>
            <input 
              type='text'
              className='w-full px-4 py-2 border rounded-lg m-3'
              placeholder='Enter the Title' 
              onChange={(e)=>setTitle(e.target.value)} 
              value={title}/>

            <input 
              type='text' 
              className='w-full px-4 py-2 border rounded-lg m-3'
              placeholder='Enter the description' 
              onChange={(e)=>setDescription(e.target.value)} 
              value={description}/>
            </div>
             <div className='flex items-center justify-center'>
              <button 
                className='rounded-lg text-2xl font-bold bg-blue-600 w-40 text-center hover:bg-green-200'>
              Add
            </button>
              </div>          
        </form>
    </div>
  )
}
