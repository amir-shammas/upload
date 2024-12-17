import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import jalalimoment from 'jalali-moment';
import momenttimezone from "moment-timezone";

import "./OtherUserPost.css";
import Header from "../../../Components/User/Header/Header";

function OtherUserPost() {
  
    const { postId } = useParams();
        
        const [otherUserPost , setOtherUserPost] = useState({});
    
        const getOtherUserPost = async () => {
            try{
                await fetch(`http://localhost:4000/posts/get-one-post/${postId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then((res) => {
                    if(!res.ok) throw new Error("fail to get other user post !");
                    return res.json()
                })
                .then((result) => {
                    // console.log(result);
                    setOtherUserPost(result.onePost);
                })
            }catch(error){
                console.log(error);
                return;
            }
        }
    
        useEffect(() => {
            getOtherUserPost();
        }, []);
    
        return (
            <>
                <Header />
                <div>
                    {
                        otherUserPost ?
                                <div className="single-post">
                                    <div>
                                        <div>کاربر {otherUserPost.user?.username} در تاریخ {jalalimoment(otherUserPost.createdAt).locale("fa").format("YYYY/MM/DD")} ساعت {momenttimezone(otherUserPost.createdAt).tz("Asia/Tehran").format("HH:mm")} نوشت : </div>
                                    </div>
                                    <div>{otherUserPost.content}</div>
                                </div>

                        :
                        <h1> پستی یافت نشد . </h1>
                    }
                </div>
            </>
        );

}

export default OtherUserPost;
