"use client"
import { useState, useRef, useEffect } from "react"
import activityData from "@/types/activity"
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function VideoForm() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const[startingTime, setStartingTime] = useState(Date.now());
    const [activity, setActivity] = useState<activityData>({
        userId: 'Rocky',
        activity: {
            courseId: 3855,
            lessonId: 2,
            itemId: "B-2",
            itemType: "Video",
            details: [{
                timestamp: Date.now(),
                activityType: 'Answer',
                timeSpent: 0,
                activityResponse: '', 
              }]
        }
    );

    const handleVideoEvent = (event: any) => {
        const type = event.type;
        const endTime = Date.now();
        const startTime = startingTime;
        const timeSpent = endTime - startTime;
    
        setActivity(prevActivity => {
            const updatedActivity = {
                ...prevActivity,
                activity: {
                    ...prevActivity.activity,
                    details: [//{
                        {
                            timestamp: endTime,
                            activityType: type.charAt(0).toUpperCase() + type.slice(1),
                            timeSpent: timeSpent
                        }
                    ]
                        // ...prevActivity.activity.details,
                        // 1: {
                        //     timestamp: endTime,
                        //     activityType: type.charAt(0).toUpperCase() + type.slice(1),
                        //     timeSpent: timeSpent,
                        // }
                    //}
                }
            };
            return updatedActivity;
        });
        
        console.log(type)
        sendActivityUpdate();
    };

    const handleVideoSkipEvent = (event: any) => {
        const type = event.type;
        console.log("HI")
        /*
        setActivity(prevActivity => {
            const updatedActivity = {
                ...prevActivity
            }
        })
        */
    }

    // Function to send updated activity data to API
    const sendActivityUpdate = async () => {
        try {
            // axios.post(`${apiUrl}/info`, acztivity);
            axios.post(`${apiUrl}`, activity);
            setStartingTime(Date.now());
            console.log(activity);
        } catch (error) {
            console.error('Error updating activity:', error);
        }
    };

    // Attach event listeners on component mount
    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.addEventListener('play', handleVideoEvent);
            videoElement.addEventListener("seeked", handleVideoSkipEvent);
            // Cleanup function to remove event listeners
            return () => {
                videoElement.removeEventListener('play', handleVideoEvent);
            };
        }
    }, []);



    return (
        <div>
            <h1 className="text-2xl font-bold ml-4">Enter your User Id</h1>
            <input
                type="text"
                value={activity.userId}
                name="userId"
                onChange={(e) => setActivity({ ...activity, userId: e.target.value })}
                className="m-4 p-2 border-2 border-gray-300 rounded-md"
            />
            <video ref={videoRef} width="320" height="240" className="p-2 m-2" controls>
                <source src="/test.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    )
}