"use client"
import { useState, useRef, useEffect } from "react"
import activityData from "@/types/activity"
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function VideoForm() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const[startingTime, setStartingTime] = useState(Date.now());
    const[lastActivityType, setLastActivityType] = useState(null);
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
              }]
        }
    });

    const handleVideoEvent = (event: any) => {
        const videoTime = videoRef.current?.currentTime;
        let activityType = event.type.charAt(0).toUpperCase() + event.type.slice(1);
        if (lastActivityType === "Pause") {
            activityType = "Resume"
        }
        const endTime = Date.now();
        const startTime = startingTime;
        const timeSpent = endTime - startTime;
        
        // setActivity(prevActivity => {
        //     const updatedActivity = {
        //         ...prevActivity,
        //         activity: {
        //             ...prevActivity.activity,
        //             details: [
        //                 {
        //                     timestamp: endTime,
        //                     activityType: type.charAt(0).toUpperCase() + type.slice(1),
        //                     timeSpent: timeSpent
        //                 }
        //             ]
        //         }
        //     };

        const updatedActivity = {
            userId: 'Chihiro',
                activity: {
                    courseId: 3855,
                    lessonId: 2,
                    itemId: "B-2",
                    itemType: "Video",
                    details: [
                        {
                            timestamp: endTime,
                            activityType: activityType,
                            timeSpent: timeSpent,
                            // videoTime: videoTime
                        }
                    ]
                }
        }
        sendActivityUpdate(updatedActivity);
    };

    const handleVideoSkipEvent = (event: any) => {
        const type = "Skip";
        console.log(typeof(type));
        const endTime = Date.now();
        const timeSpent = endTime - startingTime;
        const videoTime = videoRef.current?.currentTime;
        const updatedActivity = {
                userId: 'Chihiro',
                activity: {
                    courseId: 3855,
                    lessonId: 2,
                    itemId: "B-2",
                    itemType: "Video",
                    details: [
                        {
                            timestamp: endTime,
                            activityType: type,
                            timeSpent: timeSpent,
                            videoTime: videoTime
                        }
                    ]
                }
            }

        // return updatedActivity
        console.log(videoTime)
        sendActivityUpdate(updatedActivity);
    }

    const handleVideoPauseEvent = (event: any) => {
        const type = "Pause";
        const endTime = Date.now();
        const timeSpent = endTime - startingTime;
        const videoTime = videoRef.current?.currentTime;
        const updatedActivity = {
            userId: 'Chihiro',
            activity: {
                courseId: 3855,
                lessonId: 2,
                itemId: "B-2",
                itemType: "Video",
                details: [
                    {
                        timestamp: endTime,
                        activityType: type,
                        timeSpent: timeSpent,
                        videoTime: videoTime
                    }
                ]
            }
        }
        sendActivityUpdate(updatedActivity);
    }

    // Function to send updated activity data to API
    const sendActivityUpdate = async (activity: any) => {
        try {
            // axios.post(`${apiUrl}/info`, acztivity);
            axios.put(`${apiUrl}info`, activity);
            setStartingTime(Date.now());
            setLastActivityType(activity.activity.details[0].activityType)
            console.log(activity);
        } catch (error) {
            console.error('Error updating activity:', error);
        }
    };

    // Reset timer and most recent activity when user enters or leaves page
    const handleLoadEvent = (event: any) => {
        setStartingTime(Date.now());
        setLastActivityType(null);
    }

    // Attach event listeners on component mount
    useEffect(() => {
        window.addEventListener('load', handleLoadEvent);
        window.addEventListener('unload', handleLoadEvent);
        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.addEventListener('play', handleVideoEvent);
            videoElement.addEventListener("seeked", handleVideoSkipEvent);
            videoElement.addEventListener('pause', handleVideoPauseEvent);
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