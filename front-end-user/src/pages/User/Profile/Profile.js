import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import jalalimoment from 'jalali-moment';
import momenttimezone from "moment-timezone";

import "./Profile.css";
import Header from "../../../Components/User/Header/Header";


function Profile() {
    const location = useLocation();
    const { userId, username, userBio, userCreatedAt } = location.state || {}; // Get the state passed from Index.js

    const [posts , setPosts] = useState([]);
    
    const getOtherUserPosts = async () => {
        try{
            await fetch(`http://localhost:4000/posts/get-other-user-posts/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((res) => {
                if(!res.ok) throw new Error("fail to get other user posts !");
                return res.json()
            })
            .then((result) => {
                // console.log(result);
                setPosts(result.otherUserPosts);
            })
        }catch(error){
            console.log(error);
            return;
        }
    }
    
    useEffect(() => {
        getOtherUserPosts();
    }, []);

    return (
      <>
        <Header />
        <div className="profile">
            <h1>پروفایل کاربر</h1>
            <hr />
            {userId ? (
                <div>
                    <h2> نام کاربری : {username}</h2>
                    <h2> تاریخ عضویت : {jalalimoment(userCreatedAt).locale("fa").format("YYYY/MM/DD")}</h2>
                    <h2> بیوگرافی : {userBio ? userBio : " بیوگرافی یافت نشد . "}</h2>

                    <h2> پست ها : </h2>
                    <div>
                        {
                            posts ?
                            (posts.map((post) => {
                                return (
                                    <div key={post._id}>
                                        <div>
                                            <div>کاربر {username} در تاریخ {jalalimoment(post.createdAt).locale("fa").format("YYYY/MM/DD")} ساعت {momenttimezone(post.createdAt).tz("Asia/Tehran").format("HH:mm")} نوشت : </div>
                                        </div>
                                        <div>{post.content}</div>
                                        <hr />
                                    </div>
                                )
                            })) :
                            <h1> پستی یافت نشد . </h1>
                        }
                    </div>
                </div>
            ) : (
                <h1> پروفایل کاربر یافت نشد . </h1>
            )}
        </div>
      </>
    );
}

export default Profile;
