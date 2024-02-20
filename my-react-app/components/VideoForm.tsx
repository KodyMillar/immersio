"use client"
import { useState } from "react"
import activityData from "@/types/activity"
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function VideoForm() {
    const [activity, setActivity] = useState<activityData>({
        userId: '',
        activity: {
            timestamp: "",
            itemType: "Lesson",
            itemId: "B-2",
            courseId: 3855,
            lessonId: 4,
            activityDetails: {
                activityType: "",
                activityResponse: "",
            }
        }
    });

    function handleResponse(type: string) {
        setActivity(prev => ({
            ...prev,
            activity: {
                ...prev.activity,
                activityDetails: {
                    activityType: "Video",
                    activityResponse: type,
                }
            }
        }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const date = new Date();
        const timestamp = date.toISOString();

        const updatedActivity = {
            ...activity,
            activity: {
                ...activity.activity,
                timestamp
            }
        }

        try {
            const response = await axios.post(`${apiUrl}/info`, updatedActivity)
            if (response.status === 400) {
                console.error('Bad request:', response.data)
            }
            console.log('Submitted successfully:!')
        } catch (error) {
            console.error('Error submitting:', error)
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold ml-4">Enter your User Id</h1>
            <input
                type="text"
                value={activity.userId}
                onChange={e => setActivity(prev => ({ ...prev, userId: e.target.value }))}
                className="m-4 p-2 border-2 border-gray-300 rounded-md"
            />
            <iframe
                src="https://www.youtube.com/embed/fAQmCNWJHb8"
                allowFullScreen
                width={560}
                height={315}
                className="p-2 ml-4"
            />
        </div>
    )
}