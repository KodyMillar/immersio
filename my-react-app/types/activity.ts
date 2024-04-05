type ActivityDetail = {
    timestamp: number;
    activityType: 'Answer' | 'Play' | 'Pause' | 'Skip' | 'Resume' | 'Replay';
    timeSpent: number;
    videoTime?: number,
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