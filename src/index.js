#!/usr/bin/env node

import cron from 'node-cron';

console.log("STARTED");

// TODO: Improve by caching staff and leads if needed
const runtask = async () => {
    
}

cron.schedule('*/30 * * * *', async () => {
    try {
        console.log("running...")
        await runtask();
    } catch (err) {
        console.error(err)
    }
}, {});