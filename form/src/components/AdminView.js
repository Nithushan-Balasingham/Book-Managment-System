import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function AdminView() {
  const [posts, setPosts] = useState([]);
  const [userRole, setUserRole] = useState('');
  const isRole = window.localStorage.getItem('Permission');
  const [selectedStatusMap, setSelectedStatusMap] = useState({});
  const [selectedBookId, setSelectedBookId] = useState('');
  const [showConfirmButton, setShowConfirmButton] = useState(false);

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
    axios
      .get('/api/books', config)
      .then((response) => {
        const booksData = response.data;
        setPosts(booksData);
        console.log(booksData);
        response.data.forEach((book) => console.log(book._id));

        if (booksData.length === 0) {
          console.log('No books found');
        }

        if (response.data.data === 'Token Expired') {
          alert('Expired Session');
          window.localStorage.clear();
          window.location.href = './sign-in';
        }
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
      });
    setUserRole(accessToken.user_role);
    console.log(accessToken.user_role);
  }, []);

  const handleStatus = (bookId, status) => {
    setSelectedStatusMap((prevSelectedStatusMap) => ({
      ...prevSelectedStatusMap,
      [bookId]: status,
    }));
    setSelectedBookId(bookId);
    setShowConfirmButton(true);
  };

  const handleBackButton = () => {
    setSelectedStatusMap({});
    setSelectedBookId('');
    setShowConfirmButton(false);
  };

  const confirmStatusUpdate = async (bookId) => {
    try {
      const status = selectedStatusMap[bookId];

      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axios.patch(`/api/books/book/${bookId}`, { status }, config);
      console.log(bookId);
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === bookId ? { ...post, status } : post))
      );
      setSelectedStatusMap((prevSelectedStatusMap) => ({
        ...prevSelectedStatusMap,
        [bookId]: undefined,
      }));
      setSelectedBookId('');
      setShowConfirmButton(false);
    } catch (error) {
      console.log('Error updating status:', error);
    }
  };

  const getBorderColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-gray-500';
      case 'declined':
        return 'bg-gray-500';
      case 'pending':
        return 'bg-gray-500';
      default:
        return '';
    }
  };

  const getChangeColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-500';
      case 'declined':
        return 'text-red-500';
      case 'pending':
        return 'text-blue-600';
      default:
        return '';
    }
  };

  return (
    <div>
    <h2 className='text-5xl text-red-500 font-medium flex items-center justify-center mb-6'>
      All Books
    </h2>
    <div>
      {isRole === 'admin' ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-4'>
          {posts.map((book) => (
            <div
              className={` ${
                getBorderColor(book.status)
              } rounded-lg flex flex-col justify-between`}
              key={book._id}
            >
              <div className='p-4 flex flex-col items-center justify-center'>
                <h5 className='text-3xl text-green-400 font-bold mb-3'>{book.title}</h5>
                <p className='text-xl text-green-300 font-bold mb-3'>{book.description}</p>
                <p className={`${getChangeColor(book.status)} text-xl font-bold`}>
                  {book.status}
                </p>
              </div>

              {selectedBookId === book._id && showConfirmButton ? (
                <div className='flex items-center justify-center'>
                  <button
                    className='rounded-lg text-xl font-bold bg-gray-400 w-32 m-4 text-center hover:bg-gray-600 h-10'
                    onClick={() => confirmStatusUpdate(book._id)}
                  >
                    Confirm
                  </button>
                  <button
                    className='rounded-lg text-xl font-bold bg-gray-400 w-32 m-4 text-center hover:bg-gray-600 h-10'
                    onClick={handleBackButton}
                  >
                    Back
                  </button>
                </div>
              ) : (
                <div className='flex items-center justify-center w-full  '>
                  <select
                    className={`border rounded-lg text-xl text-center font-medium text-black ${getChangeColor(
                      book.status
                    )}`}
                    value={selectedStatusMap[book.id] || ''}
                    onChange={(e) => handleStatus(book._id, e.target.value)}
                  >
                    <option value=''>Status</option>
                    <option value='approved'>Approved</option>
                    <option value='declined'>Declined</option>
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Not Authorized</p>
      )}
    </div>
  </div>
);
}