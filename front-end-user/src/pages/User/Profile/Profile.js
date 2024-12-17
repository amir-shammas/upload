import React, { useEffect, useState } from "react";
// import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import jalalimoment from 'jalali-moment';
import momenttimezone from "moment-timezone";

import "./Profile.css";
import Header from "../../../Components/User/Header/Header";


function Profile() {
    // const location = useLocation();
    // const { userId, username, userBio, userCreatedAt } = location.state || {}; // Get the state passed from Index.js

    const { otherUserId } = useParams();

    const [otherUserProfile , setOtherUserProfile] = useState([]);
    
    const getOtherUserProfileById = async () => {
        try{
            await fetch(`http://localhost:4000/users/get-other-user-profile-by-id/${otherUserId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((res) => {
                if(!res.ok) throw new Error("fail to get other user profile !");
                return res.json()
            })
            .then((result) => {
                // console.log(result);
                setOtherUserProfile(result.responseProfile);
            })
        }catch(error){
            console.log(error);
            return;
        }
    }
    
    useEffect(() => {
        getOtherUserProfileById();
    }, []);

    return (
      <>
        <Header />
        <div className="profile">
            <h1>پروفایل کاربر</h1>
            <hr />
            {otherUserProfile ? (
                <div>
                    <h2> نام کاربری : {otherUserProfile.username}</h2>
                    <h2> تاریخ عضویت : {jalalimoment(otherUserProfile.createdAt).locale("fa").format("YYYY/MM/DD")}</h2>
                    <h2> بیوگرافی : {otherUserProfile.bio ? otherUserProfile.bio : " بیوگرافی یافت نشد . "}</h2>

                    <h2> پست ها : </h2>
                    <div>
                        {
                            otherUserProfile.posts ?
                            (otherUserProfile.posts.map((post) => {
                                return (
                                    <div key={post._id}>
                                        <div>
                                            <div>کاربر {otherUserProfile.username} در تاریخ {jalalimoment(post.createdAt).locale("fa").format("YYYY/MM/DD")} ساعت {momenttimezone(post.createdAt).tz("Asia/Tehran").format("HH:mm")} نوشت : </div>
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
