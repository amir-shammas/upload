import React, { useEffect, useState } from "react";
import Header from "./../../../Components/User/Header/Header";
import moment from 'jalali-moment';

import "./Index.css";

export default function Index() {

  const [posts , setPosts] = useState([]);

  const getAllPosts = async () => {
    try{
      await fetch(`http://localhost:4000/posts/get-all-posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if(!res.ok) throw new Error("fail to get all posts !");
        return res.json()
      })
      .then((result) => {
        // console.log(result);
        setPosts(result.allPosts);
      })
    }catch(error){
      console.log(error);
      return;
    }
  }

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <>
      <Header />
      <section className="section-posts">
        {
          posts.length === 0
          ? <h1>پستی وجود ندارد</h1>
          : (
              posts.map((post) => {
                return (
                  <div key={post._id}>
                    <div>
                      <div>{post.user.username}</div>
                      {/* <div>{post.createdAt}</div> */}
                      {/* <div>{moment(post.createdAt, 'YYYY/MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm')}</div> */}
                      <div>{moment(post.createdAt, 'YYYY/MM/DD HH:mm').locale('fa').format('YYYY/MM/DD')}</div>
                      <div>{moment(post.createdAt, 'YYYY/MM/DD HH:mm').locale('fa').format('HH:mm')}</div>
                      <div>{post.content}</div>
                    </div>
                    <hr />
                  </div>
                )
              })
          )
        }
      </section>
    </>
  );
}
