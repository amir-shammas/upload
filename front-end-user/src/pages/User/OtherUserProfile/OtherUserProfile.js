import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import jalalimoment from 'jalali-moment';
import { Link } from "react-router-dom";

import "./OtherUserProfile.css";
import Header from "../../../Components/User/Header/Header";


function OtherUserProfile() {

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
            <h1>
                <img className="avatar-image" src={otherUserProfile.avatarUrl || "/images/default-avatar.png"} />
                <span className="profile-title"> پروفایل کاربر </span>
            </h1>
            <hr />
            {otherUserProfile ? (
                <div>
                    <h2> نام کاربری : {otherUserProfile.username}</h2>
                    <h2> تاریخ عضویت : {jalalimoment(otherUserProfile.createdAt).locale("fa").format("YYYY/MM/DD")}</h2>
                    <h2> بیوگرافی : {otherUserProfile.bio ? otherUserProfile.bio : " بیوگرافی یافت نشد . "}</h2>
                    <h2>
                        <div className="follow-operations">
                            <button> فالو </button><button> آنفالو </button><span> تعداد فالوورها </span>
                        </div>
                    </h2>
                    <h2><Link to={`/get-other-user-posts/${otherUserId}`}> مشاهده همه پست های این کاربر </Link></h2>
                </div>
            ) : (
                <h1> پروفایل کاربر یافت نشد . </h1>
            )}
        </div>
      </>
    );
}

export default OtherUserProfile;
