const express = require('express');
const { faker } = require('@faker-js/faker');
const path = require('path')

const app = express();
const port = 3010;

app.use(express.static('public'));

app.get('/generateData', (req, res) => {
    const randomData = generateUserActivity();
    startRandomInterval();
    res.json(randomData);
});

function generateUserActivity() {
    const data = {
        userId: faker.string.uuid(),
        activity: {
            timestamp: faker.date.past(),
            itemType: faker.helpers.arrayElement(['Drill', 'Dialogue', 'Vocabulary', 'Video']),
            itemId: faker.string.uuid(),
            courseID: faker.number.int(100),
            lessonID: faker.number.int(100),
            details: {
                 
                    timestamp: faker.date.past(),
                    activityType: faker.helpers.arrayElement(['Answer', 'Play', 'Pause', 'Skip', 'Resume', 'Restart']),
                    timeSpent: faker.number.int(1000000),
                    activityResponse: faker.helpers.arrayElement(['Correct', 'Incorrect',''])
                    
                
            },
        },
    };
    return data;
}

function getRandomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function startRandomInterval() {
    const randomInterval = getRandomInterval(5000, 15000); // Adjust the range as needed
    console.log(`Next interval will be ${randomInterval} milliseconds`);

    intervalId = setInterval(() => {
        const randomData = generateUserActivity();
        console.log(randomData);

        // Clear the interval and start a new one with a random duration
        clearInterval(intervalId);
        startRandomInterval();
    }, randomInterval);
}

// Start the initial interval



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
