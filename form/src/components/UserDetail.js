import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Link, useNavigate, useParams} from 'react-router-dom'


const EmailComponent = () => {
  const isRole = window.localStorage.getItem('Permission');
  const {id} = useParams()
  const [posts, setPosts] = useState([]);
  const [updatedPost, setUpdatedPost] = useState({
    id:"",
    fname: "",
    email: "",
  });
  const navigate = useNavigate()
  const [show, setShow] = useState(false);
  const [title ,setTitle] = useState('')
  const [description , setDescription] = useState('')
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const logOut =()=>{
    window.localStorage.clear()
    window.location.href = "./sign-in";
 }

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

  axios.get('/api/users/current', config)
    .then((response) => {
      if (Array.isArray(response.data)) {
        setPosts(response.data);
      
      }
      if (typeof response.data === 'object' && response.data !== null) {
      setPosts([response.data]);
      console.log(response.data)
    }  

      if (response.data.data === "Token Expired") {
        alert("Expired Session");
        navigate("/");
        window.localStorage.clear();
        window.location.href = "./sign-in";
      }
    })
    .catch((error) => {
      console.log('Error fetching data:', error);
    });
}, []);
  const updatePost = ({id, fname, email }) => {
    setUpdatedPost((prev) => {
      return {
        ...prev,
        id: id,
        fname: fname,
        email: email
      };
    });
    handleShow();
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPost((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

const handleUserDelete =async()=>{
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('Access token not found');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }
  await axios.delete(`/api/users/${id}`,config)
  navigate('/')
}

  

  return (
    <div className='bg-gray-600 flex flex-col items-center justify-center relative top-10 w-full max-w-md border rounded-lg' style={{ margin: "auto auto", textAlign: "center" }}>
      <h1 className='text-black text-4xl mb-10 font-extrabold'>DETAILS</h1>
      {posts ? (
        <>
          {posts.map((post,index) => {
            return (
              <div
              key={index}

              >
                <h4 className='text-2xl text-blue-400 font-semibold m-3'>Email: {post.email}</h4>
                <p className='text-2xl text-blue-400 font-semibold m-3'>FirstName: {post.fname}</p>
                  <button
                  className='rounded-lg text-2xl font-bold w-20 m-3 bg-red-400 text-center hover:bg-red-200 h-10'        
                  style={{marginBottom: "1rem" }}
                    onClick={() => navigate(-1)}
                  >
                    BACK
                  </button>
                <div
                >
                  <div>
                  <div className='flex flex-row items-center justify-center'>
                    <div>
                      <button
                      className='rounded-lg text-2xl font-bold w-40 m-auto bg-green-400 text-center hover:bg-green-200 h-10'        
                      variant="outline-info"
                    >
                      <Link to={`/update/user/${post.id}`}>UPDATE</Link>
                    </button>
                    </div>
                  <div>
                  <button
                    className='rounded-lg text-2xl font-bold w-40 m-3 bg-green-400 text-center hover:bg-green-200 h-10'        
                    variant="outline-info"
                    onClick={() =>
                      handleUserDelete(post)
                    }
                  >
                   DELETE
                  </button>
                  </div>
                 
                  </div>
                  <div>
                  <button variant="primary" onClick={logOut} style={{width: "60%"}} className='rounded-lg text-2xl font-bold w-20 m-3 bg-green-400 text-center hover:bg-green-200 h-10'        
>
                      LogOut
                    </button>
                  </div>
                  <div > 
                  <button
                    className='rounded-lg text-2xl  font-bold w-20 m-3 bg-green-400 text-center hover:bg-green-200 h-10'        
                    variant="outline-info"
                    style={{ width: "40%" }}
                  ><Link to='/addBook'>ADD BOOK</Link>
                  </button>
                  </div>
                  <div > 
                  <button
                    className='rounded-lg text-2xl  font-bold w-20 m-3 bg-green-400 text-center hover:bg-green-200 h-10'        
                    variant="outline-info"
                    style={{ width: "40%"}}
                  ><Link to='/allbooks'>All Books</Link>
                  </button>
                  </div>
                  
                  <div>
                    {isRole === "admin" ?(
                     null
                    ): <button
                    className='rounded-lg text-2xl  font-bold w-20 m-3 bg-green-400 text-center hover:bg-green-200 h-10'
                    style={{ width: "60%" }}>
                    <Link to='/ownbook'>My Books</Link>
                    </button>}
                  </div>
                  <div>
                    {isRole === "admin" ?(
                      <button
                      className='rounded-lg text-2xl  font-bold w-20 m-3 bg-green-400 text-center hover:bg-green-200 h-10'
                      style={{ width: "60%" }}>
                      <Link to='/admin'>Requested Books</Link></button>
                    ):null}
                  </div>
                    
                  </div>

                  {/* <Button
                    onClick={() => deletePost(post._id)}
                    variant="outline-danger"
                    style={{ width: "100%" }}
                  >
                    DELETE
                  </Button> */}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        ""
      )}
    </div>
  );
}



export default EmailComponent;

