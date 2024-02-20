"use client"
import { useState } from "react"
import activityData from "@/types/activity"
import { Button } from "./ui/button";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Question() {
  const [activity, setActivity] = useState<activityData>({
    userId: '',
    activity: {
      timestamp: "",
      itemType: "Lesson",
      itemId: "A-1",
      courseId: 4640,
      lessonId: 5,
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
          activityType: "Question",
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
      <form
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold ml-4">Enter your User ID</h1>
        <input
          className="m-4 p-2 border-2 border-gray-300 rounded-md"
          type="text"
          placeholder="12345"
          value={activity.userId}
          name="userId"
          onChange={(e) => setActivity({ ...activity, userId: e.target.value })}
        />
        <div className="m-2 ml-0">
          <Button
          className="m-2 p-4 ml-4"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault(); 
              handleResponse("Correct");
            }}
          > Correct </Button>

          <Button
          className="m-2 p-4"
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              handleResponse("Incorrect");
            }}
          > Incorrect </Button>

        </div>
        <Button className="m-2 p-4 ml-4" variant="default" type="submit">Submit</Button>
      </form>
    </div>
  )
}