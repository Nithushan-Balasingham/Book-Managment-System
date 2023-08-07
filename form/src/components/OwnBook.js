import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function OwnBook() {
  const [posts, setPosts] = useState([]);
  const isOwner = window.localStorage.getItem('IdOf');

  useEffect(() => {
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
  }, []);

  const handleDelete = async(id) => {
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
    console.log("Deleting book with ID:", id);
  };


  
  const getStatusColor = (status)=>{
    switch (status){
      case "approved":
        return "bg-green-500";

      case "declined":
        return "bg-red-500";
      
      case "pending":
        return "bg-blue-500"

      default:
        return
    }
  }
  const getTextColor = (status)=>{
    switch (status){
      case "approved":
        return "text-green-500";

      case "declined":
        return "text-red-500";
      
      case "pending":
        return "text-blue-200"

      default:
        return
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <h2 className='text-5xl text-red-500 font-medium text-center my-6'>My Books</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-4'>
        {posts.map((book) => {
          if (isOwner === book.user_id._id) {
            return (
              <div key={book._id} className={`rounded-lg ${getStatusColor(book.status)} bg-slate-500 m-4 flex flex-col justify-center` }>
                <div className=' bg-slate-500 rounded-lg'>
                  <div className='m-3 flex flex-col items-center justify-center'>
                    <h5 className='text-3xl m-2'>
                      {book.title}
                    </h5>
                    <h5 className='text-3xl m-2'>
                      {book.description}
                    </h5>
                    <h5 className={`text-3xl m-2 ${getTextColor(book.status)}`}>
                      {book.status}
                    </h5>
                      <button
                        className='rounded-lg text-2xl font-bold bg-gray-400 w-60 m-4 text-center flex items-center justify-center hover:bg-gray-600 h-15'
                        onClick={() => handleDelete(book._id)}>Delete</button>
                      <button
                        className='rounded-lg text-2xl font-bold bg-gray-400 w-60 m-4 text-center flex items-center justify-center hover:bg-gray-600 h-15'>
                        <Link to={`update/${book._id}`}>Update</Link>
                      </button>
                    </div>
                  </div>
                </div>
            );
          } else {
            return null; // Skip rendering if the book doesn't belong to the user
          }
        })}
      </div>
    </div>
  );
  } 

