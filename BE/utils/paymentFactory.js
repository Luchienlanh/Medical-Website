import { VNPayAdapter } from './payment/vnpay.js';
import { MomoAdapter } from './payment/momo.js';
import { ZaloPayAdapter } from './payment/zalopay.js';

/**
 * Payment Gateway Factory
 * Routes requests to appropriate payment gateway adapter
 */
export class PaymentFactory {
    /**
     * Get adapter for payment method
     * @param {String} method - 'VNPAY', 'Momo', 'ZaloPay'
     * @returns {Class} - Gateway adapter class
     */
    static getAdapter(method) {
        const adapters = {
            'VNPAY': VNPayAdapter,
            'Momo': MomoAdapter,
            'ZaloPay': ZaloPayAdapter
        };
        
        const adapter = adapters[method];
        
        if (!adapter) {
            throw new Error(`Unsupported payment method: ${method}`);
        }
        
        return adapter;
    }
    
    /**
     * Check if payment method is supported
     * @param {String} method 
     * @returns {Boolean}
     */
    static isSupported(method) {
        return ['VNPAY', 'Momo', 'ZaloPay'].includes(method);
    }
    
    /**
     * Get all supported payment methods
     * @returns {Array}
     */
    static getSupportedMethods() {
        return [
            { value: 'VNPAY', label: 'VNPay' },
            { value: 'Momo', label: 'Momo E-Wallet' },
            { value: 'ZaloPay', label: 'ZaloPay' },
            { value: 'Cash', label: 'Tiền mặt' }
        ];
    }
}
