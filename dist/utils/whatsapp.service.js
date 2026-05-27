"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhatsAppTemplate = exports.sendWhatsAppMessage = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ACCESS_TOKEN = process.env.WHATSAPP_CLOUD_API_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_CLOUD_API_PHONE_NUMBER_ID;
/**
 * Sends a text message using Meta's WhatsApp Cloud API
 * @param to Phone number with country code (e.g., "919876543210")
 * @param message The text message to send
 */
const sendWhatsAppMessage = async (to, message) => {
    if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
        console.warn('WhatsApp API credentials are not configured in .env. Message not sent.');
        return null;
    }
    // Ensure the phone number only contains digits
    const cleanTo = to.replace(/\D/g, '');
    try {
        const response = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: cleanTo,
                type: 'text',
                text: {
                    preview_url: false,
                    body: message,
                },
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            console.error('Error sending WhatsApp message via Meta API:', data);
        }
        else {
            console.log('WhatsApp message sent successfully:', data);
        }
        return data;
    }
    catch (error) {
        console.error('Failed to send WhatsApp message:', error);
        return null;
    }
};
exports.sendWhatsAppMessage = sendWhatsAppMessage;
/**
 * Sends a template message using Meta's WhatsApp Cloud API
 * @param to Phone number with country code
 * @param templateName Name of the template (e.g., 'gate_pass_updated')
 * @param components Array of template components (Header, Body, etc.)
 */
const sendWhatsAppTemplate = async (to, templateName, components) => {
    if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
        console.warn('WhatsApp API credentials are not configured in .env. Message not sent.');
        return null;
    }
    const cleanTo = to.replace(/\D/g, '');
    try {
        const response = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: cleanTo,
                type: 'template',
                template: {
                    name: templateName,
                    language: { code: 'en' },
                    components: components,
                },
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            console.error(`Error sending WhatsApp template (${templateName}):`, JSON.stringify(data, null, 2));
        }
        else {
            console.log(`WhatsApp template (${templateName}) sent successfully.`);
        }
        return data;
    }
    catch (error) {
        console.error(`Failed to send WhatsApp template (${templateName}):`, error);
        return null;
    }
};
exports.sendWhatsAppTemplate = sendWhatsAppTemplate;
