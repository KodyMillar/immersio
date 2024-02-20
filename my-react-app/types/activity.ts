type ActivityDetail = {
    timestamp: number; // Assuming Date.now() returns a timestamp in milliseconds
    activityType: 'Answer' | 'Play' | 'Pause' | 'Skip' | 'Resume' | 'Restart';
    timeSpent: number;
    activityResponse?: string; 
}

type Activity = {
    userId: string;
    activity: {
        courseId: number;
        lessonId: number;
        itemId: string;
        itemType: 'Drill' | 'Dialogue' | 'Video' | 'Vocabulary';
        details: Record<number, ActivityDetail>;
    };
}

export default Activity;