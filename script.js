document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const subtitle = document.getElementById('subtitle');
    const suggestionButtons = document.getElementById('suggestion-buttons');
    
    // Language state
    let currentLanguage = null; // No language selected initially
    let languageSelected = false; // Track if language has been chosen
    
    // Language translations
    const translations = {
        de: {
            subtitle: 'Ihr 24/7 Zahnarzt-Assistent',
            placeholder: 'Schreiben Sie hier Ihre Nachricht...',
            greeting: 'Hallo! Ich bin Ihr DentalBot Assistent. Wie kann ich Ihnen heute helfen? Sie können fragen nach:',
            greetingList: ['Unseren Öffnungszeiten', 'Behandlungspreisen', 'Terminvereinbarung', 'Kontaktinformationen'],
            suggestions: {
                hours: 'Öffnungszeiten',
                cleaning: 'Reinigung Preis',
                appointment: 'Termin buchen',
                whitening: 'Bleaching',
                contact: 'Kontakt Info'
            },
            questions: {
                hours: 'Was sind Ihre Öffnungszeiten?',
                cleaning: 'Wie viel kostet eine Zahnreinigung?',
                appointment: 'Ich möchte einen Termin vereinbaren',
                whitening: 'Wie viel kostet Bleaching?',
                contact: 'Wie kann ich Sie kontaktieren?'
            }
        },
        en: {
            subtitle: 'Your 24/7 Dental Assistant',
            placeholder: 'Type your message here...',
            greeting: 'Hello! I\'m your DentalBot Assistant. How can I help you today? You can ask about:',
            greetingList: ['Our office hours', 'Treatment prices', 'Book an appointment', 'Contact information'],
            suggestions: {
                hours: 'Office Hours',
                cleaning: 'Cleaning Price',
                appointment: 'Book Appointment',
                whitening: 'Whitening',
                contact: 'Contact Info'
            },
            questions: {
                hours: 'What are your office hours?',
                cleaning: 'How much does a dental cleaning cost?',
                appointment: 'I\'d like to book an appointment',
                whitening: 'How much does teeth whitening cost?',
                contact: 'What is your contact information?'
            }
        }
    };

    // Clinic information
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

    // Add a message to the chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Convert bullet points to proper HTML lists
        let formattedMessage = message;
        
        // Check if message contains bullet points, numbered lists, or HTML tags
        if (message.includes('•') || message.includes('*') || /^\d+\.\s/.test(message.split('\n').find(line => line.trim())) || message.includes('<ol>') || message.includes('<ul>')) {
            // If message already contains HTML tags, use it directly
            if (message.includes('<ol>') || message.includes('<ul>')) {
                contentDiv.innerHTML = message;
            } else {
                // Split by lines and process
                const lines = message.split('\n');
                let htmlContent = '';
                let inList = false;
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    
                    if (line.startsWith('•') || line.startsWith('*')) {
                        if (!inList) {
                            htmlContent += '<ul>';
                            inList = 'ul';
                        }
                        const listItem = line.substring(1).trim();
                        htmlContent += `<li>${listItem}</li>`;
                    } else if (/^\d+\.\s/.test(line)) {
                        if (!inList) {
                            htmlContent += '<ol>';
                            inList = 'ol';
                        }
                        const listItem = line.replace(/^\d+\.\s/, '').trim();
                        htmlContent += `<li>${listItem}</li>`;
                    } else {
                        if (inList) {
                            htmlContent += inList === 'ol' ? '</ol>' : '</ul>';
                            inList = false;
                        }
                        if (line) {
                            htmlContent += `<p>${line}</p>`;
                        } else {
                            htmlContent += '<br>';
                        }
                    }
                }
                
                if (inList) {
                    htmlContent += inList === 'ol' ? '</ol>' : '</ul>';
                }
                
                contentDiv.innerHTML = htmlContent;
            }
        } else {
            contentDiv.innerHTML = `<p>${message}</p>`;
        }
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Process user input and generate response
    function processUserInput() {
        const message = userInput.value.trim();
        if (message === '') return;

        // Add user message to chat
        addMessage(message, true);
        userInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        // Simulate bot thinking time
        setTimeout(() => {
            hideTypingIndicator();
            
            // Check if language selection is needed
            if (!languageSelected) {
                const response = handleLanguageSelection(message);
                addMessage(response);
            } else {
                const response = generateResponse(message);
                addMessage(response);
            }
        }, 1000);
    }

    // Handle language selection
    function handleLanguageSelection(message) {
        const lowerMessage = message.toLowerCase().trim();
        
        if (lowerMessage === 'deutsch' || lowerMessage === 'german') {
            currentLanguage = 'de';
            languageSelected = true;
            updateUILanguage();
            suggestionButtons.style.display = 'flex';
            return `Perfekt! Ich werde auf Deutsch antworten. Wie kann ich Ihnen heute helfen?

<ol>
<li>Öffnungszeiten</li>
<li>Behandlungspreise</li>
<li>Terminvereinbarung</li>
<li>Informationen über unsere Leistungen</li>
<li>Kontaktinformationen</li>
</ol>

Geben Sie die Nummer ein, für das was Sie benötigen (1-5), oder nutzen Sie die Buttons unten.`;
        } else if (lowerMessage === 'english' || lowerMessage === 'englisch') {
            currentLanguage = 'en';
            languageSelected = true;
            updateUILanguage();
            suggestionButtons.style.display = 'flex';
            return `Perfect! I will respond in English. How can I help you today?

<ol>
<li>Office hours</li>
<li>Treatment prices</li>
<li>Book an appointment</li>
<li>Information about our services</li>
<li>Contact information</li>
</ol>

Type the number for what you need (1-5), or use the buttons below.`;
        } else {
            return 'Please choose a language: Deutsch oder English?';
        }
    }

    // Update interface based on current language
    function updateUILanguage() {
        const t = translations[currentLanguage];
        subtitle.textContent = t.subtitle;
        userInput.placeholder = t.placeholder;
        
        // Update suggestion buttons
        const buttons = document.querySelectorAll('.suggestion-btn');
        buttons[0].textContent = t.suggestions.hours;
        buttons[0].setAttribute('data-question', t.questions.hours);
        buttons[1].textContent = t.suggestions.cleaning;
        buttons[1].setAttribute('data-question', t.questions.cleaning);
        buttons[2].textContent = t.suggestions.appointment;
        buttons[2].setAttribute('data-question', t.questions.appointment);
        buttons[3].textContent = t.suggestions.whitening;
        buttons[3].setAttribute('data-question', t.questions.whitening);
        buttons[4].textContent = t.suggestions.contact;
        buttons[4].setAttribute('data-question', t.questions.contact);
    }

    // Generate bot response based on user input
    function generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for numbered options first
        if (/^[1-5]$/.test(message.trim())) {
            const number = parseInt(message.trim());
            switch (number) {
                case 1:
                    return handleOfficeHours();
                case 2:
                    return handlePricing();
                case 3:
                    return handleAppointment();
                case 4:
                    return handleServices();
                case 5:
                    return handleContact();
            }
        }
        
        // Check for "no" responses to consultation questions
        if (/^(no|nein|nicht|nope|nah)(\s|$|!|\.)/i.test(lowerMessage)) {
            if (currentLanguage === 'de') {
                return `Vielen Dank! Falls Sie später Fragen haben, bin ich gerne da. Haben Sie einen schönen Tag! 😊`;
            } else {
                return `Thank you! If you have any questions later, I'm here to help. Have a great day! 😊`;
            }
        }
        
        // Check for specific whitening price first (before general pricing)
        if (/(whitening|bleaching|whiten|aufhellung)/i.test(lowerMessage) && /(price|cost|how much|preis|kosten|viel|kostet)/i.test(lowerMessage)) {
            if (currentLanguage === 'de') {
                return `💰 Professionelles Bleaching bei ${clinicInfo.name}:\n\n` +
                       `• Professionelles Bleaching: ${clinicInfo.services['Professionelles Bleaching']}\n\n` +
                       `Diese Behandlung umfasst:\n` +
                       `• Professionelle Zahnaufhellung\n` +
                       `• Schutz des Zahnfleisches\n` +
                       `• Nachbehandlung und Pflege-Tipps\n` +
                       `• Bis zu 8 Nuancen heller\n\n` +
                       `💳 Zahlungsmöglichkeiten: ${clinicInfo.paymentOptions.join(', ')}\n\n` +
                       `Möchten Sie einen Beratungstermin für Bleaching vereinbaren?`;
            } else {
                return `💰 Professional Teeth Whitening at ${clinicInfo.name}:\n\n` +
                       `• Professional Teeth Whitening: ${clinicInfo.services['Professionelles Bleaching']}\n\n` +
                       `This treatment includes:\n` +
                       `• Professional tooth whitening\n` +
                       `• Gum protection\n` +
                       `• Aftercare and maintenance tips\n` +
                       `• Up to 8 shades lighter\n\n` +
                       `💳 Payment Options: ${clinicInfo.paymentOptions.join(', ')}\n\n` +
                       `Would you like to schedule a whitening consultation?`;
            }
        }
        
        // Check for specific cleaning price (before general pricing)
        if (/(cleaning|zahnreinigung|reinigung)/i.test(lowerMessage) && /(price|cost|preis|kosten|viel|kostet)/i.test(lowerMessage)) {
            if (currentLanguage === 'de') {
                return `💰 Professionelle Zahnreinigung bei ${clinicInfo.name}:\n\n` +
                       `• Professionelle Zahnreinigung: ${clinicInfo.services['Professionelle Zahnreinigung']}\n\n` +
                       `Diese Behandlung umfasst:\n` +
                       `• Entfernung von Plaque und Zahnstein\n` +
                       `• Politur der Zähne\n` +
                       `• Fluoridbehandlung\n` +
                       `• Beratung zur Mundhygiene\n\n` +
                       `💳 Zahlungsmöglichkeiten: ${clinicInfo.paymentOptions.join(', ')}\n` +
                       `🏥 Wird von den meisten Krankenkassen übernommen\n\n` +
                       `Möchten Sie einen Termin für eine Zahnreinigung vereinbaren?`;
            } else {
                return `💰 Professional Teeth Cleaning at ${clinicInfo.name}:\n\n` +
                       `• Professional Teeth Cleaning: ${clinicInfo.services['Professionelle Zahnreinigung']}\n\n` +
                       `This treatment includes:\n` +
                       `• Plaque and tartar removal\n` +
                       `• Tooth polishing\n` +
                       `• Fluoride treatment\n` +
                       `• Oral hygiene consultation\n\n` +
                       `💳 Payment Options: ${clinicInfo.paymentOptions.join(', ')}\n` +
                       `🏥 Covered by most insurance plans\n\n` +
                       `Would you like to schedule a cleaning appointment?`;
            }
        }
        
        // Check for yes responses (for appointment booking)
        if (/^(yes|yeah|yep|sure|okay|ok|ja|gerne|natürlich|selbstverständlich)(\s|$|!|\.)/i.test(lowerMessage)) {
            if (currentLanguage === 'de') {
                return `📅 Perfekt! So können Sie Ihren Termin bei ${clinicInfo.name} vereinbaren:\n\n` +
                       `📞 Telefon: ${clinicInfo.phone}\n` +
                       `📧 E-Mail: ${clinicInfo.email}\n` +
                       `🌐 Online: ${clinicInfo.website}\n\n` +
                       `📍 Unsere Adresse:\n${clinicInfo.address}\n\n` +
                       `Wir freuen uns auf Ihren Besuch!`;
            } else {
                return `📅 Perfect! Here's how to book your appointment at ${clinicInfo.name}:\n\n` +
                       `📞 Phone: ${clinicInfo.phone}\n` +
                       `📧 Email: ${clinicInfo.email}\n` +
                       `🌐 Online: ${clinicInfo.website}\n\n` +
                       `📍 Our address:\n${clinicInfo.address}\n\n` +
                       `We look forward to seeing you!`;
            }
        }
        
        // Check for greeting (more specific pattern)
        if (/^(hi|hello|hey|greetings|good\s(morning|afternoon|evening)|hallo|guten)(\s|$)/i.test(lowerMessage)) {
            if (currentLanguage === 'de') {
                return `Hallo! Willkommen bei ${clinicInfo.name}. Wie kann ich Ihnen heute helfen?`;
            } else {
                return `Hello! Welcome to ${clinicInfo.name}. How can I assist you today?`;
            }
        }
        
    // Helper functions for numbered options
    function handleOfficeHours() {
        if (currentLanguage === 'de') {
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

    function handlePricing() {
        if (currentLanguage === 'de') {
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

    function handleAppointment() {
        if (currentLanguage === 'de') {
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

    function handleServices() {
        if (currentLanguage === 'de') {
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

    function handleContact() {
        if (currentLanguage === 'de') {
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

        // Check for office hours
        if (/(hour|time|open|close|schedule|when are you open|öffnungszeiten|sprechzeiten)/i.test(lowerMessage)) {
            return handleOfficeHours();
        }
        
        // Check for specific cleaning price queries first
        if (/(cleaning|zahnreinigung|prophylaxe)/i.test(lowerMessage) && /(price|cost|how much|fee|charge|preis|kosten|tarif)/i.test(lowerMessage)) {
            if (currentLanguage === 'de') {
                return `🦷 Professionelle Zahnreinigung bei ${clinicInfo.name}:\n\n` +
                       `💰 Preis: €85 - €120\n\n` +
                       `✨ Unsere Zahnreinigung umfasst:\n` +
                       `• Entfernung von Plaque und Zahnstein\n` +
                       `• Politur der Zähne\n` +
                       `• Fluoridbehandlung\n` +
                       `• Beratung zur Mundhygiene\n\n` +
                       `💳 Zahlungsmöglichkeiten: ${clinicInfo.paymentOptions.join(', ')}\n` +
                       `🏥 Akzeptierte Versicherungen: ${clinicInfo.insurance.join(', ')}\n\n` +
                       `*Preise können je nach individuellen Behandlungsbedürfnissen und Versicherungsschutz variieren.`;
            } else {
                return `🦷 Professional Teeth Cleaning at ${clinicInfo.name}:\n\n` +
                       `💰 Price: €85 - €120\n\n` +
                       `✨ Our cleaning includes:\n` +
                       `• Plaque and tartar removal\n` +
                       `• Teeth polishing\n` +
                       `• Fluoride treatment\n` +
                       `• Oral hygiene consultation\n\n` +
                       `💳 Payment Options: ${clinicInfo.paymentOptions.join(', ')}\n` +
                       `🏥 Insurance Accepted: ${clinicInfo.insurance.join(', ')}\n\n` +
                       `*Prices may vary based on individual treatment needs and insurance coverage.`;
            }
        }
        
        // Check for specific whitening/bleaching price queries
        if (/(whitening|bleaching|aufhellung)/i.test(lowerMessage) && /(price|cost|how much|fee|charge|preis|kosten|tarif)/i.test(lowerMessage)) {
            if (currentLanguage === 'de') {
                return `✨ Professionelles Bleaching bei ${clinicInfo.name}:\n\n` +
                       `💰 Preis: €350 - €600\n\n` +
                       `🌟 Unsere Bleaching-Optionen:\n` +
                       `• In-Office Bleaching (1 Sitzung): €450 - €600\n` +
                       `• Home Bleaching Kit: €350 - €450\n` +
                       `• Kombinationsbehandlung: €500 - €700\n\n` +
                       `⚡ Vorteile:\n` +
                       `• Bis zu 8 Nuancen heller\n` +
                       `• Sichere, zahnschonende Methode\n` +
                       `• Langanhaltende Ergebnisse\n\n` +
                       `💳 Zahlungsmöglichkeiten: ${clinicInfo.paymentOptions.join(', ')}\n` +
                       `*Preise können je nach gewählter Methode und individuellen Bedürfnissen variieren.`;
            } else {
                return `✨ Professional Teeth Whitening at ${clinicInfo.name}:\n\n` +
                       `💰 Price: €350 - €600\n\n` +
                       `🌟 Our whitening options:\n` +
                       `• In-Office Whitening (1 session): €450 - €600\n` +
                       `• Home Whitening Kit: €350 - €450\n` +
                       `• Combination Treatment: €500 - €700\n\n` +
                       `⚡ Benefits:\n` +
                       `• Up to 8 shades whiter\n` +
                       `• Safe, tooth-friendly method\n` +
                       `• Long-lasting results\n\n` +
                       `💳 Payment Options: ${clinicInfo.paymentOptions.join(', ')}\n` +
                       `*Prices may vary based on chosen method and individual needs.`;
            }
        }
        
        // Check for general pricing
        if (/(price|cost|how much|fee|charge|preis|kosten|tarif)/i.test(lowerMessage)) {
            return handlePricing();
        }
        
        // Check for appointment booking
        if (/(appointment|book|schedule|meet|visit|come in|termin|vereinbaren)/i.test(lowerMessage)) {
            return handleAppointment();
        }
        
        // Check for location/address
        if (/(where are you|location|address|find you|come to you|adresse|standort|wo sind sie)/i.test(lowerMessage)) {
            if (currentLanguage === 'de') {
                return `📍 ${clinicInfo.name} Standort:\n\n` +
                       `${clinicInfo.address}\n\n` +
                       `📞 Telefon: ${clinicInfo.phone}\n` +
                       `📧 E-Mail: ${clinicInfo.email}\n` +
                       `🌐 Website: ${clinicInfo.website}\n\n` +
                       `🚗 Wir befinden uns in zentraler Lage mit ausreichend Parkplätzen.\n` +
                       `🚇 Öffentliche Verkehrsmittel: U-Bahn Französische Straße (U6), S-Bahn Friedrichstraße.\n\n` +
                       `Benötigen Sie eine Wegbeschreibung oder haben Fragen zur Barrierefreiheit?`;
            } else {
                return `📍 ${clinicInfo.name} Location:\n\n` +
                       `${clinicInfo.address}\n\n` +
                       `📞 Phone: ${clinicInfo.phone}\n` +
                       `📧 Email: ${clinicInfo.email}\n` +
                       `🌐 Website: ${clinicInfo.website}\n\n` +
                       `🚗 We're conveniently located with ample parking available.\n` +
                       `🚇 Public transportation: U-Bahn Französische Straße (U6), S-Bahn Friedrichstraße.\n\n` +
                       `Need directions or have questions about accessibility?`;
            }
        }
        
        // Check for services
        if (/(service|treatment|what do you do|offer|provide|leistung|behandlung|angebot)/i.test(lowerMessage)) {
            return handleServices();
        }
        
        // Check for contact information
        if (/(contact|phone|email|reach|call|kontakt|telefon|erreichen)/i.test(lowerMessage)) {
            return handleContact();
        }
        
        // Check for insurance
        if (/(insurance|coverage|accept|plan|versicherung|krankenkasse)/i.test(lowerMessage)) {
            return `🏥 Versicherung & Zahlungsmöglichkeiten:\n\n` +
                   `Wir akzeptieren alle großen Krankenkassen:\n` +
                   `${clinicInfo.insurance.map(ins => `• ${ins}`).join('\n')}\n\n` +
                   `💳 Zahlungsmethoden:\n` +
                   `${clinicInfo.paymentOptions.map(option => `• ${option}`).join('\n')}\n\n` +
                   `💰 Wir bieten flexible Ratenzahlungen für erschwingliche Zahnpflege.\n` +
                   `📞 Rufen Sie uns unter ${clinicInfo.phone} an, um Ihre spezifischen Versicherungsleistungen zu überprüfen.\n\n` +
                   `Möchten Sie eine Beratung vereinbaren?`;
        }
        
        // Default response for unknown queries
        if (currentLanguage === 'de') {
            return `Entschuldigung, das habe ich nicht verstanden. Ich kann Ihnen helfen mit:

<ol>
<li>Öffnungszeiten</li>
<li>Behandlungspreise</li>
<li>Terminvereinbarung</li>
<li>Informationen über unsere Leistungen</li>
<li>Versicherung & Zahlungsmöglichkeiten</li>
</ol>

Geben Sie die Nummer ein, für das was Sie benötigen (1-5).`;
        } else {
            return `I'm not sure I understand. I can help you with:

<ol>
<li>Office hours</li>
<li>Service prices</li>
<li>Booking appointments</li>
<li>Information about our services</li>
<li>Insurance & payment options</li>
</ol>

Type the number for what you need (1-5).`;
        }
    }

    // Handle suggestion button clicks
    function handleSuggestionClick(question) {
        userInput.value = question;
        processUserInput();
    }
    
    // Event listeners
    sendButton.addEventListener('click', processUserInput);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            processUserInput();
        }
    });
    
    // Add event listeners for suggestion buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('suggestion-btn')) {
            const question = e.target.getAttribute('data-question');
            handleSuggestionClick(question);
        }
    });
});
