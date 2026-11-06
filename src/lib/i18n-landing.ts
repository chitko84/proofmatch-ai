import type {Locale} from './i18n';

/** Hero text is authored in full for each supported locale, so it never needs cloud translation. */
export const LANDING_HERO_COPY: Record<Locale, {
  eyebrow:string;lineOne:string;lineTwo:string;highlight:string;description:string;
  explore:string;seeHow:string;meeting:string;hint:string;
}> = {
  en: {
    eyebrow:'A better way to find the right fit',
    lineOne:'Great talent',lineTwo:'deserves to',highlight:'be seen.',
    description:'Someone can apply for one job while their projects point to another open position. ProofMatch helps recruiters find that opportunity, check the evidence, and ask what works for both sides.',
    explore:'Explore ProofMatch AI',seeHow:'See how it works',
    meeting:'Try the candidate meeting experience',hint:'Interactive workspace · No account required',
  },
  ms: {
    eyebrow:'Cara lebih baik untuk menemukan padanan yang tepat',
    lineOne:'Bakat hebat',lineTwo:'layak untuk',highlight:'diketengahkan.',
    description:'Seseorang mungkin memohon satu jawatan, sedangkan projek mereka menunjukkan kesesuaian untuk jawatan kosong yang lain. ProofMatch membantu perekrut mengenal pasti peluang itu, menyemak bukti dan memahami keperluan kedua-dua pihak.',
    explore:'Terokai ProofMatch AI',seeHow:'Lihat cara ia berfungsi',
    meeting:'Cuba sesi pertemuan calon',hint:'Ruang kerja interaktif · Tiada akaun diperlukan',
  },
  zh: {
    eyebrow:'以更好的方式找到合适的机会',
    lineOne:'优秀人才',lineTwo:'值得',highlight:'被看见。',
    description:'求职者申请的职位未必最能体现其项目经验。ProofMatch 帮助招聘人员发现更合适的空缺、核查相关证据，并了解候选人与雇主双方的期望。',
    explore:'探索 ProofMatch AI',seeHow:'了解运作方式',
    meeting:'体验求职者面试会议',hint:'互动工作区 · 无需注册账号',
  },
  ta: {
    eyebrow:'சரியான வேலைப் பொருத்தத்தைக் கண்டறிய சிறந்த வழி',
    lineOne:'சிறந்த திறமை',lineTwo:'அனைவராலும்',highlight:'அறியப்பட வேண்டும்.',
    description:'ஒருவர் ஒரு வேலைக்கு விண்ணப்பித்தாலும், அவரது திட்ட அனுபவம் வேறொரு காலிப் பணிக்கு மிகவும் பொருத்தமாக இருக்கலாம். அந்த வாய்ப்பைக் கண்டறியவும், ஆதாரங்களைச் சரிபார்க்கவும், இருதரப்பின் எதிர்பார்ப்புகளைப் புரிந்துகொள்ளவும் ProofMatch ஆட்சேர்ப்பாளர்களுக்கு உதவுகிறது.',
    explore:'ProofMatch AI-ஐ ஆராயுங்கள்',seeHow:'இது எவ்வாறு செயல்படுகிறது?',
    meeting:'வேட்பாளர் நேர்காணல் அனுபவத்தை முயற்சிக்கவும்',hint:'ஊடாடும் பணியிடம் · கணக்கு தேவையில்லை',
  },
  my: {
    eyebrow:'သင့်လျော်သော အလုပ်အကိုင်ကို ပိုမိုကောင်းမွန်စွာ ရှာဖွေပါ',
    lineOne:'ထူးချွန်သူတိုင်း',lineTwo:'အသိအမှတ်ပြုခံရဖို့',highlight:'ထိုက်တန်ပါတယ်။',
    description:'အလုပ်လျှောက်ထားသူတစ်ဦးသည် အလုပ်တစ်ခုကို လျှောက်ထားသော်လည်း ၎င်း၏ စီမံကိန်းအတွေ့အကြုံက အခြားရာထူးတစ်ခုနှင့် ပိုမိုကိုက်ညီနိုင်ပါသည်။ ProofMatch AI သည် ဝန်ထမ်းခန့်ထားသူများအား အထောက်အထားများ စစ်ဆေးပြီး နှစ်ဖက်စလုံးအတွက် သင့်လျော်သော အခွင့်အလမ်းများ ရှာဖွေရန် ကူညီပေးပါသည်။',
    explore:'ProofMatch AI ကို လေ့လာရန်',seeHow:'အလုပ်လုပ်ပုံ ကြည့်ရန်',
    meeting:'အလုပ်လျှောက်ထားသူ အင်တာဗျူး အတွေ့အကြုံ စမ်းရန်',
    hint:'အပြန်အလှန် အသုံးပြုနိုင်သော လုပ်ငန်းခွင် · အကောင့် မလိုအပ်ပါ',
  }
};
