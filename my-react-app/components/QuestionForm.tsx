"use client"
import { useState, useRef } from "react"
import activityData from "@/types/activity"
import { Button } from "./ui/button";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Question() {
  const [activity, setActivity] = useState<activityData>({
    userId: '',
    activity: {
      courseId: 4640,
      lessonId: 5,
      itemId: "A-1",
      itemType: "Vocabulary",
      details: [{
        timestamp: Date.now(),
        activityType: 'Answer',
        timeSpent: 0,
        activityResponse: 'Correct', 
      }]
    }
  });

  const startingTime = useRef(Date.now());

  function convertToUTC(timestamp: number) {
    const date = new Date(timestamp);
    return date.toUTCString();
  }

  function updateActivityTimeSpent(detailId: number) {
    setActivity(prev => {
      const startTime = startingTime.current;
      const endTime = Date.now();
      const timeSpent = endTime - startTime;
      
      //@ts-ignore
      const updatedDetails = prev.activity.details.slice(); 
      updatedDetails[detailId] = { 
        ...updatedDetails[detailId],
        timeSpent,
        timestamp: endTime,
      };
  
      return {
        ...prev,
        activity: {
          ...prev.activity,
          details: updatedDetails
        }
      };
    });
  }
  

  function handleResponse(type: string) {
    setActivity(prev => {
      //@ts-ignore
      const updatedDetails = prev.activity.details.slice(); 
      
      // Check if there are any details to update
      if (updatedDetails.length > 0) {
        // Update the last detail's activityResponse
        const lastDetailIndex = updatedDetails.length - 1;
        updatedDetails[lastDetailIndex] = {
          ...updatedDetails[lastDetailIndex],
          activityResponse: type,
        };
      }
  
      return {
        ...prev,
        activity: {
          ...prev.activity,
          details: updatedDetails,
        },
      };
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const updatedActivity = {
      ...activity,
      activity: {
        ...activity.activity,
      }
    }

    try {
      axios.put(`${apiUrl}/info`, updatedActivity)
      startingTime.current = Date.now();
      console.log('Activity submitted:', updatedActivity)
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