# DentalBot Clinic Berlin - Telegram Bot

A bilingual (German/English) Telegram bot for DentalBot Clinic Berlin with conversational language selection and numbered menu system.

## Features

- 🌐 **Bilingual Support**: German and English
- 💬 **Conversational Language Selection**: No toggle buttons, natural language choice
- 📱 **Numbered Menu System**: Easy navigation with 1-5 options
- 🦷 **Comprehensive Dental Information**: Hours, prices, services, appointments, contact
- ⌨️ **Custom Keyboard**: Quick access buttons for common queries
- 🔄 **Language Switching**: Change language anytime during conversation

## Setup

1. **Install Dependencies**:
   ```bash
   cd telegram-bot
   npm install
   ```

2. **Set Bot Token**:
   
   **Option A: Environment Variable (Recommended)**
   ```bash
   # Windows
   set BOT_TOKEN=your_telegram_bot_token_here
   
   # Linux/Mac
   export BOT_TOKEN=your_telegram_bot_token_here
   ```
   
   **Option B: .env File**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your token
   BOT_TOKEN=your_telegram_bot_token_here
   ```

3. **Start the Bot**:
   ```bash
   npm start
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

## Bot Commands

- `/start` - Begin conversation and select language

## Menu Options

### German Menu:
1. Öffnungszeiten
2. Behandlungspreise  
3. Terminvereinbarung
4. Informationen über unsere Leistungen
5. Kontaktinformationen

### English Menu:
1. Office hours
2. Treatment prices
3. Book an appointment
4. Information about our services
5. Contact information

## Usage

1. Start conversation with `/start`
2. Choose language: "Deutsch" or "English"
3. Use numbered options (1-5) or tap keyboard buttons
4. Switch languages anytime with "🔄 Sprache ändern" / "🔄 Change language"

## Clinic Information

- **Name**: DentalBot Clinic Berlin
- **Phone**: +49 30 2847 3291
- **Emergency**: +49 30 2847 3299
- **Email**: termine@dentalbot-berlin.de
- **Address**: Unter den Linden 42, 10117 Berlin, Deutschland

## File Structure

- `bot.js` - Main Telegram bot logic
- `responses.js` - Shared clinic data and response functions
- `package.json` - Dependencies and scripts
- `README.md` - This documentation

## Dependencies

- `node-telegram-bot-api` - Telegram Bot API wrapper
- `nodemon` - Development auto-restart (dev dependency)
