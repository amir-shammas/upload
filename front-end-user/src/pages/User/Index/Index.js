import React, { useEffect, useState } from "react";
import Header from "./../../../Components/User/Header/Header";
import jalalimoment from 'jalali-moment';
import momenttimezone from "moment-timezone";
import { Link } from "react-router-dom";

import "./Index.css";

export default function Index() {

  const [posts , setPosts] = useState([]);

  // const getAllPosts = async () => {
  //   try{
  //     await fetch(`http://localhost:4000/posts/get-all-posts`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((res) => {
  //       if(!res.ok) throw new Error("fail to get all posts !");
  //       return res.json()
  //     })
  //     .then((result) => {
  //       // console.log(result);
  //       setPosts(result.allPosts);
  //     })
  //   }catch(error){
  //     console.log(error);
  //     return;
  //   }
  // }


  const getAllPosts = async () => {
    try{
      const res = await fetch(`http://localhost:4000/posts/get-all-posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if(!res.ok) throw new Error("fail to get all posts !");
      return res.json()
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
                      <div>کاربر <Link className="btn btn-success link-to-profile" to={`/get-other-user-profile/${post.user._id}`}>{post.user.username}</Link> در تاریخ {jalalimoment(post.createdAt).locale("fa").format("YYYY/MM/DD")} ساعت {momenttimezone(post.createdAt).tz("Asia/Tehran").format("HH:mm")} نوشت : </div>
                      <div>{post.content}</div>
                      <div className="post-operations">
                        <Link to={`/get-other-user-post/${post._id}`}> مشاهده جزییات پست </Link>
                        <span> تعداد دفعات مشاهده جزییات پست </span>
                        <button> لایک </button><span> تعداد لایک ها</span>
                        <button> دیسلایک </button><span> تعداد دیسلایک ها</span>
                      </div>
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
