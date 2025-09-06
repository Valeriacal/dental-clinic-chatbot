// Shared clinic data and response logic for both web and Telegram bot
const clinicInfo = {
    name: 'DentalBot Clinic Berlin',
    hours: {
        monday: '08:00 - 18:00',
        tuesday: '08:00 - 18:00',
        wednesday: '08:00 - 20:00',
        thursday: '08:00 - 18:00',
        friday: '08:00 - 16:00',
        saturday: '09:00 - 14:00',
        sunday: 'Geschlossen (Nur Notfälle)'
    },
    address: 'Unter den Linden 42\n10117 Berlin\nDeutschland',
    phone: '+49 30 2847 3291',
    emergencyPhone: '+49 30 2847 3299',
    email: 'termine@dentalbot-berlin.de',
    website: 'www.dentalbot-berlin.de',
    insurance: ['AOK', 'Barmer', 'TK (Techniker Krankenkasse)', 'DAK-Gesundheit', 'IKK Classic', 'Ergo Direkt', 'DKV', 'Allianz'],
    services: {
        'Routineuntersuchung': '75€ - 120€',
        'Professionelle Zahnreinigung': '85€ - 150€',
        'Röntgenaufnahmen (Komplett)': '95€ - 180€',
        'Kompositfüllung (1 Fläche)': '120€ - 200€',
        'Kompositfüllung (2-3 Flächen)': '180€ - 280€',
        'Porzellankrone': '800€ - 1.400€',
        'Professionelles Bleaching': '350€ - 550€',
        'Zahnimplantat (komplett)': '2.500€ - 4.000€',
        'Metallbrackets': '3.500€ - 5.500€',
        'Invisalign Aligner': '3.200€ - 6.500€',
        'Wurzelkanalbehandlung': '650€ - 1.200€',
        'Zahnextraktion (einfach)': '80€ - 200€',
        'Zahnextraktion (chirurgisch)': '200€ - 450€',
        'Zahnbrücke (3-gliedrig)': '1.800€ - 2.800€',
        'Vollprothese': '1.200€ - 2.500€',
        'Parodontitisbehandlung': '150€ - 600€',
        'Notfallbehandlung': '100€ - 300€'
    },
    paymentOptions: ['Bargeld', 'EC-Karte', 'Kreditkarte', 'Ratenzahlung möglich', 'Überweisung'],
    specialties: ['Allgemeine Zahnheilkunde', 'Ästhetische Zahnheilkunde', 'Kieferorthopädie', 'Oralchirurgie', 'Parodontologie']
};

// Response functions
function getOfficeHours(language) {
    if (language === 'de') {
        return `📅 Unsere Öffnungszeiten bei ${clinicInfo.name}:\n\n` +
               `Montag: ${clinicInfo.hours.monday}\n` +
               `Dienstag: ${clinicInfo.hours.tuesday}\n` +
               `Mittwoch: ${clinicInfo.hours.wednesday}\n` +
               `Donnerstag: ${clinicInfo.hours.thursday}\n` +
               `Freitag: ${clinicInfo.hours.friday}\n` +
               `Samstag: ${clinicInfo.hours.saturday}\n` +
               `Sonntag: ${clinicInfo.hours.sunday}\n\n` +
               `📞 Für Termine: ${clinicInfo.phone}\n` +
               `🚨 Notfall-Hotline: ${clinicInfo.emergencyPhone}`;
    } else {
        return `📅 Our office hours at ${clinicInfo.name}:\n\n` +
               `Monday: ${clinicInfo.hours.monday}\n` +
               `Tuesday: ${clinicInfo.hours.tuesday}\n` +
               `Wednesday: ${clinicInfo.hours.wednesday}\n` +
               `Thursday: ${clinicInfo.hours.thursday}\n` +
               `Friday: ${clinicInfo.hours.friday}\n` +
               `Saturday: ${clinicInfo.hours.saturday}\n` +
               `Sunday: ${clinicInfo.hours.sunday}\n\n` +
               `📞 For appointments: ${clinicInfo.phone}\n` +
               `🚨 Emergency line: ${clinicInfo.emergencyPhone}`;
    }
}

function getPricing(language) {
    if (language === 'de') {
        let response = `💰 Unsere aktuellen Behandlungspreise bei ${clinicInfo.name}:\n\n`;
        for (const [service, price] of Object.entries(clinicInfo.services)) {
            response += `• ${service}: ${price}\n`;
        }
        response += `\n💳 Zahlungsmöglichkeiten: ${clinicInfo.paymentOptions.join(', ')}\n`;
        response += `🏥 Akzeptierte Versicherungen: ${clinicInfo.insurance.join(', ')}\n\n`;
        response += '*Preise können je nach individuellen Behandlungsbedürfnissen und Versicherungsschutz variieren.';
        return response;
    } else {
        let response = `💰 Our current service prices at ${clinicInfo.name}:\n\n`;
        for (const [service, price] of Object.entries(clinicInfo.services)) {
            response += `• ${service}: ${price}\n`;
        }
        response += `\n💳 Payment Options: ${clinicInfo.paymentOptions.join(', ')}\n`;
        response += `🏥 Insurance Accepted: ${clinicInfo.insurance.join(', ')}\n\n`;
        response += '*Prices may vary based on individual treatment needs and insurance coverage.';
        return response;
    }
}

function getAppointmentInfo(language) {
    if (language === 'de') {
        return `📅 Terminvereinbarung bei ${clinicInfo.name}:\n\n` +
               `📞 Rufen Sie uns an: ${clinicInfo.phone}\n` +
               `📧 E-Mail: ${clinicInfo.email}\n` +
               `🌐 Online: ${clinicInfo.website}\n` +
               `📍 Besuchen Sie uns: ${clinicInfo.address}\n\n` +
               `⏰ Verfügbare Terminzeiten:\n` +
               `• Termine am selben Tag oft verfügbar\n` +
               `• Abendtermine bis 20:00 Uhr mittwochs\n` +
               `• Samstagvormittag-Termine verfügbar`;
    } else {
        return `📅 Schedule your appointment at ${clinicInfo.name}:\n\n` +
               `📞 Call us: ${clinicInfo.phone}\n` +
               `📧 Email: ${clinicInfo.email}\n` +
               `🌐 Online: ${clinicInfo.website}\n` +
               `📍 Visit us: ${clinicInfo.address}\n\n` +
               `⏰ Available appointment times:\n` +
               `• Same-day appointments often available\n` +
               `• Evening appointments until 8 PM on Wednesdays\n` +
               `• Saturday morning slots available`;
    }
}

function getServicesInfo(language) {
    if (language === 'de') {
        return `🦷 Unsere umfassenden Zahnbehandlungen bei ${clinicInfo.name}:\n\n` +
               `📋 Vorsorge:\n` +
               `• Routineuntersuchungen\n` +
               `• Professionelle Zahnreinigung\n` +
               `• Röntgenaufnahmen\n\n` +
               `🔧 Zahnerhaltung:\n` +
               `• Kompositfüllungen\n` +
               `• Porzellankronen\n` +
               `• Zahnbrücken\n` +
               `• Wurzelkanalbehandlung\n\n` +
               `✨ Ästhetische Zahnheilkunde:\n` +
               `• Professionelles Bleaching\n` +
               `• Porzellanlaminat-Veneers\n\n` +
               `🦷 Spezialisierte Leistungen:\n` +
               `• Zahnimplantate\n` +
               `• Kieferorthopädie (Brackets & Invisalign)\n` +
               `• Oralchirurgie\n` +
               `• Parodontitisbehandlung\n\n` +
               `Unsere Fachbereiche: ${clinicInfo.specialties.join(', ')}`;
    } else {
        return `🦷 Our comprehensive dental treatments at ${clinicInfo.name}:\n\n` +
               `📋 Preventive Care:\n` +
               `• Routine examinations\n` +
               `• Professional teeth cleaning\n` +
               `• X-rays\n\n` +
               `🔧 Restorative Dentistry:\n` +
               `• Composite fillings\n` +
               `• Porcelain crowns\n` +
               `• Dental bridges\n` +
               `• Root canal treatment\n\n` +
               `✨ Cosmetic Dentistry:\n` +
               `• Professional teeth whitening\n` +
               `• Porcelain veneers\n\n` +
               `🦷 Specialized Services:\n` +
               `• Dental implants\n` +
               `• Orthodontics (Braces & Invisalign)\n` +
               `• Oral surgery\n` +
               `• Periodontal treatment\n\n` +
               `Our specialties: ${clinicInfo.specialties.join(', ')}`;
    }
}

function getContactInfo(language) {
    if (language === 'de') {
        return `📞 Kontakt ${clinicInfo.name}:\n\n` +
               `Hauptnummer: ${clinicInfo.phone}\n` +
               `Notfall-Hotline: ${clinicInfo.emergencyPhone}\n` +
               `E-Mail: ${clinicInfo.email}\n` +
               `Website: ${clinicInfo.website}\n\n` +
               `📍 Adresse:\n${clinicInfo.address}\n\n` +
               `📅 Öffnungszeiten:\n` +
               `Mo-Do: 08:00 - 18:00\n` +
               `Mi: 08:00 - 20:00\n` +
               `Fr: 08:00 - 16:00\n` +
               `Sa: 09:00 - 14:00`;
    } else {
        return `📞 Contact ${clinicInfo.name}:\n\n` +
               `Main number: ${clinicInfo.phone}\n` +
               `Emergency hotline: ${clinicInfo.emergencyPhone}\n` +
               `Email: ${clinicInfo.email}\n` +
               `Website: ${clinicInfo.website}\n\n` +
               `📍 Address:\n${clinicInfo.address}\n\n` +
               `📅 Office hours:\n` +
               `Mon-Thu: 08:00 - 18:00\n` +
               `Wed: 08:00 - 20:00\n` +
               `Fri: 08:00 - 16:00\n` +
               `Sat: 09:00 - 14:00`;
    }
}

function getWelcomeMenu(language) {
    if (language === 'de') {
        return `Perfekt! Ich werde auf Deutsch antworten. Wie kann ich Ihnen heute helfen?\n\n` +
               `1. Öffnungszeiten\n` +
               `2. Behandlungspreise\n` +
               `3. Terminvereinbarung\n` +
               `4. Informationen über unsere Leistungen\n` +
               `5. Kontaktinformationen\n\n` +
               `Geben Sie die Nummer ein, für das was Sie benötigen (1-5).`;
    } else {
        return `Perfect! I will respond in English. How can I help you today?\n\n` +
               `1. Office hours\n` +
               `2. Treatment prices\n` +
               `3. Book an appointment\n` +
               `4. Information about our services\n` +
               `5. Contact information\n\n` +
               `Type the number for what you need (1-5).`;
    }
}

function getDefaultResponse(language) {
    if (language === 'de') {
        return `Entschuldigung, das habe ich nicht verstanden. Ich kann Ihnen helfen mit:\n\n` +
               `1. Öffnungszeiten\n` +
               `2. Behandlungspreise\n` +
               `3. Terminvereinbarung\n` +
               `4. Informationen über unsere Leistungen\n` +
               `5. Versicherung & Zahlungsmöglichkeiten\n\n` +
               `Geben Sie die Nummer ein, für das was Sie benötigen (1-5).`;
    } else {
        return `I'm not sure I understand. I can help you with:\n\n` +
               `1. Office hours\n` +
               `2. Service prices\n` +
               `3. Booking appointments\n` +
               `4. Information about our services\n` +
               `5. Insurance & payment options\n\n` +
               `Type the number for what you need (1-5).`;
    }
}

function getNoResponse(language) {
    if (language === 'de') {
        return `Vielen Dank! Falls Sie später Fragen haben, bin ich gerne da. Haben Sie einen schönen Tag! 😊`;
    } else {
        return `Thank you! If you have any questions later, I'm here to help. Have a great day! 😊`;
    }
}

module.exports = {
    clinicInfo,
    getOfficeHours,
    getPricing,
    getAppointmentInfo,
    getServicesInfo,
    getContactInfo,
    getWelcomeMenu,
    getDefaultResponse,
    getNoResponse
};
