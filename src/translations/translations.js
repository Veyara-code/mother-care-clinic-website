// Central translation dictionary. Every visible string on the site has an
// entry here with both `en` and `ur` values. Urdu is written in formal script
// appropriate for a medical / clinic context.
// Lookup is flat-key based: t("nav.home") -> translations["nav.home"][lang].

const translations = {
  /* ---------- NAVBAR ---------- */
  "nav.home": { en: "Home", ur: "ہوم" },
  "nav.about": { en: "About", ur: "ہمارے بارے میں" },
  "nav.services": { en: "Services", ur: "خدمات" },
  "nav.doctors": { en: "Doctors", ur: "ڈاکٹرز" },
  "nav.appointment": { en: "Appointment", ur: "اپائنٹمنٹ" },
  "nav.testimonials": { en: "Testimonials", ur: "تاثرات" },
  "nav.contact": { en: "Contact", ur: "رابطہ" },
  "nav.bookAppointment": { en: "Book Appointment", ur: "اپائنٹمنٹ بک کریں" },

  /* ---------- HERO ---------- */
  "hero.badge": { en: "Trusted maternity & women's care", ur: "قابلِ اعتماد زچگی و خواتین کی نگہداشت" },
  "hero.headingPrefix": { en: "Compassionate care for every ", ur: "ہر " },
  "hero.headingHighlight": { en: "mother", ur: "ماں" },
  "hero.headingSuffix": { en: " and baby", ur: " اور بچے کے لیے شفقت بھرا خیال" },
  "hero.paragraph": {
    en: "From your first checkup to delivery and beyond, our team walks beside you with expert obstetric care in a calm, modern clinic built around you.",
    ur: "آپ کے پہلے معائنے سے ولادت اور اس کے بعد تک، ہماری ٹیم آپ کے ساتھ ماہرانہ زچگی کے خیال کے ساتھ چلتی ہے، ایک پرسکون، جدید کلینک میں جو آپ کے گرد بنایا گیا ہے۔",
  },
  "hero.bookAppointment": { en: "Book Appointment", ur: "اپائنٹمنٹ بک کریں" },
  "hero.whatsapp": { en: "WhatsApp Us", ur: "واٹس ایپ کریں" },
  "hero.statValue": { en: "50,000+", ur: "50,000+" },
  "hero.statLabel": { en: "Safe deliveries", ur: "محفوظ ولادتیں" },

  /* ---------- STATS ---------- */
  "stats.happyMothers": { en: "Happy mothers", ur: "خوش ماں باں" },
  "stats.yearsExperience": { en: "Years of experience", ur: "سالہ تجربہ" },
  "stats.emergencySupport": { en: "Emergency support", ur: "ایمرجنسی معاونت" },
  "stats.patientSatisfaction": { en: "Patient satisfaction", ur: "مریضوں کی اطمینان" },

  /* ---------- ABOUT ---------- */
  "about.eyebrow": { en: "About Mother Care Clinic", ur: "مدر کیئر کلینک کے بارے میں" },
  "about.heading": {
    en: "A clinic built around the rhythm of pregnancy, not the clock",
    ur: "ایک ایسا کلینک جو حمل کی رفتار کے گرد بنایا گیا ہے، گھڑی کے نہیں",
  },
  "about.paragraph": {
    en: "Mother Care Clinic brings together experienced obstetricians and gynecologists under one roof. We believe every pregnancy is different, so care here is personal: unhurried consultations, modern diagnostic tools, and a team that stays with you from your first scan to postpartum recovery.",
    ur: "مدر کیئر کلینک تجربہ کار ماہرینِ زچگی اور ماہرینِ امراضِ نسواں کو ایک چھت تلے لاتا ہے۔ ہم یقین رکھتے ہیں کہ ہر حمل مختلف ہوتا ہے، اس لیے یہاں خیال ذاتی ہے: بغیر جلدی کے مشاورتیں، جدید تشخیصی آلات، اور ایک ٹیم جو آپ کے پہلے سکین سے لے کر ولادت کے بعد کی بحالی تک آپ کے ساتھ رہتی ہے۔",
  },
  "about.check1": { en: "Board-certified specialists", ur: "بورڈ سند یافتہ ماہرین" },
  "about.check2": { en: "Modern ultrasound & diagnostics", ur: "جدید الٹراساؤنڈ و تشخیص" },
  "about.check3": { en: "24/7 emergency response", ur: "24/7 ایمرجنسی ردعمل" },
  "about.check4": { en: "Calm, private consultation rooms", ur: "پرسکون، نجی مشاورتی کمرے" },
  "about.badgeValue": { en: "15+ yrs", ur: "15+ سال" },
  "about.badgeLabel": { en: "trusted experience", ur: "قابلِ اعتماد تجربہ" },

  /* ---------- SERVICES ---------- */
  "services.eyebrow": { en: "What we offer", ur: "ہم کیا پیش کرتے ہیں" },
  "services.heading": { en: "Care for every stage of motherhood", ur: "زچگی کے ہر مرحلے کے لیے خیال" },
  "services.paragraph": {
    en: "From your first positive test to your baby's first checkup, our services cover the full journey.",
    ur: "آپ کے پہلے مثبت ٹیسٹ سے لے کر آپ کے بچے کے پہلے معائنے تک، ہماری خدمات پورے سفر کو احاطہ کرتی ہیں۔",
  },
  "service.pregnancyCare.title": { en: "Pregnancy Care", ur: "حمل کی نگہداشت" },
  "service.pregnancyCare.desc": {
    en: "Comprehensive antenatal checkups tracking you and your baby's health at every stage.",
    ur: "ہر مرحلے پر آپ اور آپ کے بچے کی صحت کی نگرانی کرتے ہوئے جامع قبل از ولادت معائنے۔",
  },
  "service.normalDelivery.title": { en: "Normal Delivery", ur: "نارمل ڈیلیوری" },
  "service.normalDelivery.desc": {
    en: "Supportive, low-intervention delivery care guided by experienced obstetric midwives.",
    ur: "تجربہ کار زچگی کی دایوں کی رہنمائی میں معاونتی، کم مداخلت والی ڈیلیوری کا خیال۔",
  },
  "service.csection.title": { en: "C-Section Delivery", ur: "سی سیکشن ڈیلیوری" },
  "service.dilationCurettage.title": { en: "Dilation and Curettage", ur: "ڈائلیشن اور کیوریٹیج" },
  "service.dilationCurettage.desc": {
    en: "A minor surgical procedure to safely clear the uterine lining, used for miscarriage management and diagnostic purposes.",
    ur: "بچہ دانی کے اندرونی حصے کو محفوظ طریقے سے صاف کرنے کا ایک معمولی سرجیکل عمل، جو اسقاط حمل کے انتظام اور تشخیصی مقاصد کے لیے استعمال ہوتا ہے۔",
  },
  "service.ultrasound.title": { en: "Ultrasound", ur: "الٹراساؤنڈ" },
  "service.ultrasound.desc": {
    en: "High-resolution imaging for growth scans, anomaly checks, and reassurance visits.",
    ur: "نشوونما کے سکین، نقص کی جانچ اور اطمینان کے دوروں کے لیے اعلیٰ ریزولوشن امیجنگ۔",
  },
  "service.gynecology.title": { en: "Gynecology", ur: "امراضِ نسواں" },
  "service.gynecology.desc": {
    en: "Confidential consultations for women's health at every life stage, not just pregnancy.",
    ur: "حمل کے علاوہ زندگی کے ہر مرحلے پر خواتین کی صحت کے لیے رازدارانہ مشاورتیں۔",
  },
  "service.familyPlanning.title": { en: "Family Planning", ur: "خاندانی منصوبہ بندی" },
  "service.familyPlanning.desc": {
    en: "Judgment-free guidance on contraception and planning your next pregnancy.",
    ur: "مانع حمل اور اپنے اگل حمل کی منصوبہ بندی پر بغیر تعصب رہنمائی۔",
  },
  "service.postpartum.title": { en: "Postpartum Care", ur: "ولادت کے بعد کا خیال" },
  "service.postpartum.desc": {
    en: "Recovery support and check-ins for the weeks that matter most after delivery.",
    ur: "ڈیلیوری کے بعد سب سے زیادہ اہم ہفتوں کے لیے بحالی کی معاونت اور جانچ۔",
  },
  "service.ctg.title": { en: "Cardiotocography (CTG)", ur: "کارڈیوٹوکوگرافی (سی ٹی جی)" },
  "service.ctg.desc": {
    en: "Continuous monitoring of your baby's heartbeat and your contractions to check on your baby's wellbeing during pregnancy and labor.",
    ur: "حمل اور دورانِ زچگی بچے کی خیریت جانچنے کے لیے بچے کی دل کی دھڑکن اور آپ کے درد زہ کی مسلسل نگرانی۔",
  },

  /* ---------- WHY CHOOSE US ---------- */
  "why.eyebrow": { en: "Why choose us", ur: "ہمیں کیوں چنیں" },
  "why.heading": { en: "Care that puts you first, always", ur: "وہ خیال جو آپ کو ہمیشہ پہلے رکھتا ہے" },
  "why.paragraph": {
    en: "We built Mother Care Clinic around one idea: pregnancy should feel supported, not clinical. Every detail, from our doctors to our waiting rooms, reflects that.",
    ur: "ہم نے مدر کیئر کلینک ایک خیال کے گرد بنایا: حمل کو معاونت محسوس ہونی چاہیے، کلینکی نہیں۔ ہر تفصیل، ہمارے ڈاکٹروں سے لے کر ہمارے انتظار کے کمرے تک، اسی کو ظاہر کرتی ہے۔",
  },
  "feature.experiencedDoctors.title": { en: "Experienced Doctors", ur: "تجربہ کار ڈاکٹر" },
  "feature.experiencedDoctors.desc": {
    en: "Specialists with years of dedicated obstetric practice.",
    ur: "سالہا سال کی زچگی کی مخصوص مشاقت رکھنے والے ماہرین۔",
  },
  "feature.safeDeliveries.title": { en: "Safe Deliveries", ur: "محفوظ ولادتیں" },
  "feature.safeDeliveries.desc": {
    en: "Rigorous protocols for both normal and surgical delivery.",
    ur: "نارمل اور سرجیکل دونوں ڈیلیوری کے لیے سخت پروٹوکول۔",
  },
  "feature.modernEquipment.title": { en: "Modern Equipment", ur: "جدید آلات" },
  "feature.modernEquipment.desc": {
    en: "Up-to-date diagnostic and monitoring technology.",
    ur: "جدید تشخیصی اور نگرانی کی ٹیکنالوجی۔",
  },
  "feature.emergencySupport.title": { en: "Emergency Support", ur: "ایمرجنسی معاونت" },
  "feature.emergencySupport.desc": {
    en: "Round-the-clock response for urgent maternal care.",
    ur: "فوری زچگی کے خیال کے لیے دن رات ردعمل۔",
  },
  "feature.comfortableRooms.title": { en: "Comfortable Rooms", ur: "آرام دہ کمرے" },
  "feature.comfortableRooms.desc": {
    en: "Private, calming spaces designed for recovery.",
    ur: "بحالی کے لیے بنائے گئے نجی، پرسکون فضاء۔",
  },
  "feature.friendlyStaff.title": { en: "Friendly Staff", ur: "خوش مزاج عملہ" },
  "feature.friendlyStaff.desc": {
    en: "A warm team that treats you like family, not a file.",
    ur: "ایک گرم ٹیم جو آپ کو خاندان سمجھتی ہے، فائل نہیں۔",
  },

  /* ---------- DOCTORS ---------- */
  "doctors.eyebrow": { en: "Our specialists", ur: "ہمارے ماہرین" },
  "doctors.heading": { en: "Meet our doctors", ur: "ہمارے ڈاکٹرز سے ملیں" },
  "doctors.paragraph": {
    en: "Experienced specialists dedicated to safe pregnancies and confident deliveries.",
    ur: "محفوظ حمل اور پُراعتماد ولادتیں یقینی بنانے والے تجربہ کار ماہرین۔",
  },
  "doctor.saeeda.name": { en: "Dr. Saeeda Rehman", ur: "ڈاکٹر سعیدہ رحمان" },
  "doctor.saeeda.role": { en: "Senior Gynecologist", ur: "سینئر ماہرہ امراضِ نسواں" },
  "doctor.rashida.name": { en: "Dr. Rashida Akhtar", ur: "ڈاکٹر راشدہ اختر" },
  "doctor.rashida.role": { en: "Sonologist", ur: "ماہرہ سونولوجی" },
  "doctor.experience.20": { en: "20+ years experience", ur: "20+ سالہ تجربہ" },
  "doctor.experience.15": { en: "15+ years experience", ur: "15+ سالہ تجربہ" },
  "doctors.bookAppointment": { en: "Book Appointment", ur: "اپائنٹمنٹ بک کریں" },

  /* ---------- APPOINTMENT ---------- */
  "appt.eyebrow": { en: "Book your visit", ur: "اپنی ملاقات بک کریں" },
  "appt.heading": { en: "Request an appointment in minutes", ur: "چند منٹوں میں اپائنٹمنٹ کی درخواست دیں" },
  "appt.paragraph": {
    en: "Fill out the form and our staff will call to confirm your slot. No account or payment needed — just tell us what you need.",
    ur: "فارم بھریں اور ہمارا عملہ آپ کے سلاٹ کی تصدیق کے لیے کال کرے گا۔ کوئی اکاؤنٹ یا ادائیگی نہیں — بس ہمیں بتائیں کہ کیا چاہیے۔",
  },
  "appt.item1": { en: "Confirmation within a few hours", ur: "چند گھنٹوں میں تصدیق" },
  "appt.item2": { en: "Prefer to talk? Call us directly", ur: "بات کرنا پسند ہے؟ ہمیں براہ راست کال کریں" },
  "appt.item3": { en: "Your information stays private", ur: "آپ کی معلومات نجی رہتی ہیں" },

  /* form labels */
  "form.name": { en: "Patient Name *", ur: "مریض کا نام *" },
  "form.phone": { en: "Phone Number *", ur: "فون نمبر *" },
  "form.email": { en: "Email (optional)", ur: "ای میل (اختیاری)" },
  "form.age": { en: "Age", ur: "عمر" },
  "form.doctor": { en: "Select Doctor *", ur: "ڈاکٹر منتخب کریں *" },
  "form.service": { en: "Select Service *", ur: "خدمت منتخب کریں *" },
  "form.date": { en: "Preferred Date *", ur: "ترجیحی تاریخ *" },
  "form.reason": { en: "Reason for Visit (optional)", ur: "ملاقات کی وجہ (اختیاری)" },
  "form.message": { en: "Message (optional)", ur: "پیغام (اختیاری)" },

  /* form placeholders */
  "form.placeholder.name": { en: "Full name", ur: "پورا نام" },
  "form.placeholder.phone": { en: "03xx-xxxxxxx", ur: "03xx-xxxxxxx" },
  "form.placeholder.email": { en: "you@example.com", ur: "you@example.com" },
  "form.placeholder.age": { en: "e.g. 28", ur: "جیسے 28" },
  "form.placeholder.reason": { en: "e.g. Routine antenatal checkup", ur: "جیسے معمول کا قبل از ولادت معائنہ" },
  "form.placeholder.message": { en: "Anything else we should know?", ur: "اور کچھ جو ہمیں جاننا چاہیے؟" },

  /* form dropdowns */
  "form.chooseDoctor": { en: "Choose a doctor", ur: "ڈاکٹر منتخب کریں" },
  "form.chooseService": { en: "Choose a service", ur: "خدمت منتخب کریں" },

  /* form actions / states */
  "form.submit": { en: "Submit Appointment Request", ur: "اپائنٹمنٹ درخواست جمع کریں" },
  "form.submitting": { en: "Submitting...", ur: "جمع کر رہا ہے..." },
  "form.successTitle": { en: "Thank you!", ur: "شکریہ!" },
  "form.successText": {
    en: "Your appointment request has been received. Our staff will contact you shortly to confirm the details.",
    ur: "آپ کی اپائنٹمنٹ کی درخواست موصول ہو گئی ہے۔ ہمارا عملہ تفصیلات کی تصدیق کے لیے جلد رابطہ کرے گا۔",
  },
  "form.bookAnother": { en: "Book Another Appointment", ur: "ایک اور اپائنٹمنٹ بک کریں" },
  "form.errorTitle": { en: "Something went wrong", ur: "کچھ غلط ہو گیا" },
  "form.errorText": {
    en: "We couldn't submit your request. Please try again or call us directly.",
    ur: "ہم آپ کی درخواست جمع نہیں کر سکے۔ براہ کرم دوبارہ کوشش کریں یا ہمیں براہ راست کال کریں۔",
  },
  "form.tryAgain": { en: "Try Again", ur: "دوبارہ کوشش کریں" },

  /* form errors */
  "form.error.name": { en: "Please enter your name.", ur: "براہ کرم اپنا نام درج کریں۔" },
  "form.error.phone": { en: "Please enter a phone number.", ur: "براہ کرم فون نمبر درج کریں۔" },
  "form.error.doctor": { en: "Please select a doctor.", ur: "براہ کرم ڈاکٹر منتخب کریں۔" },
  "form.error.service": { en: "Please select a service.", ur: "براہ کرم خدمت منتخب کریں۔" },
  "form.error.date": { en: "Please choose a preferred date.", ur: "براہ کرم ترجیحی تاریخ منتخب کریں۔" },

  /* ---------- TESTIMONIALS ---------- */
  "testimonials.eyebrow": { en: "Patient stories", ur: "مریضوں کی کہانیاں" },
  "testimonials.heading": { en: "What our mothers say", ur: "ہماری ماؤں کیا کہتی ہیں" },
  "testimonial.1.name": { en: "Zainab R.", ur: "زینب ر۔" },
  "testimonial.1.text": {
    en: "The team made my entire pregnancy feel less scary. Dr. Sarah explained every step and always had time for my questions.",
    ur: "ٹیم نے میرا پورا حمل کم خوفناک بنا دیا۔ ڈاکٹر سارہ نے ہر مرحلہ سمجھایا اور ہمیشہ میرے سوالات کے لیے وقت دیا۔",
  },
  "testimonial.1.role": { en: "First-time mother", ur: "پہلی بار ماں" },
  "testimonial.2.name": { en: "Hina M.", ur: "حنا م۔" },
  "testimonial.2.text": {
    en: "My C-section was handled with so much care. The nurses checked on me constantly during recovery. I felt truly looked after.",
    ur: "میری سی سیکشن کا خیال بہت توجہ سے لیا گیا۔ نرسوں نے بحالی کے دوران مسلسل مجھے چیک کیا۔ مجھے سچ میں دیکھا گیا۔",
  },
  "testimonial.2.role": { en: "Patient, C-Section", ur: "مریض، سی سیکشن" },
  "testimonial.3.name": { en: "Sana K.", ur: "ثناء ک۔" },
  "testimonial.3.text": {
    en: "Booking the appointment online was quick, and the clinic called back the same day. Everything about this place feels organized.",
    ur: "آن لائن اپائنٹمنٹ بک کرنا جلتی تھا، اور کلینک نے اسی دن واپس کال کی۔ اس جگہ کے بارے میں سب کچھ منظم محسوس ہوتا ہے۔",
  },
  "testimonial.3.role": { en: "Antenatal patient", ur: "قبل از ولادت مریض" },

  /* ---------- FAQ ---------- */
  "faq.eyebrow": { en: "Common questions", ur: "عام سوالات" },
  "faq.heading": { en: "Frequently asked questions", ur: "اکثر پوچھے جانے والے سوالات" },
  "faq.1.q": { en: "Do I need an appointment?", ur: "کیا مجھے اپائنٹمنٹ کی ضرورت ہے؟" },
  "faq.1.a": {
    en: "Yes, we recommend booking ahead so we can match you with the right doctor and time slot. Walk-ins are seen as availability allows.",
    ur: "جی ہاں، ہم پہلے بکنگ کی سفارش کرتے ہیں تاکہ ہم آپ کو درست ڈاکٹر اور وقت سلاٹ سے ملائیں۔ بغیر اپائنٹمنٹ آنے والوں کو دستیابی کے مطابق دیکھا جاتا ہے۔",
  },
  "faq.2.q": { en: "What are your clinic timings?", ur: "آپ کے کلینک کے اوقات کیا ہیں؟" },
  "faq.2.a": {
    en: "Our clinic is open 24/7. Dr. Saeeda Rehman's OPD (consultation) hours are 12:00 PM to 3:00 PM. Ultrasound services are available from 1:30 PM to 3:00 PM. Emergency support is available around the clock.",
    ur: "ہماری کلینک 24/7 کھلی رہتی ہے۔ ڈاکٹر سعیدہ رحمان کی او پی ڈی (مشاورت) کا وقت دوپہر 12 بجے سے 3 بجے تک ہے۔ الٹراساؤنڈ کی سہولت دوپہر 1:30 بجے سے 3 بجے تک دستیاب ہے۔ ایمرجنسی سہولت ہر وقت دستیاب ہے۔",
  },
  "faq.3.q": { en: "Do you provide emergency care?", ur: "کیا آپ ایمرجنسی خیال فراہم کرتے ہیں؟" },
  "faq.3.a": {
    en: "Yes, our emergency line is staffed around the clock for urgent maternal and newborn concerns.",
    ur: "جی ہاں، ہماری ایمرجنسی لائن فوری زچگی اور نوزائیدہ خدشات کے لیے دن رات چلتی ہے۔",
  },
  "faq.4.q": { en: "Do you accept walk-ins?", ur: "کیا آپ بغیر اپائنٹمنٹ مریض دیکھتے ہیں؟" },
  "faq.4.a": {
    en: "We do, though booking an appointment first helps us reduce your waiting time.",
    ur: "جی ہاں، البتہ پہلے اپائنٹمنٹ بک کروانا آپ کے انتظار کا وقت کم کرنے میں مدد دیتا ہے۔",
  },
  "faq.5.q": { en: "How can I book?", ur: "میں بک کیسے کروں؟" },
  "faq.5.a": {
    en: "Use the appointment form above, call our front desk, or message us on WhatsApp — whichever is easiest for you.",
    ur: "اوپر دیے اپائنٹمنٹ فارم استعمال کریں، ہماری فرنٹ ڈیسک کو کال کریں، یا واٹس ایپ پر پیغام بھیجیں — جو آپ کے لیے آسان ہو۔",
  },

  /* ---------- CONTACT ---------- */
  "contact.eyebrow": { en: "Get in touch", ur: "رابطے میں آئیں" },
  "contact.heading": { en: "Visit or contact us", ur: "ہم سے ملیں یا رابطہ کریں" },
  "contact.address.title": { en: "Address", ur: "پتہ" },
  "contact.address.line1": { en: "Mother Care Clinic, Near Mehran Hospital", ur: "مدر کیئر کلینک، مہران ہسپتال کے قریب" },
  "contact.address.line2": { en: "Digri, District Mirpurkhas", ur: "ڈگری، ضلع میرپور خاص" },
  "contact.phone.title": { en: "Phone", ur: "فون" },
  "contact.phone.line": { en: "+92 123 456 7890", ur: "+92 123 456 7890" },
  "contact.whatsapp.title": { en: "WhatsApp", ur: "واٹس ایپ" },
  "contact.whatsapp.line": { en: "+92 300 123 4567", ur: "+92 300 123 4567" },
  "contact.email.title": { en: "Email", ur: "ای میل" },
  "contact.email.line": { en: "mothercare427@gmail.com", ur: "mothercare427@gmail.com" },
  "contact.hours.title": { en: "Opening Hours", ur: "اوقاتِ کار" },
  "contact.hours.line1": { en: "Open 24/7", ur: "24/7 کھلی ہے" },
  "contact.hours.line2": { en: "Hours: Open 24 hours (Monday – Sunday)", ur: "اوقات: 24 گھنٹے کھلی (پیر – اتوار)" },
  "contact.map.openLink": { en: "Open in Google Maps", ur: "گوگل میپس میں کھولیں" },

  /* ---------- CONTACT: ASK A QUESTION FORM ---------- */
  "contact.form.heading": { en: "Have a question?", ur: "کوئی سوال ہے؟" },
  "contact.form.subheading": { en: "Send us a message and our team will get back to you.", ur: "ہمیں پیغام بھیجیں، ہماری ٹیم جلد آپ سے رابطہ کرے گی۔" },
  "contact.form.name": { en: "Your Name", ur: "آپ کا نام" },
  "contact.form.email": { en: "Email", ur: "ای میل" },
  "contact.form.phone": { en: "Phone (optional)", ur: "فون (اختیاری)" },
  "contact.form.message": { en: "Your Question", ur: "آپ کا سوال" },
  "contact.form.placeholder.name": { en: "Enter your name", ur: "اپنا نام درج کریں" },
  "contact.form.placeholder.email": { en: "you@example.com", ur: "you@example.com" },
  "contact.form.placeholder.phone": { en: "03xx-xxxxxxx", ur: "03xx-xxxxxxx" },
  "contact.form.placeholder.message": { en: "Type your question here...", ur: "اپنا سوال یہاں لکھیں..." },
  "contact.form.submit": { en: "Send Question", ur: "سوال بھیجیں" },
  "contact.form.submitting": { en: "Sending...", ur: "بھیجا جا رہا ہے..." },
  "contact.form.successTitle": { en: "Question sent!", ur: "سوال بھیج دیا گیا!" },
  "contact.form.successText": { en: "Thank you for reaching out. Our team will reply to you soon.", ur: "رابطہ کرنے کا شکریہ۔ ہماری ٹیم جلد آپ کو جواب دے گی۔" },
  "contact.form.errorTitle": { en: "Something went wrong", ur: "کچھ غلط ہو گیا" },
  "contact.form.errorText": { en: "We couldn't send your question. Please try again or contact us directly.", ur: "ہم آپ کا سوال نہیں بھیج سکے۔ براہ کرم دوبارہ کوشش کریں یا براہ راست رابطہ کریں۔" },
  "contact.form.tryAgain": { en: "Try Again", ur: "دوبارہ کوشش کریں" },
  "contact.form.askAnother": { en: "Ask Another Question", ur: "ایک اور سوال پوچھیں" },
  "contact.form.error.name": { en: "Please enter your name", ur: "براہ کرم اپنا نام درج کریں" },
  "contact.form.error.contact": { en: "Please enter your email or phone", ur: "براہ کرم اپنی ای میل یا فون نمبر درج کریں" },
  "contact.form.error.message": { en: "Please write your question", ur: "براہ کرم اپنا سوال لکھیں" },

  /* ---------- FOOTER ---------- */
  "footer.tagline": {
    en: "Compassionate maternity and women's care in the heart of the city.",
    ur: "شہر کے دل میں شفقت بھرا زچگی اور خواتین کا خیال۔",
  },
  "footer.quickLinks": { en: "QUICK LINKS", ur: "فوری روابط" },
  "footer.services": { en: "SERVICES", ur: "خدمات" },
  "footer.contact": { en: "CONTACT", ur: "رابطہ" },
  "footer.link.home": { en: "Home", ur: "ہوم" },
  "footer.link.about": { en: "About", ur: "ہمارے بارے میں" },
  "footer.link.doctors": { en: "Doctors", ur: "ڈاکٹرز" },
  "footer.link.appointment": { en: "Appointment", ur: "اپائنٹمنٹ" },
  "footer.service.pregnancyCare": { en: "Pregnancy Care", ur: "حمل کی نگہداشت" },
  "footer.service.delivery": { en: "Delivery", ur: "ڈیلیوری" },
  "footer.service.ultrasound": { en: "Ultrasound", ur: "الٹراساؤنڈ" },
  "footer.service.gynecology": { en: "Gynecology", ur: "امراضِ نسواں" },
  "footer.copyright": { en: "© 2026 Mother Care Clinic. All rights reserved.", ur: "© 2026 مدر کیئر کلینک۔ جملہ حقوق محفوظ ہیں۔" },
  "footer.privacy": { en: "Privacy Policy", ur: "رازداری پالیسی" },
  "footer.terms": { en: "Terms", ur: "شرائط" },

  /* ---------- LANGUAGE TOGGLE ---------- */
  "lang.toggleToUrdu": { en: "اردو", ur: "اردو" },
  "lang.toggleToEnglish": { en: "English", ur: "English" },
};

export default translations;
