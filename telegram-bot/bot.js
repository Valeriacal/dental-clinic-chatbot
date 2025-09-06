const TelegramBot = require('node-telegram-bot-api');
const responses = require('./responses');

// Load environment variables
require('dotenv').config();

// Bot token from environment variable
const token = process.env.BOT_TOKEN;

// Check if token is provided
if (!token) {
    console.error('❌ Error: BOT_TOKEN environment variable is not set!');
    console.error('Please set your Telegram bot token:');
    console.error('Windows: set BOT_TOKEN=your_bot_token_here');
    console.error('Linux/Mac: export BOT_TOKEN=your_bot_token_here');
    process.exit(1);
}

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Store user sessions
const userSessions = {};

// Initialize or get user session
function getUserSession(chatId) {
    if (!userSessions[chatId]) {
        userSessions[chatId] = {
            language: null,
            awaitingLanguage: true
        };
    }
    return userSessions[chatId];
}

// Handle /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const session = getUserSession(chatId);
    
    // Reset session
    session.language = null;
    session.awaitingLanguage = true;
    
    bot.sendMessage(chatId, 'Hallo! Deutsch oder English?', {
        reply_markup: {
            keyboard: [
                ['Deutsch', 'English']
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
});

// Handle all messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const session = getUserSession(chatId);
    
    // Skip if it's a command
    if (text && text.startsWith('/')) {
        return;
    }
    
    // Handle language selection
    if (session.awaitingLanguage) {
        if (text && (text.toLowerCase() === 'deutsch' || text.toLowerCase() === 'german')) {
            session.language = 'de';
            session.awaitingLanguage = false;
            
            const welcomeMessage = responses.getWelcomeMenu('de');
            bot.sendMessage(chatId, welcomeMessage, {
                reply_markup: {
                    keyboard: [
                        ['1️⃣ Öffnungszeiten', '2️⃣ Preise'],
                        ['3️⃣ Termin buchen', '4️⃣ Leistungen'],
                        ['5️⃣ Kontakt', '🔄 Sprache ändern']
                    ],
                    resize_keyboard: true
                }
            });
            
        } else if (text && (text.toLowerCase() === 'english' || text.toLowerCase() === 'englisch')) {
            session.language = 'en';
            session.awaitingLanguage = false;
            
            const welcomeMessage = responses.getWelcomeMenu('en');
            bot.sendMessage(chatId, welcomeMessage, {
                reply_markup: {
                    keyboard: [
                        ['1️⃣ Office hours', '2️⃣ Prices'],
                        ['3️⃣ Book appointment', '4️⃣ Services'],
                        ['5️⃣ Contact', '🔄 Change language']
                    ],
                    resize_keyboard: true
                }
            });
            
        } else {
            bot.sendMessage(chatId, 'Bitte wählen Sie: "Deutsch" oder "English"\nPlease choose: "Deutsch" or "English"');
        }
        return;
    }
    
    // If no language set, prompt for language
    if (!session.language) {
        session.awaitingLanguage = true;
        bot.sendMessage(chatId, 'Hallo! Deutsch oder English?');
        return;
    }
    
    // Process user input
    const response = generateResponse(text, session.language);
    bot.sendMessage(chatId, response, {
        parse_mode: 'HTML',
        reply_markup: getKeyboard(session.language)
    });
});

// Generate response based on user input
function generateResponse(message, language) {
    const msg = message.toLowerCase().trim();
    
    // Handle numbered options
    if (/^[1-5]$/.test(message.trim())) {
        const number = parseInt(message.trim());
        switch (number) {
            case 1:
                return responses.getOfficeHours(language);
            case 2:
                return responses.getPricing(language);
            case 3:
                return responses.getAppointmentInfo(language);
            case 4:
                return responses.getServicesInfo(language);
            case 5:
                return responses.getContactInfo(language);
        }
    }
    
    // Handle button text
    if (msg.includes('öffnungszeiten') || msg.includes('office hours') || msg.includes('1️⃣')) {
        return responses.getOfficeHours(language);
    }
    
    if (msg.includes('preise') || msg.includes('prices') || msg.includes('2️⃣')) {
        return responses.getPricing(language);
    }
    
    if (msg.includes('termin') || msg.includes('appointment') || msg.includes('3️⃣')) {
        return responses.getAppointmentInfo(language);
    }
    
    if (msg.includes('leistungen') || msg.includes('services') || msg.includes('4️⃣')) {
        return responses.getServicesInfo(language);
    }
    
    if (msg.includes('kontakt') || msg.includes('contact') || msg.includes('5️⃣')) {
        return responses.getContactInfo(language);
    }
    
    // Handle language change
    if (msg.includes('sprache ändern') || msg.includes('change language')) {
        return language === 'de' 
            ? 'Welche Sprache möchten Sie? / Which language would you like?\n\n"Deutsch" oder "English"'
            : 'Which language would you like? / Welche Sprache möchten Sie?\n\n"Deutsch" or "English"';
    }
    
    // Handle greetings
    if (msg.includes('hallo') || msg.includes('hi') || msg.includes('hello') || msg.includes('guten tag')) {
        return responses.getWelcomeMenu(language);
    }
    
    // Handle specific treatment queries
    if (msg.includes('zahnreinigung') || msg.includes('cleaning')) {
        if (language === 'de') {
            return `🦷 Professionelle Zahnreinigung bei ${responses.clinicInfo.name}:\n\n` +
                   `💰 Preis: 85€ - 150€\n` +
                   `⏱️ Dauer: 45-60 Minuten\n` +
                   `📅 Empfohlung: Alle 6 Monate\n\n` +
                   `Die professionelle Zahnreinigung entfernt Plaque, Zahnstein und Verfärbungen für gesündere Zähne und Zahnfleisch.\n\n` +
                   `📞 Termin vereinbaren: ${responses.clinicInfo.phone}`;
        } else {
            return `🦷 Professional teeth cleaning at ${responses.clinicInfo.name}:\n\n` +
                   `💰 Price: 85€ - 150€\n` +
                   `⏱️ Duration: 45-60 minutes\n` +
                   `📅 Recommended: Every 6 months\n\n` +
                   `Professional cleaning removes plaque, tartar and stains for healthier teeth and gums.\n\n` +
                   `📞 Book appointment: ${responses.clinicInfo.phone}`;
        }
    }
    
    if (msg.includes('bleaching') || msg.includes('whitening')) {
        if (language === 'de') {
            return `✨ Professionelles Bleaching bei ${responses.clinicInfo.name}:\n\n` +
                   `💰 Preis: 350€ - 550€\n` +
                   `⏱️ Dauer: 60-90 Minuten\n` +
                   `🦷 Aufhellung: Bis zu 8 Nuancen heller\n\n` +
                   `Sicheres und effektives Zahnbleaching für ein strahlendes Lächeln.\n\n` +
                   `📞 Beratungstermin: ${responses.clinicInfo.phone}`;
        } else {
            return `✨ Professional teeth whitening at ${responses.clinicInfo.name}:\n\n` +
                   `💰 Price: 350€ - 550€\n` +
                   `⏱️ Duration: 60-90 minutes\n` +
                   `🦷 Whitening: Up to 8 shades lighter\n\n` +
                   `Safe and effective teeth whitening for a brighter smile.\n\n` +
                   `📞 Consultation: ${responses.clinicInfo.phone}`;
        }
    }
    
    // Handle insurance questions
    if (msg.includes('versicherung') || msg.includes('insurance') || msg.includes('krankenkasse')) {
        if (language === 'de') {
            return `🏥 Versicherung & Zahlung bei ${responses.clinicInfo.name}:\n\n` +
                   `✅ Akzeptierte Krankenkassen:\n${responses.clinicInfo.insurance.join(', ')}\n\n` +
                   `💳 Zahlungsmöglichkeiten:\n${responses.clinicInfo.paymentOptions.join(', ')}\n\n` +
                   `📋 Bringen Sie bitte mit:\n• Versichertenkarte\n• Bonusheft\n• Überweisungsschein (falls vorhanden)`;
        } else {
            return `🏥 Insurance & Payment at ${responses.clinicInfo.name}:\n\n` +
                   `✅ Accepted insurance:\n${responses.clinicInfo.insurance.join(', ')}\n\n` +
                   `💳 Payment options:\n${responses.clinicInfo.paymentOptions.join(', ')}\n\n` +
                   `📋 Please bring:\n• Insurance card\n• Bonus booklet\n• Referral (if applicable)`;
        }
    }
    
    // Handle negative responses
    if (msg.includes('nein') || msg.includes('no') || msg === 'n') {
        return responses.getNoResponse(language);
    }
    
    // Default response
    return responses.getDefaultResponse(language);
}

// Get keyboard based on language
function getKeyboard(language) {
    if (language === 'de') {
        return {
            keyboard: [
                ['1️⃣ Öffnungszeiten', '2️⃣ Preise'],
                ['3️⃣ Termin buchen', '4️⃣ Leistungen'],
                ['5️⃣ Kontakt', '🔄 Sprache ändern']
            ],
            resize_keyboard: true
        };
    } else {
        return {
            keyboard: [
                ['1️⃣ Office hours', '2️⃣ Prices'],
                ['3️⃣ Book appointment', '4️⃣ Services'],
                ['5️⃣ Contact', '🔄 Change language']
            ],
            resize_keyboard: true
        };
    }
}

console.log('🤖 DentalBot Telegram Bot is running...');
console.log('📱 Send /start to begin conversation');
