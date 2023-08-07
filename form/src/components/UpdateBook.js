import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function UpdateBook() {
    const {id} = useParams()
    const[title,setTitle] = useState('')
    const[description,setDescription] = useState('')
    const navigate = useNavigate()

    useEffect(()=>{
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found');
        }
    
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const getDatabyId = async()=>{
            const {data}= await axios.get(`/api/books/${id}`,config)
            setTitle(data.title)
            setDescription(data.description)
            console.log(data)
        }

        getDatabyId()
    },[id])
    const updatehandleInput = async(e)=>{
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
        const data ={
          title:title,
          description:description
        }
        await axios.put(`/api/books/${id}`,data,config)
        navigate('/allbooks')
      }
  return (
    <div>
      <h1 className='text-4xl text-green-400 m-4 relative '>Update Book</h1>
      <div className='flex items-center justify-center relative top-40 ' >
        <form  className='flex flex-col bg-gray-300 rounded-2xl w-2/5  h-60 justify-center'onSubmit={updatehandleInput}>
            <input 
              className='w-150 px-2 py-1 border rounded-lg m-2'
              type='text' 
              placeholder='Enter Title' 
              onChange={(e)=>setTitle(e.target.value)} 
              value={title}
            />
            <input 
              type='text'
              className='w-150 px-2 py-1 border rounded-lg m-2' 
              placeholder='description'  
              onChange={(e)=> setDescription(e.target.value)} 
              value={description}/>
              <div className='flex items-center justify-center'>
              <button 
              className='rounded-lg text-2xl font-bold bg-gray-400 w-60 m-4 text-center flex items-center justify-center hover:bg-gray-600 h-15'
              >Add</button>
              </div>
            
        </form>
        </div>
    </div>
  )
}
