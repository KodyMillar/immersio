const express = require('express');
const { faker } = require('@faker-js/faker');
const path = require('path')
const axios = require('axios')

const app = express();
const port = 3010;

app.use(express.static('public'));

app.get('/generateData', async (req, res) => {
    const randomData = generateUserActivity();
    try {
        await axios.post('http://localhost:3001/info', randomData) //URL for post data into DB
    } catch (error) {
        console.error("ERROR!!!!", error.message)
    }
    startRandomInterval();
    res.json(randomData);
});

function generateUserActivity() {
    const itemType = faker.helpers.arrayElement(['Drill', 'Dialogue', 'Vocabulary', 'Video']);
    const activityType = (itemType === 'Video' || itemType === 'Dialogue') ? faker.helpers.arrayElement(['Play', 'Pause', 'Restart']) : faker.helpers.arrayElement(['Answer', 'Skip']);
    const activityResponse = (activityType ==='Answer') ? faker.helpers.arrayElement(['Correct','Incorrect']) : faker.helpers.arrayElement([""])
    
    const data = {
        userId: faker.string.uuid(),
        activity: {
            itemType: itemType,
            itemId: faker.string.uuid(),
            courseId: faker.number.int(100),
            lessonId: faker.number.int(100),
            details: [{
                 
                    timestamp: faker.date.past().getTime(),
                    activityType: activityType,
                    videoTime: faker.number.int(1000),
                    timeSpent: faker.number.int(1000000),
                    activityResponse: activityResponse
                    
                
            }],
        },
    };
    return data;
}

function getRandomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function startRandomInterval() {
    const randomInterval = getRandomInterval(5000, 15000);
    console.log(`Next interval will be ${randomInterval} milliseconds`);

    intervalId = setInterval(() => {
        const randomData = generateUserActivity();
        console.log(randomData);

        
        clearInterval(intervalId);
        startRandomInterval();
    }, randomInterval);
}



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
