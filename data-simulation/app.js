const express = require('express');
const { faker } = require('@faker-js/faker');

const app = express();
const port = 3010;

app.use(express.static('public'));

app.get('/generateData', (req, res) => {
    const randomData = generateUserActivity();
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

setInterval(() => {
    const randomData = generateUserActivity();
    console.log('Generated data:', randomData);
}, 10000);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
