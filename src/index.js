#!/usr/bin/env node

import 'dotenv/config';
import cron from 'node-cron';
import {CloverAPI} from "./CloverAPI.js";

const cloverApi = CloverAPI.getInstance();
console.log("STARTED");

// TODO: Improve by caching staff and leads if needed
const runtask = async () => {
    const res = await cloverApi.getOrders()

    const customerIds = await Promise.all(res.map(async (elem) => {
        try {
            if (elem?.customers?.elements) {
                if (elem.customers.elements.length === 1) {
                    return elem.customers.elements[0].id;
                }
            }
        } catch (error) {
            console.error(error);
        }
    }));

    let emailAddresses = [];

    try {
        const customers = await cloverApi.getCustomers(customerIds.filter((elem) => elem !== undefined));
        customers.forEach((customer) => {
            if (customer?.emailAddresses?.elements) {
                if (customer.emailAddresses.elements.length) {
                    try {
                        const customerEmail = customer.emailAddresses.elements[0].emailAddress;
                        emailAddresses.push(customerEmail);
                    } catch (error) {
                        console.error(error)
                    }

                }
            }
        })
    } catch (error) {
        console.error(error);
    }

    console.log(emailAddresses)
}


(async () => {
    await runtask()
})();


cron.schedule('*/1 * * * *', async () => {
    try {
        console.log("running...")
        await runtask();
    } catch (err) {
        console.error(err)
    }
}, {});