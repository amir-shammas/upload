import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import jalalimoment from 'jalali-moment';
import momenttimezone from "moment-timezone";

import "./OtherUserPosts.css";
import Header from "../../../Components/User/Header/Header";


function OtherUserPosts() {

    const { otherUserId } = useParams();
    
    const [otherUserPosts , setOtherUserPosts] = useState([]);

    const getOtherUserPosts = async () => {
        try{
            await fetch(`http://localhost:4000/posts/get-other-user-posts/${otherUserId}`, {
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
                setOtherUserPosts(result.otherUserPosts);
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
            <div>
                {
                    otherUserPosts ?
                    (otherUserPosts.map((post) => {
                        return (
                            <div key={post._id}>
                                <div>
                                    <div>کاربر {post.user.username} در تاریخ {jalalimoment(post.createdAt).locale("fa").format("YYYY/MM/DD")} ساعت {momenttimezone(post.createdAt).tz("Asia/Tehran").format("HH:mm")} نوشت : </div>
                                </div>
                                <div>{post.content}</div>
                                <hr />
                            </div>
                        )
                    })) :
                    <h1> پستی یافت نشد . </h1>
                }
            </div>
        </>
    );
}

export default OtherUserPosts;
