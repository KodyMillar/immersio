const Activity = require("../models/activity");

// Deletes all activites that have a timestamp older than 180 days
const activityController = {
	deleteOldActivities: async (req, res) => {
		const today = new Date;
		const expirationDate = today.setDate(today.getDate() - 180);
	
		const deletedActivities = await Activity.deleteMany(
			{ "activity.details": { $elemMatch: { timestamp: { $lt: expirationDate } } } }
		);
		res.write("Deleted", length(deletedActivities), "activities")
		res.end();
	}
}


module.exports = { activityController }