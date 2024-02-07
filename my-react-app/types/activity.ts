type activityDetails = {
    activityType: string,
    activityResponse: string,
}

type activity = {
    timestamp: string,
    itemType: string,
    itemId: string,
    courseId: number,
    lessonId: number,
    activityDetails: activityDetails,
}

type activityData = {
    userId: string,
    activity: activity,
}

export default activityData;