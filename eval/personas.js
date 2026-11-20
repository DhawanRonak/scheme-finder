// 18 descriptions (6 English, 6 Hinglish, 6 Hindi) with the profile a careful human would read from each.
// `gold` holds ONLY what the text states. Anything else a reader outputs counts as an invented field.
// These were written by the author as a starter set. Add real sentences from your user conversations.
module.exports = [
  { id: 1, lang: 'en', text: "I am a 34 year old farmer in Bihar. I own 2 acres of land. My family earns about 1.2 lakh a year and we don't pay income tax. I have a bank account.", gold: { age: 34, occupation: 'farmer', owns_farmland: true, annual_income: 120000, income_tax_payer: false, has_bank_account: true } },
  { id: 2, lang: 'en', text: "I'm 72, retired, living with my son in Pune.", gold: { age: 72, occupation: 'retired' } },
  { id: 3, lang: 'en', text: 'I sell vegetables from a cart in Lucknow city. I am 29 and earn around 9000 per month. No PF.', gold: { age: 29, occupation: 'street_vendor', annual_income: 108000, epfo_member: false } },
  { id: 4, lang: 'en', text: 'I am a 24 year old woman, pregnant with my first child. My husband is a daily wage labourer.', gold: { age: 24, gender: 'female', pregnant_or_new_mother: true } },
  { id: 5, lang: 'en', text: 'My daughter is 6 years old and I want to save for her education. I work as a software engineer and pay income tax.', gold: { has_girl_child_under_10: true, occupation: 'salaried', income_tax_payer: true } },
  { id: 6, lang: 'en', text: "I am a 20 year old SC student doing my BSc. My father's income is 2 lakh per year.", gold: { age: 20, category: 'sc', occupation: 'student', post_matric_student: true, annual_income: 200000 } },
  { id: 7, lang: 'hinglish', text: 'Main 45 saal ka kisan hoon, mere paas 3 bigha zameen hai. Income tax nahi bharta.', gold: { age: 45, gender: 'male', occupation: 'farmer', owns_farmland: true, income_tax_payer: false } },
  { id: 8, lang: 'hinglish', text: 'Meri umar 38 hai, main darzi ka kaam karta hoon. Bank account hai.', gold: { age: 38, gender: 'male', occupation: 'artisan', has_bank_account: true } },
  { id: 9, lang: 'hinglish', text: 'Main 26 saal ki mahila hoon, ghar mein gas connection nahi hai, chulhe par khana banati hoon. BPL card hai.', gold: { age: 26, gender: 'female', has_lpg: false, bpl: true } },
  { id: 10, lang: 'hinglish', text: 'Meri beti 4 saal ki hai. Main ghar sambhalti hoon.', gold: { has_girl_child_under_10: true, occupation: 'homemaker', gender: 'female' } },
  { id: 11, lang: 'hinglish', text: 'Main construction site par mazdoor hoon, umar 31, mahine ka 12000 kamata hoon, PF nahi katta.', gold: { age: 31, gender: 'male', occupation: 'unorganised_worker', annual_income: 144000, epfo_member: false } },
  { id: 12, lang: 'hinglish', text: 'Mere dadaji 67 saal ke hain, BPL parivar se hain.', gold: { age: 67, gender: 'male', bpl: true } },
  { id: 13, lang: 'hi', text: 'मैं 52 साल का किसान हूँ। मेरे पास 1 एकड़ खेत है। मेरा बैंक खाता है।', gold: { age: 52, gender: 'male', occupation: 'farmer', owns_farmland: true, has_bank_account: true } },
  { id: 14, lang: 'hi', text: 'मेरी उम्र 30 साल है, मैं ठेले पर चाट बेचता हूँ। महीने की कमाई 10000 रुपये है।', gold: { age: 30, gender: 'male', occupation: 'street_vendor', annual_income: 120000 } },
  { id: 15, lang: 'hi', text: 'मैं 23 साल की गर्भवती महिला हूँ। यह मेरा पहला बच्चा है।', gold: { age: 23, gender: 'female', pregnant_or_new_mother: true } },
  { id: 16, lang: 'hi', text: 'मैं बढ़ई हूँ, उम्र 41 साल। हमारा कच्चा मकान है।', gold: { age: 41, occupation: 'artisan', has_pucca_house: false } },
  { id: 17, lang: 'hi', text: 'मैं अनुसूचित जाति का छात्र हूँ, बी.ए. में पढ़ता हूँ। परिवार की सालाना आय 1.5 लाख है।', gold: { gender: 'male', category: 'sc', occupation: 'student', post_matric_student: true, annual_income: 150000 } },
  { id: 18, lang: 'hi', text: 'मेरी माँ 75 साल की हैं।', gold: { age: 75, gender: 'female' } }
];
