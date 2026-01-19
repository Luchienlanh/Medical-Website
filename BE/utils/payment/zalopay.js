import crypto from 'crypto';
import axios from 'axios';

/**
 * ZaloPay Payment Gateway Adapter
 */
export class ZaloPayAdapter {
    /**
     * Build ZaloPay payment URL
     * @param {Object} params 
     * @returns {Promise<String>}
     */
    static async buildPaymentUrl(params) {
        const {
            orderId,
            amount,
            orderInfo,
            returnUrl
        } = params;

        // ZaloPay config
        const config = {
            app_id: process.env.ZALOPAY_APP_ID,
            key1: process.env.ZALOPAY_KEY1,
            key2: process.env.ZALOPAY_KEY2,
            endpoint: process.env.ZALOPAY_ENDPOINT,
            callbackUrl: process.env.ZALOPAY_CALLBACK_URL
        };

        // Build order data
        const embed_data = {
            redirecturl: returnUrl || process.env.ZALOPAY_RETURN_URL
        };

        const items = [];
        const transID = `${Date.now()}`;  // ZaloPay transaction ID
        const app_trans_id = `${new Date().format('yyMMdd')}_${orderId}`;  // Format: yyMMdd_xxxxx

        const order = {
            app_id: config.app_id,
            app_trans_id,
            app_user: 'user123',  // Có thể customize
            app_time: Date.now(),
            amount,
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            description: orderInfo || `Thanh toan don hang ${orderId}`,
            bank_code: '',  // Empty = ZaloPay wallet
            callback_url: config.callbackUrl
        };

        // Create MAC signature
        const data = `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
        order.mac = crypto
            .createHmac('sha256', config.key1)
            .update(data)
            .digest('hex');

        // Call ZaloPay API
        try {
            const response = await axios.post(config.endpoint, null, { params: order });
            
            if (response.data.return_code === 1) {
                return response.data.order_url;  // ZaloPay payment URL
            } else {
                throw new Error(`ZaloPay error: ${response.data.return_message}`);
            }
        } catch (error) {
            throw new Error(`ZaloPay API error: ${error.message}`);
        }
    }

    /**
     * Verify ZaloPay callback
     * @param {Object} body 
     * @returns {Boolean}
     */
    static verifyCallback(body) {
        const { data: dataStr, mac } = body;
        
        const calculatedMac = crypto
            .createHmac('sha256', process.env.ZALOPAY_KEY2)
            .update(dataStr)
            .digest('hex');

        return mac === calculatedMac;
    }

    /**
     * Parse ZaloPay response
     * @param {Object} body 
     * @returns {Object}
     */
    static parseResponse(body) {
        const data = JSON.parse(body.data);
        
        return {
            orderId: data.app_trans_id.split('_')[1],  // Extract orderId from app_trans_id
            amount: data.amount,
            responseCode: data.status === 1 ? '1' : '0',  // 1 = success
            transactionNo: data.zp_trans_id,
            bankCode: data.bank_code || 'ZaloPay',
            cardType: 'ZaloPay Wallet',
            orderInfo: data.description,
            payDate: data.server_time,
            transactionStatus: data.status === 1 ? 'Success' : 'Failed'
        };
    }

    /**
     * Get success response code
     * @returns {String}
     */
    static getSuccessCode() {
        return '1';  // ZaloPay success = 1
    }

    /**
     * Get error message
     * @param {String} code 
     * @returns {String}
     */
    static getErrorMessage(code) {
        const messages = {
            '1': 'Giao dịch thành công',
            '2': 'Giao dịch thất bại',
            '3': 'Giao dịch đang chờ xử lý'
        };
        return messages[code] || 'Lỗi không xác định';
    }
}

// Helper: Format date for ZaloPay
Date.prototype.format = function(fmt) {
    const o = {
        'y+': this.getFullYear(),
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'H+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds()
    };
    
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, String(o[k]).padStart(2, '0'));
        }
    }
    return fmt;
};
