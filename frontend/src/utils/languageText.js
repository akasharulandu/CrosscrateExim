// utils/languageText.js
const languageText = {
  en: {
    welcome: "Welcome to Crosscrate International Exim",
    tagline: "Organic and High-Quality Fertilizers for Healthy Farming",
    aboutTitle: "About Us",
    aboutDescription: "We are committed to delivering sustainable and organic fertilizers...",
    missionTitle: "Mission & Vision",
    missionDescription: "Our mission is to deliver innovative sustainable solutions...",
    valuesTitle: "Our Core Values",
    contactTitle: "Contact Us",
    email: "Email",
    phone: "Phone",
    sendMessage: "Send Us a Message",
    submit: "Submit",
    navbar: {
      home: "Home",
      products: "Products",
      about: "About Us",
      mission: "Mission & Vision",
      values: "Our Values",
      contact: "Contact Us",
      login: "Login",
    }
  },
  ta: {
    welcome: "கிராஸ்கிரேட் எக்ஸிம்-க்கு வருக",
    tagline: "நலமான விவசாயத்திற்கான கரிம உரங்கள் மற்றும் உயர் தர உரங்கள்",
    aboutTitle: "எங்களை பற்றி",
    aboutDescription: "நாங்கள் நிலையான மற்றும் கரிம உரங்களை வழங்க உறுதிப்படுத்துகிறோம்...",
    missionTitle: "பணி மற்றும் காட்சி",
    missionDescription: "நாம் உலகளாவிய நிலையான விவசாய தீர்வுகளை வழங்கும் நோக்கத்துடன்...",
    valuesTitle: "எங்கள் முக்கிய மதிப்புகள்",
    contactTitle: "எங்களை தொடர்பு கொள்ள",
    email: "மின்னஞ்சல்",
    phone: "தொலைபேசி",
    sendMessage: "எங்களுக்கு ஒரு செய்தியை அனுப்பவும்",
    submit: "சமர்ப்பிக்கவும்",
    navbar: {
      home: "முகப்பு",
      products: "தயாரிப்புகள்",
      about: "எங்களை பற்றி",
      mission: "பணி மற்றும் காட்சி",
      values: "எங்கள் மதிப்புகள்",
      contact: "தொடர்பு கொள்ள",
      login: "உள்நுழைய",
    }
  },
  hi: {
    welcome: "क्रॉसक्रेट एक्सिम में आपका स्वागत है",
    tagline: "स्वस्थ कृषि के लिए जैविक और उच्च गुणवत्ता वाले उर्वरक",
    aboutTitle: "हमारे बारे में",
    aboutDescription: "हम टिकाऊ और जैविक उर्वरक प्रदान करने के लिए प्रतिबद्ध हैं...",
    missionTitle: "मिशन और दृष्टि",
    missionDescription: "हम अभिनव और टिकाऊ कृषि समाधान प्रदान करने के लिए प्रतिबद्ध हैं...",
    valuesTitle: "हमारे मुख्य मूल्य",
    contactTitle: "संपर्क करें",
    email: "ईमेल",
    phone: "फ़ोन",
    sendMessage: "हमें एक संदेश भेजें",
    submit: "जमा करें",
    navbar: {
      home: "मुखपृष्ठ",
      products: "उत्पाद",
      about: "हमारे बारे में",
      mission: "मिशन और दृष्टि",
      values: "हमारे मूल्य",
      contact: "संपर्क करें",
      login: "लॉगिन",
    }
  }
};

// Function to get the translation for a specific language and key
const getLanguageText = (lang, key) => {
  return languageText[lang] && languageText[lang][key] ? languageText[lang][key] : key;
};

export default getLanguageText;
