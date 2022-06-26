import axios from "axios";
import {Clover} from "clover-ecomm-sdk";

export class CloverAPI {

    constructor() {
        this.connector = null;
    }


    static getInstance() {
        const cloverApi = new CloverAPI();
        cloverApi.connector = new Clover(process.env.clover_ecomm_private_token, {environment: 'production'})
        return cloverApi;
    }

    async run(url, body, headers) {
        headers = {
            ...headers,
            authorization: `Bearer ${process.env.clover_api_token}`,
            mId: process.env.clover_merchant_id
        }

        if (!body || !Object.keys(body).length) {
            return await axios.get(`https://api.clover.com${url.replace('{mId}', process.env.clover_merchant_id)}`, { headers });
        } else {
            return await axios.post(`https://api.clover.com${url.replace('{mId}', process.env.clover_merchant_id)}`, body, { headers });
        }
    }

    async createCharge(source, amount, receipt_email) {
        return await this.connector.charges.create({
            source,
            amount,
            currency: 'usd',
            capture: 'true',
            ...(receipt_email && { receipt_email })
        })
    }

    async getCategories() {
        const cats = await this.run(`/v3/merchants/{mId}/categories`);
        return cats?.data?.elements || [];
    }

    async getPayments() {
        const cats = await this.run(`/v3/merchants/{mId}/payments`);
        return cats?.data?.elements || [];
    }

    //createdTime
    async getOrders() {
        const cats = await this.run(`/v3/merchants/{mId}/orders`);
        return cats?.data?.elements || [];
    }

    async getCustomer(id) {
        const cats = await this.run(`/v3/merchants/{mId}/customers/${id}?expand=emailAddresses`);
        return cats.data;
    }

    async getCustomers(ids) {
        const value = ids.map((id) => `'${id}'`);
        const cats = await this.run(`/v3/merchants/{mId}/customers?expand=emailAddresses&filter=id in (${value.join(",")})`);
        return cats?.data?.elements || [];
    }

}