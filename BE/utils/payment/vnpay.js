import crypto from 'crypto';
import qs from 'querystring';

export class VNPayAdapter {
    static buildPaymentUrl(params) {
        const { orderId, amount, orderInfo, returnUrl, ipAddr } = params;
        const vnpayConfig = {
            vnp_TmnCode: process.env.VNPAY_TMN_CODE,
            vnp_HashSecret: process.env.VNPAY_HASH_SECRET,
            vnp_Url: process.env.VNPAY_URL,
            vnp_ReturnUrl: process.env.VNPAY_RETURN_URL
        };
        let vnp_Params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: vnpayConfig.vnp_TmnCode,
            vnp_Locale: 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: orderId,
            vnp_OrderInfo: orderInfo,
            vnp_OrderType: 'other',
            vnp_Amount: amount * 100,
            vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: this._formatDateTime(new Date())
        };
        vnp_Params = this._sortObject(vnp_Params);
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        vnp_Params['vnp_SecureHash'] = signed;

        return vnpayConfig.vnp_Url + '?' + qs.stringify(vnp_Params, { encode: false });
    }
    static verifyCallback(vnp_Params) {
        const secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = this._sortObject(vnp_Params);
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        return secureHash === signed;
    }

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

    static getSuccessCode() {
        return '00';
    }

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