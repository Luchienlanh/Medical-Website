import crypto from 'crypto';

/**
 * Momo Payment Gateway Adapter
 */
export class MomoAdapter {
    /**
     * Build Momo payment URL
     * @param {Object} params 
     * @returns {Promise<String>} - Momo payment URL
     */
    static async buildPaymentUrl(params) {
        const {
            orderId,
            amount,
            orderInfo,
            returnUrl,
            ipAddr
        } = params;

        // Momo config
        const momoConfig = {
            partnerCode: process.env.MOMO_PARTNER_CODE,
            accessKey: process.env.MOMO_ACCESS_KEY,
            secretKey: process.env.MOMO_SECRET_KEY,
            endpoint: process.env.MOMO_ENDPOINT,
            returnUrl: returnUrl || process.env.MOMO_RETURN_URL,
            notifyUrl: process.env.MOMO_IPN_URL
        };

        // Build request
        const requestId = orderId + '-' + Date.now();
        const requestType = 'captureWallet';
        const extraData = '';  // Optional

        const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${momoConfig.notifyUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.returnUrl}&requestId=${requestId}&requestType=${requestType}`;
        
        const signature = crypto
            .createHmac('sha256', momoConfig.secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = {
            partnerCode: momoConfig.partnerCode,
            accessKey: momoConfig.accessKey,
            requestId,
            amount: amount.toString(),
            orderId,
            orderInfo,
            redirectUrl: momoConfig.returnUrl,
            ipnUrl: momoConfig.notifyUrl,
            requestType,
            extraData,
            lang: 'vi',
            signature
        };

        // Call Momo API to get payment URL
        const response = await fetch(momoConfig.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (data.resultCode === 0) {
            return data.payUrl;  // Momo trả về payUrl
        } else {
            throw new Error(`Momo error: ${data.message}`);
        }
    }

    /**
     * Verify Momo callback
     * @param {Object} body - POST body từ Momo
     * @returns {Boolean}
     */
    static verifyCallback(body) {
        const {
            partnerCode,
            orderId,
            requestId,
            amount,
            orderInfo,
            orderType,
            transId,
            resultCode,
            message,
            payType,
            responseTime,
            extraData,
            signature
        } = body;

        const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

        const calculatedSignature = crypto
            .createHmac('sha256', process.env.MOMO_SECRET_KEY)
            .update(rawSignature)
            .digest('hex');

        return signature === calculatedSignature;
    }

    /**
     * Parse Momo response to generic format
     * @param {Object} body 
     * @returns {Object}
     */
    static parseResponse(body) {
        return {
            orderId: body.orderId,
            amount: parseInt(body.amount),
            responseCode: body.resultCode.toString(),  // Convert to string
            transactionNo: body.transId,
            bankCode: body.payType,  // Momo không có bank code, dùng payType
            cardType: body.payType,  // momo, napas, credit
            orderInfo: body.orderInfo,
            payDate: body.responseTime,
            transactionStatus: body.resultCode === 0 ? 'Success' : 'Failed'
        };
    }

    /**
     * Get success response code
     * @returns {String}
     */
    static getSuccessCode() {
        return '0';  // Momo success code = '0'
    }

    /**
     * Get error message
     * @param {String} code 
     * @returns {String}
     */
    static getErrorMessage(code) {
        const messages = {
            '0': 'Giao dịch thành công',
            '9000': 'Giao dịch đã được xác nhận thành công',
            '1001': 'Giao dịch thanh toán thất bại do tài khoản người dùng không đủ tiền',
            '1002': 'Giao dịch bị từ chối do nhà phát hành tài khoản thanh toán',
            '1003': 'Đã có lỗi xảy ra trong quá trình xử lý giao dịch',
            '1004': 'Giao dịch bị hủy',
            '1005': 'Địa chỉ URL trả về không hợp lệ',
            '1006': 'Giao dịch đã bị từ chối do người dùng nhập sai thông tin thanh toán'
        };
        return messages[code] || 'Lỗi không xác định';
    }
}
