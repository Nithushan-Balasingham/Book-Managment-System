import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function AllBooks() {
  const [posts, setPosts] = useState([]);
  const isOwner = window.localStorage.getItem('IdOf');
  const isRole = window.localStorage.getItem('Permission');

  
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    axios.get('/api/books', config)
      .then((response) => {
        const booksData = response.data; // Assuming response.data is the array of book objects
        setPosts(booksData); // Set the entire array of book objects as the posts state
        response.data.forEach(book => console.log(book.user_id._id));
        console.log(booksData)
        if (booksData.length === 0) {
          console.log('No books found');
        }

        if (response.data.data === "Token Expired") {
          alert("Expired Session");
          window.localStorage.clear();
          window.location.href = "./sign-in";
        }
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
      });
 
      const handleDelete = async(id)=>{
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found');
        }
    
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        await axios.delete(`/api/books/${id}`,config)
        window.location.reload()
      }


  

  return (
    <div style={{ width: '100%' }}>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 m-4'>
       {posts.map((book) => (
          book.status == "approved" && (
        <div  key={book._id} style={{ marginBottom: '20px' }} className='mb-4'>
          <div >
          <div className='bg-gray-300 flex flex-col m-4 items-center border rounded-xl shadow-lg h-100 grid-cols-4 gap-4'>
              <div className='flex flex-col items-center justify-center'      
              >
                 <h5
                 className='text-4xl  bg-gradient-to-r from-gray-600 to-gray-1000 bg-clip-text'
                >
                  {book.title}
                </h5>
                <p className='text-3xl text-blue-500 p-2'>Author : {book.user_id.fname}</p>
                <p className='text-2xl  text-green-400 p-2'>Description : {book.description}</p>
               
              </div>
              {isOwner === book.user_id._id || isRole === "admin" ?(
                <div>
                  <button className='rounded-lg text-2xl font-bold bg-gray-400 w-60 m-4 text-center flex items-center justify-center hover:bg-gray-600 h-15' 
                  onClick={() => handleDelete(book._id)}>Delete</button>
                  <button className='rounded-lg text-2xl font-bold bg-gray-400 w-60 m-4 text-center flex items-center justify-center hover:bg-gray-600 h-15'>
                    <Link to={`update/${book._id}`}>Update</Link></button>
                </div>
              ):<p> </p>}
            </div>
          </div>
        </div>
        )
       )
      )}
    </div>
  </div>
  )} 
