import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function Testing() {
    const [posts, setPosts] = useState([]);

    
  useEffect(() => {
    axios
      .get("api/posts/allUsers")
      .then((res) => {
        console.log(res);
        setPosts(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    
    <div>
        <h1>TESTING</h1>
    </div>
  )
}
