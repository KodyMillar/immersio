"use client"
import { useState, useRef, useEffect } from "react"
import activityData from "@/types/activity"
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function VideoForm() {
    const videoRef = useRef<HTMLVideoElement>(null);
    // const [startingTime, setStartingTime] = useState(Date.now());
    const startingTime = useRef(Date.now());
    const playType = useRef("Play");
    const videoTimeRef = useRef([[0, 0]]);
    let videoTimeInterval: any;
    let currentVideoTimeIndex = 0;
    const activityRef = useRef<activityData>({
            userId: '',
            activity: {
                courseId: 3855,
                lessonId: 2,
                itemId: "B-2",
                itemType: "Video",
                details: [{
                    timestamp: Date.now(),
                    activityType: 'Play',
                    timeSpent: 0,
                    videoTime: 0
              }]
        }
    })
    // const [activity, setActivity] = useState<activityData>({
    //     userId: 'Woody',
    //     activity: {
    //         courseId: 3855,
    //         lessonId: 2,
    //         itemId: "B-2",
    //         itemType: "Video",
    //         details: [{
    //             timestamp: Date.now(),
    //             activityType: 'Answer',
    //             timeSpent: 0,
    //           }]
    //     }
    // });

    const handleVideoEvent = (event: any) => {
        if (!videoTimeInterval) {
            setCurrentVideoTimeIndex();
            videoTimeInterval = setInterval(trackWatched);
        }
 
        let activityType = playType.current;
        const endTime = Date.now();
        const startTime = startingTime.current;
        const timeSpent = endTime - startTime;
        const videoTime = videoRef.current?.currentTime;
        
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

        activityRef.current.activity.details = [
            {
                timestamp: endTime,
                activityType: activityType,
                timeSpent: timeSpent,
                videoTime: videoTime
            }
        ]

        if (playType.current === "Play") {
            playType.current = "Resume";
        }
        
        sendActivityUpdate();
    };

    const handleVideoSkipEvent = (event: any) => {
        const type = "Skip";
        const endTime = Date.now();
        const timeSpent = endTime - startingTime.current;
        const videoTime = videoRef.current?.currentTime;
        activityRef.current.activity.details = [
            {
                timestamp: endTime,
                activityType: type,
                timeSpent: timeSpent,
                videoTime: videoTime
            }
        ]

        sendActivityUpdate();
    }

    const handleVideoPauseEvent = (event: any) => {
        if (videoTimeInterval) {
            clearInterval(videoTimeInterval);
            videoTimeInterval = null;
        }

        const type = "Pause";
        const endTime = Date.now();
        const timeSpent = endTime - startingTime.current;
        const videoTime = videoRef.current?.currentTime;
    
        activityRef.current.activity.details = [
            {
                timestamp: endTime,
                activityType: type,
                timeSpent: timeSpent,
                videoTime: videoTime
            }
        ]
        sendActivityUpdate();
    }

    // Function to send updated activity data to API
    const sendActivityUpdate = async () => {
        try {
            // axios.post(`${apiUrl}/info`, acztivity);
            axios.put(`${apiUrl}/info`, activityRef.current);
            startingTime.current = Date.now();
            console.log(activityRef.current);
        } catch (error) {
            console.error('Error updating activity:', error);
        }
    };

    // Reset timer and most recent activity when user enters or leaves page
    const handleLoadEvent = (event: any) => {
        startingTime.current = Date.now();
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


    // Keep track of parts of the video the user has watched
    const trackWatched = () => {

        // Increase range only when current video time is larger than the range
        if (videoRef.current.currentTime > videoTimeRef.current[currentVideoTimeIndex][1]) {
            videoTimeRef.current[currentVideoTimeIndex][1] = videoRef.current.currentTime;
        }
        
        // Merge watched ranges if they overlap
        if (currentVideoTimeIndex !== videoTimeRef.current.length - 1) {
            if (videoTimeRef.current[currentVideoTimeIndex][1] >= videoTimeRef.current[currentVideoTimeIndex + 1][0]) {
                videoTimeRef.current[currentVideoTimeIndex] = [videoTimeRef.current[currentVideoTimeIndex][0], videoTimeRef.current[currentVideoTimeIndex + 1][1]];
                videoTimeRef.current.splice(currentVideoTimeIndex + 1, 1);
            }
        }

    }

    const setCurrentVideoTimeIndex = () => {
        for (let i=0; i < videoTimeRef.current.length; i++) {
            if (videoRef.current.currentTime > videoTimeRef.current[i][1]) {
                if (videoTimeRef.current.length === i + 1) {
                    currentVideoTimeIndex = i + 1;
                    videoTimeRef.current.push([videoRef.current.currentTime, videoRef.current.currentTime])
                    playType.current = playType.current !== "Play" ? "Resume" : "Play";
                    break;
                }
                else if (videoRef.current.currentTime < videoTimeRef.current[i+1][0]) {
                    currentVideoTimeIndex = i + 1;
                    videoTimeRef.current.splice(currentVideoTimeIndex, 0, [videoRef.current?.currentTime, videoRef.current.currentTime])
                    playType.current = playType.current !== "Play" ? "Resume" : "Play";
                    break;
                }
            }

            else if (videoRef.current.currentTime < videoTimeRef.current[i][0]) {
                if (i === 0) {
                    currentVideoTimeIndex = 0;
                    videoTimeRef.current.unshift([videoTimeRef.current, videoTimeRef.current]);
                    break;
                }
            }

            else {
                currentVideoTimeIndex = i;
                if (playType.current !== "Play" && videoRef.current.currentTime != videoTimeRef.current[currentVideoTimeIndex][1]) {
                    playType.current = "Replay";
                }
                else if (playType.current !== "Play") {
                    playType.current = "Resume"
                }
                break;
            }
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold ml-4">Enter your User Id</h1>
            <input
                type="text"
                placeholder="A username or number"
                name="userId"
                // onChange={(e) => setActivity({ ...activity, userId: e.target.value })}
                onChange={(e) => activityRef.current.userId = e.target.value}
                className="m-4 p-2 border-2 border-gray-300 rounded-md"
            />
            <video ref={videoRef} width="320" height="240" className="p-2 m-2" controls>
                <source src="/test.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    )
}