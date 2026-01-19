import crypto from 'crypto';
import qs from 'querystring';

/**
 * VNPay Payment Gateway Adapter
 */
export class VNPayAdapter {
    /**
     * Build VNPay payment URL
     * @param {Object} params - Payment parameters
     * @returns {String} - Full VNPay payment URL
     */
    static buildPaymentUrl(params) {
        const {
            orderId,
            amount,
            orderInfo,
            returnUrl,
            ipAddr
        } = params;

        // VNPay config
        const vnpayConfig = {
            vnp_TmnCode: process.env.VNPAY_TMN_CODE,
            vnp_HashSecret: process.env.VNPAY_HASH_SECRET,
            vnp_Url: process.env.VNPAY_URL,
            vnp_ReturnUrl: returnUrl || process.env.VNPAY_RETURN_URL
        };

        // Build params
        let vnp_Params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: vnpayConfig.vnp_TmnCode,
            vnp_Locale: 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: orderId,
            vnp_OrderInfo: orderInfo || `Thanh toan don hang ${orderId}`,
            vnp_OrderType: 'other',
            vnp_Amount: amount * 100,  // VNPay * 100
            vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: this._formatDateTime(new Date())
        };

        // Sort & sign
        vnp_Params = this._sortObject(vnp_Params);
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        vnp_Params['vnp_SecureHash'] = signed;

        return vnpayConfig.vnp_Url + '?' + qs.stringify(vnp_Params, { encode: false });
    }

    /**
     * Verify VNPay callback hash
     * @param {Object} vnpParams - Query params từ VNPay
     * @returns {Boolean}
     */
    static verifyCallback(vnpParams) {
        const secureHash = vnpParams['vnp_SecureHash'];
        delete vnpParams['vnp_SecureHash'];
        delete vnpParams['vnp_SecureHashType'];

        vnpParams = this._sortObject(vnpParams);
        const signData = qs.stringify(vnpParams, { encode: false });
        const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        return secureHash === signed;
    }

    /**
     * Parse VNPay response to generic format
     * @param {Object} query 
     * @returns {Object}
     */
    static parseResponse(query) {
        return {
            orderId: query.vnp_TxnRef,
            amount: parseInt(query.vnp_Amount) / 100,
            responseCode: query.vnp_ResponseCode,
            transactionNo: query.vnp_TransactionNo,
            bankCode: query.vnp_BankCode,
            cardType: query.vnp_CardType,
            orderInfo: query.vnp_OrderInfo,
            payDate: query.vnp_PayDate,
            transactionStatus: query.vnp_TransactionStatus
        };
    }

    /**
     * Get success response code
     * @returns {String}
     */
    static getSuccessCode() {
        return '00';
    }

    /**
     * Get error message by response code
     * @param {String} code 
     * @returns {String}
     */
    static getErrorMessage(code) {
        const messages = {
            '00': 'Giao dịch thành công',
            '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
            '51': 'Tài khoản không đủ số dư',
            '65': 'Vượt quá hạn mức giao dịch',
            '99': 'Lỗi không xác định'
        };
        return messages[code] || 'Lỗi không xác định';
    }

    // ========== Helper Methods ==========
    
    static _sortObject(obj) {
        const sorted = {};
        Object.keys(obj).sort().forEach(key => {
            sorted[key] = obj[key];
        });
        return sorted;
   }

    static _formatDateTime(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }
}
