import {FOCUSED_ENTRIES} from './i18n-focused.ts';
import {BURMESE_ENTRIES} from './i18n-burmese.ts';
import {ACCELERATOR_ENTRIES} from './i18n-accelerator.ts';
import {JOB_HUNT_ENTRIES} from './i18n-job-hunt.ts';
import {CAREER_WORLD_ENTRIES} from './i18n-worlds.ts';
import {TALENT_NETWORK_ENTRIES} from './i18n-talent-network.ts';
import {CANDIDATE_PAGE_ENTRIES} from './i18n-candidate-pages.ts';
import {CAREER_ENTRIES} from './i18n-career-roles.ts';
import {EXTENDED_ENTRIES} from './i18n-extended.ts';
import {WORKFLOW_ENTRIES} from './i18n-workflows.ts';
import {INSIGHTS_STUDIO_ENTRIES} from './i18n-insights-studio.ts';
/**
 * ProofMatch AI interface localizations.
 * English is the source language. Curated UI phrases remain available without an API key.
 * Dynamic page copy can be translated by /api/translate when GEMINI_API_KEY is configured.
 */
export const LOCALES = [
 {code:'en',nativeName:'English',label:'English',htmlLang:'en',speechLang:'en-US'},
 {code:'ms',nativeName:'Bahasa Melayu',label:'Malay',htmlLang:'ms',speechLang:'ms-MY'},
 {code:'ta',nativeName:'தமிழ்',label:'Tamil',htmlLang:'ta',speechLang:'ta-IN'},
 {code:'zh',nativeName:'简体中文 · 普通话',label:'Mandarin Chinese (Simplified)',htmlLang:'zh-Hans',speechLang:'zh-CN'},
 {code:'my',nativeName:'မြန်မာ',label:'Burmese (Myanmar)',htmlLang:'my',speechLang:'my-MM'},
] as const;
export type Locale = (typeof LOCALES)[number]['code'];
export function isLocale(value: unknown): value is Locale {return LOCALES.some(x=>x.code===value)}
export function localeInfo(value: Locale){return LOCALES.find(x=>x.code===value)!}
export const LOCALE_STORAGE_KEY='proofmatch-language-v1';

// [English, Malay, Tamil, Simplified Chinese]. Proper nouns/brand names intentionally remain unchanged.
const entries: Array<[string,string,string,string]> = [
 ['Language','Bahasa','மொழி','语言'],
 ['Candidate View','Paparan Calon','வேட்பாளர் பார்வை','求职者视图'],
 ['HR View','Paparan HR','HR பார்வை','招聘方视图'],
 ['Choose workspace view','Pilih paparan ruang kerja','பணியிடப் பார்வையைத் தேர்ந்தெடுக்கவும்','选择工作区视图'],
 ['Choose your workspace','Pilih ruang kerja anda','உங்கள் பணியிடத்தைத் தேர்ந்தெடுக்கவும்','选择工作区'],
 ['Workspace views','Paparan ruang kerja','பணியிடப் பார்வைகள்','工作区视图'],
 ['HIRING WORKSPACE','RUANG PENGAMBILAN PEKERJA','பணியமர்த்தல் பணியிடம்','招聘工作区'],
 ['CANDIDATE WORKSPACE','RUANG CALON','வேட்பாளர் பணியிடம்','求职者工作区'],
 ['MY CAREER','KERJAYA SAYA','என் தொழில்','我的职业'],
 ['NEWS & COMMUNITY','BERITA & KOMUNITI','செய்திகள் மற்றும் சமூகம்','新闻与社区'],
 ['MORE TOOLS','LEBIH BANYAK ALAT','கூடுதல் கருவிகள்','更多工具'],
 ['More tools','Lagi alat','மேலும் கருவிகள்','更多工具'],
 ['APPLICATIONS & MESSAGES','PERMOHONAN & MESEJ','விண்ணப்பங்களும் செய்திகளும்','申请与消息'],
 ['LEARN & EXPLORE','BELAJAR & TEROKAI','கற்றலும் ஆராய்தலும்','学习与探索'],
 ['TEAM & PERFORMANCE','PASUKAN & PRESTASI','குழுவும் செயல்திறனும்','团队与绩效'],
 ['MATCH & REFERRALS','PADANAN & RUJUKAN','பொருத்தங்கள் மற்றும் பரிந்துரைகள்','匹配与推荐'],
 ['COMPANY & ANALYTICS','SYARIKAT & ANALITIK','நிறுவனங்கள் மற்றும் பகுப்பாய்வு','企业与分析'],
 ['COMMUNICATIONS','KOMUNIKASI','தொடர்புகள்','沟通交流'],
 ['MORE','LAIN-LAIN','மேலும்','更多'],
 ['Recruiter navigation','Navigasi perekrut','ஆட்சேர்ப்பாளர் வழிசெலுத்தல்','招聘方导航'],
 ['Candidate navigation','Navigasi calon','வேட்பாளர் வழிசெலுத்தல்','求职者导航'],
 ['My referrals & consent','Rujukan & persetujuan saya','என் பரிந்துரைகளும் ஒப்புதலும்','我的推荐与授权'],
 ['Meetings & invitations','Mesyuarat & jemputan','சந்திப்புகளும் அழைப்புகளும்','会议与邀请'],

 ['Meet Mira','Kenali Mira','மீராவைச் சந்திக்கவும்','认识 Mira'],
 ['Check the interviewer voice before entering the meeting.','Uji suara penemu duga sebelum memasuki sesi.','சந்திப்பில் சேர்வதற்கு முன் நேர்காணல் நடத்துபவரின் குரலைச் சோதிக்கவும்.','进入面试会议前先试听面试官的声音。'],
 ['Hear sample voice','Dengar contoh suara','மாதிரி குரலைக் கேளுங்கள்','试听示例语音'],
 ['Hear Mira','Dengar Mira','மீராவின் குரலைக் கேளுங்கள்','聆听 Mira'],
 ['Stop voice','Hentikan suara','குரலை நிறுத்து','停止语音'],
 ['Mic on','Mikrofon hidup','மைக்ரோஃபோன் இயங்குகிறது','麦克风开启'],
 ['Mic off','Mikrofon mati','மைக்ரோஃபோன் அணைக்கப்பட்டுள்ளது','麦克风关闭'],
 ['Your local camera preview','Pratonton kamera anda','உங்கள் கேமரா முன்னோட்டம்','您的摄像头预览'],
 ['Professional Portfolio Presentation','Pembentangan Portfolio Profesional','தொழில்முறை தொகுப்புக் காட்சி','专业作品集演示'],

 ['Choose language','Pilih bahasa','மொழியைத் தேர்ந்தெடுக்கவும்','选择语言'],
 ['Translate this page','Terjemah halaman ini','இந்தப் பக்கத்தை மொழிபெயர்','翻译此页面'],
 ['Automatic translation','Terjemahan automatik','தானியங்கி மொழிபெயர்ப்பு','自动翻译'],
 ['Search','Cari','தேடல்','搜索'],
 ['Close','Tutup','மூடு','关闭'],
 ['Back','Kembali','பின்செல்','返回'],
 ['Next','Seterusnya','அடுத்து','下一步'],
 ['Continue','Teruskan','தொடரவும்','继续'],
 ['Done','Selesai','முடிந்தது','完成'],
 ['Cancel','Batal','ரத்துசெய்','取消'],
 ['Save','Simpan','சேமி','保存'],
 ['Saved','Disimpan','சேமிக்கப்பட்டது','已保存'],
 ['Delete','Padam','நீக்கு','删除'],
 ['Edit','Edit','திருத்து','编辑'],
 ['Send','Hantar','அனுப்பு','发送'],
 ['View','Lihat','பார்','查看'],
 ['Open','Buka','திற','打开'],
 ['Apply','Mohon','விண்ணப்பி','申请'],
 ['Apply now','Mohon sekarang','இப்போது விண்ணப்பிக்கவும்','立即申请'],
 ['Share','Kongsi','பகிர்','分享'],
 ['ShareSpace','ShareSpace','ShareSpace','ShareSpace'],
 ['Like','Suka','விருப்பம்','点赞'],
 ['Comment','Komen','கருத்து','评论'],
 ['Following','Mengikuti','பின்தொடர்கிறேன்','已关注'],
 ['Follow','Ikuti','பின்தொடர்','关注'],
 ['Messages','Mesej','செய்திகள்','消息'],
 ['Your workspace','Ruang kerja anda','உங்கள் பணியிடம்','您的工作区'],
 ['Workspace ready','Ruang kerja sedia','பணியிடம் தயார்','工作区已就绪'],
 ['Practice studio','Studio latihan','பயிற்சி அரங்கு','练习空间'],
 ['WORKSPACE','RUANG KERJA','பணியிடம்','工作区'],
 ['DISCOVER','TEROKAI','கண்டறியுங்கள்','探索'],
 ['OPPORTUNITIES','PELUANG','வாய்ப்புகள்','职位机会'],
 ['CAREER EXPERIENCE','PENGALAMAN KERJAYA','தொழில் அனுபவம்','职业体验'],
 ['NETWORK','RANGKAIAN','வலையமைப்பு','人脉网络'],
 ['CONNECT WITH PEOPLE','BERHUBUNG DENGAN ORANG','மக்களுடன் இணையுங்கள்','与人建立联系'],
 ['EXPLORE MORE','TEROKAI LAGI','மேலும் ஆராயுங்கள்','探索更多'],
 ['Getting started','Mulakan di sini','தொடங்குங்கள்','开始使用'],
 ['Overview','Gambaran keseluruhan','மேலோட்டம்','概览'],
 ['Talent insights','Cerapan bakat','திறன் நுண்ணறிவுகள்','人才洞察'],
 ['Candidates','Calon','வேட்பாளர்கள்','候选人'],
 ['Check a new CV','Semak CV baharu','புதிய சுயவிவரத்தைச் சரிபார்','检查新简历'],
 ['Job roles','Jawatan kerja','வேலைப் பொறுப்புகள்','职位'],
 ['Compare job matches','Bandingkan padanan kerja','வேலைப் பொருத்தங்களை ஒப்பிடு','比较职位匹配'],
 ['Blindspot Rescue','Blindspot Rescue','Blindspot Rescue','Blindspot Rescue'],
 ['See what changes','Lihat perubahan','மாற்றங்களைப் பார்','查看变化'],
 ['What works for both sides','Yang sesuai untuk kedua-dua pihak','இருதரப்புக்கும் பொருத்தமானது','双向适配'],
 ['My review list','Senarai semakan saya','என் மதிப்பீட்டுப் பட்டியல்','我的审核列表'],
 ['Add or correct details','Tambah atau betulkan maklumat','விவரங்களைச் சேர்க்க / திருத்த','补充或更正信息'],
 ['Show what you can do','Tunjukkan kebolehan anda','உங்கள் திறமையை வெளிப்படுத்துங்கள்','展示您的能力'],
 ['Find jobs & companies','Cari kerja & syarikat','வேலைகள் மற்றும் நிறுவனங்களைக் கண்டறி','查找职位与公司'],
 ['Career Experience','Pengalaman Kerjaya','தொழில் அனுபவம்','职业体验'],
 ['AI Mock Interview','Temu Duga Latihan AI','AI மாதிரி நேர்காணல்','AI 模拟面试'],
 ['Invite to another job','Jemput ke jawatan lain','வேறு வேலைக்கு அழைக்கவும்','邀请申请其他职位'],
 ['Schedule a LiveRoom','Jadualkan LiveRoom','LiveRoom நேரத்தை நிர்ணயி','预约 LiveRoom'],
 ['Prepare interview questions','Sediakan soalan temu duga','நேர்காணல் கேள்விகளைத் தயாரி','准备面试问题'],
 ['Ask Mira','Tanya Mira','Mira-விடம் கேளுங்கள்','询问 Mira'],
 ['FuturePath AI','FuturePath AI','FuturePath AI','FuturePath AI'],
 ['Proof Over Polish','Proof Over Polish','Proof Over Polish','Proof Over Polish'],
 ['How the data works','Cara data berfungsi','தரவு செயல்படும் விதம்','数据如何运作'],
 ['People decide. AI assists.','Manusia membuat keputusan. AI membantu.','மனிதர்களே முடிவெடுக்கிறார்கள். AI உதவுகிறது.','由人做决定，AI 提供协助。'],
 ['No automatic hiring or rejection.','Tiada pengambilan atau penolakan automatik.','தானியங்கி பணியமர்த்தல் அல்லது நிராகரிப்பு இல்லை.','不会自动录用或拒绝。'],
 ['Back to website','Kembali ke laman web','இணையதளத்திற்குத் திரும்பு','返回网站'],
 ['Features','Ciri-ciri','அம்சங்கள்','功能'],
 ['How it works','Cara ia berfungsi','இது எப்படிச் செயல்படுகிறது','运作方式'],
 ['About','Tentang','பற்றி','关于'],
 ['Find jobs','Cari kerja','வேலைகளைத் தேடு','找工作'],
 ['Open workspace','Buka ruang kerja','பணியிடத்தைத் திற','打开工作区'],
 ['Great talent deserves to be seen.','Bakat hebat layak diketengahkan.','சிறந்த திறமை வெளிச்சத்துக்கு வர வேண்டும்.','优秀人才值得被看见。'],
 ['Explore ProofMatch AI','Terokai ProofMatch AI','ProofMatch AI-ஐ ஆராயுங்கள்','探索 ProofMatch AI'],
 ['More people. More possibilities.','Lebih ramai orang. Lebih banyak peluang.','மேலும் பலர். மேலும் பல வாய்ப்புகள்.','更多人才，更多可能。'],
 ['Explore jobs','Terokai pekerjaan','வேலைகளை ஆராயுங்கள்','探索职位'],
 ['My messages','Mesej saya','என் செய்திகள்','我的消息'],
 ['Interview practice','Latihan temu duga','நேர்காணல் பயிற்சி','面试练习'],
 ['Your next opportunity starts with practice.','Peluang seterusnya bermula dengan latihan.','உங்கள் அடுத்த வாய்ப்பு பயிற்சியுடன் தொடங்குகிறது.','下一个机会，从练习开始。'],
 ['Choose an experience','Pilih pengalaman','ஓர் அனுபவத்தைத் தேர்ந்தெடுக்கவும்','选择体验'],
 ['YOUR PRACTICE STUDIO','STUDIO LATIHAN ANDA','உங்கள் பயிற்சி அரங்கு','您的练习空间'],
 ['YOUR TARGET ROLE','JAWATAN SASARAN ANDA','நீங்கள் விரும்பும் பணி','您的目标职位'],
 ['Ready to practise','Sedia untuk berlatih','பயிற்சிக்குத் தயார்','准备开始练习'],
 ['Role-based practice','Latihan mengikut jawatan','பணிக்கு ஏற்ற பயிற்சி','职位专项练习'],
 ['Learn by doing','Belajar melalui praktikal','செய்து கற்றுக்கொள்','实践中学习'],
 ['Reflect and improve','Nilai dan tingkatkan','சிந்தித்து மேம்படு','反思并提升'],
 ['Start an AI mock interview','Mulakan temu duga latihan AI','AI மாதிரி நேர்காணலைத் தொடங்கு','开始 AI 模拟面试'],
 ['Walk in prepared.','Masuk dengan persediaan.','தயாராகச் செல்லுங்கள்.','做好准备，自信入场。'],
 ['Walk out stronger.','Keluar dengan lebih yakin.','மேலும் திறமையுடன் வெளியேறுங்கள்.','收获成长，自信离场。'],
 ['MEET YOUR INTERVIEW COACH','KENALI JURULATIH TEMU DUGA ANDA','உங்கள் நேர்காணல் பயிற்சியாளரைச் சந்தியுங்கள்','认识您的面试教练'],
 ['YOUR SESSION','SESI ANDA','உங்கள் அமர்வு','您的场次'],
 ['Make it yours','Sesuaikan sesi anda','உங்களுக்கு ஏற்றபடி அமைக்கவும்','定制您的练习'],
 ['Target career','Kerjaya sasaran','இலக்குத் தொழில்','目标职业'],
 ['Experience level','Tahap pengalaman','அனுபவ நிலை','经验水平'],
 ['Interview focus','Fokus temu duga','நேர்காணல் கவனம்','面试重点'],
 ['Interviewer style','Gaya penemu duga','நேர்காணல் நடத்துபவர் பாணி','面试官风格'],
 ['Session length','Tempoh sesi','அமர்வு நீளம்','面试时长'],
 ['Your background','Latar belakang anda','உங்கள் பின்னணி','您的背景'],
 ['Important skills (optional)','Kemahiran penting (pilihan)','முக்கிய திறன்கள் (விருப்பத்தேர்வு)','重要技能（可选）'],
 ['Profession name','Nama profesion','தொழில் பெயர்','职业名称'],
 ['Interview settings','Tetapan temu duga','நேர்காணல் அமைப்புகள்','面试设置'],
 ['Enter interview room','Masuk ke bilik temu duga','நேர்காணல் அறைக்குள் நுழை','进入面试室'],
 ['Voice or text answers','Jawapan suara atau teks','குரல் அல்லது உரை பதில்கள்','语音或文字回答'],
 ['Role-specific questions','Soalan mengikut jawatan','பணி சார்ந்த கேள்விகள்','岗位专属问题'],
 ['Present slides or share a screen','Bentang slaid atau kongsi skrin','ஸ்லைடுகளை வழங்குங்கள் அல்லது திரையைப் பகிருங்கள்','展示幻灯片或共享屏幕'],
 ['Private progress','Kemajuan peribadi','தனிப்பட்ட முன்னேற்றம்','私人学习进度'],
 ['INTERVIEW IN PROGRESS','TEMU DUGA SEDANG BERJALAN','நேர்காணல் நடைபெறுகிறது','面试进行中'],
 ['History','Sejarah','வரலாறு','历史'],
 ['Setup','Persediaan','அமைப்பு','设置'],
 ['Session history','Sejarah sesi','அமர்வு வரலாறு','练习历史'],
 ['Resume','Sambung','தொடர்','继续'],
 ['Pause','Jeda','இடைநிறுத்து','暂停'],
 ['Finish','Tamatkan','முடி','结束'],
 ['End interview','Tamatkan temu duga','நேர்காணலை முடி','结束面试'],
 ['Send answer','Hantar jawapan','பதிலை அனுப்பு','提交回答'],
 ['Skip question','Langkau soalan','கேள்வியைத் தவிர்','跳过问题'],
 ['Next question','Soalan seterusnya','அடுத்த கேள்வி','下一题'],
 ['Previous','Sebelumnya','முந்தையது','上一页'],
 ['Feedback','Maklum balas','கருத்துகள்','反馈'],
 ['Your feedback','Maklum balas anda','உங்கள் கருத்துகள்','您的反馈'],
 ['Interview report','Laporan temu duga','நேர்காணல் அறிக்கை','面试报告'],
 ['Download report','Muat turun laporan','அறிக்கையைப் பதிவிறக்கு','下载报告'],
 ['Download transcript','Muat turun transkrip','உரையாடலைப் பதிவிறக்கு','下载记录'],
 ['Camera','Kamera','கேமரா','摄像头'],
 ['Microphone','Mikrofon','ஒலிவாங்கி','麦克风'],
 ['Screen share','Kongsi skrin','திரையைப் பகிர்','共享屏幕'],
 ['Share screen','Kongsi skrin','திரையைப் பகிர்','共享屏幕'],
 ['Stop sharing','Hentikan perkongsian','பகிர்வை நிறுத்து','停止共享'],
 ['Upload slides','Muat naik slaid','ஸ்லைடுகளைப் பதிவேற்று','上传幻灯片'],
 ['Presentation','Pembentangan','விளக்கக்காட்சி','演示文稿'],
 ['Speaker notes','Nota pembentang','விளக்கக் குறிப்புகள்','演讲备注'],
 ['Slides','Slaid','ஸ்லைடுகள்','幻灯片'],
 ['Start practice','Mulakan latihan','பயிற்சியைத் தொடங்கு','开始练习'],
 ['Try again','Cuba lagi','மீண்டும் முயற்சி செய்','重试'],
 ['Create','Cipta','உருவாக்கு','创建'],
 ['Create post','Cipta siaran','பதிவு உருவாக்கு','创建帖子'],
 ['Publish post','Terbitkan siaran','பதிவை வெளியிடு','发布帖子'],
 ['Share an update','Kongsi perkembangan','புதிய தகவலைப் பகிருங்கள்','分享动态'],
 ['Add a picture','Tambah gambar','படம் சேர்','添加图片'],
 ['YOUR SPACE','RUANG ANDA','உங்கள் இடம்','您的空间'],
 ['EXPLORE MORE','TEROKAI LAGI','மேலும் ஆராயுங்கள்','探索更多'],
 ['My professional space','Ruang profesional saya','என் தொழில்முறை இடம்','我的职业空间'],
 ['Candidate perspective','Paparan calon','வேட்பாளர் பார்வை','候选人视角'],
 ['Recruiter perspective','Paparan perekrut','ஆட்சேர்ப்பாளர் பார்வை','招聘方视角'],
 ['Saved posts','Siaran disimpan','சேமித்த பதிவுகள்','已保存帖子'],
 ['Your posts','Siaran anda','உங்கள் பதிவுகள்','您的帖子'],
 ['For you','Untuk anda','உங்களுக்காக','为您推荐'],
 ['Saved posts','Siaran disimpan','சேமித்த பதிவுகள்','已保存帖子'],
 ['All topics','Semua topik','அனைத்து தலைப்புகளும்','所有话题'],
 ['Topics','Topik','தலைப்புகள்','话题'],
 ['Search posts','Cari siaran','பதிவுகளைத் தேடு','搜索帖子'],
 ['Discover ideas, exchange career advice and celebrate what people are building.','Temui idea, bertukar nasihat kerjaya dan raikan hasil usaha komuniti.','புதிய யோசனைகள், தொழில் ஆலோசனைகளைப் பகிர்ந்து சாதனைகளைக் கொண்டாடுங்கள்.','发现创意、交流职业建议，分享大家的成果。'],
 ['All industries','Semua industri','அனைத்துத் துறைகளும்','所有行业'],
 ['Any work style','Semua jenis kerja','எந்த வேலை முறையும்','任何工作方式'],
 ['Jobs','Pekerjaan','வேலைகள்','职位'],
 ['Companies','Syarikat','நிறுவனங்கள்','公司'],
 ['Applications','Permohonan','விண்ணப்பங்கள்','申请记录'],
 ['Recruiter','Perekrut','ஆட்சேர்ப்பாளர்','招聘方'],
 ['Saved jobs','Pekerjaan disimpan','சேமித்த வேலைகள்','已收藏职位'],
 ['Search jobs','Cari pekerjaan','வேலைகளைத் தேடு','搜索职位'],
 ['Search companies','Cari syarikat','நிறுவனங்களைத் தேடு','搜索公司'],
 ['View company','Lihat syarikat','நிறுவனத்தைப் பார்','查看公司'],
 ['Company details','Maklumat syarikat','நிறுவன விவரங்கள்','公司详情'],
 ['Job details','Maklumat jawatan','வேலை விவரங்கள்','职位详情'],
 ['My applications','Permohonan saya','என் விண்ணப்பங்கள்','我的申请'],
 ['Send application','Hantar permohonan','விண்ணப்பத்தை அனுப்பு','提交申请'],
 ['Full name','Nama penuh','முழுப் பெயர்','姓名'],
 ['Email','E-mel','மின்னஞ்சல்','邮箱'],
 ['Phone','Telefon','தொலைபேசி','电话'],
 ['Cover letter','Surat permohonan','விண்ணப்பக் கடிதம்','求职信'],
 ['Search messages','Cari mesej','செய்திகளைத் தேடு','搜索消息'],
 ['New message','Mesej baharu','புதிய செய்தி','新消息'],
 ['Type a message','Taip mesej','செய்தியை உள்ளிடவும்','输入消息'],
 ['All messages','Semua mesej','அனைத்து செய்திகளும்','所有消息'],
 ['Unread','Belum dibaca','படிக்காதவை','未读'],
 ['Today','Hari ini','இன்று','今天'],
 ['Yesterday','Semalam','நேற்று','昨天'],
 ['Online','Dalam talian','இணையத்தில்','在线'],
 ['No results','Tiada hasil','முடிவுகள் இல்லை','没有结果'],
 ['No conversations yet','Belum ada perbualan','இன்னும் உரையாடல்கள் இல்லை','暂无会话'],
 ['Start a conversation','Mulakan perbualan','உரையாடலைத் தொடங்கு','开始对话'],
 ['All','Semua','அனைத்தும்','全部'],
 ['Recommended','Disyorkan','பரிந்துரைக்கப்பட்டது','推荐'],
 ['Relevant','Berkaitan','பொருத்தமானது','相关'],
 ['View profile','Lihat profil','சுயவிவரத்தைப் பார்','查看个人资料'],
 ['Skills','Kemahiran','திறன்கள்','技能'],
 ['Experience','Pengalaman','அனுபவம்','经验'],
 ['Location','Lokasi','இடம்','地点'],
 ['Industry','Industri','துறை','行业'],
 ['Department','Jabatan','துறை','部门'],
 ['Salary','Gaji','சம்பளம்','薪资'],
 ['Requirements','Syarat','தேவைகள்','要求'],
 ['Description','Penerangan','விளக்கம்','描述'],
 ['Results','Keputusan','முடிவுகள்','结果'],
 ['Profile','Profil','சுயவிவரம்','个人资料'],
 ['Settings','Tetapan','அமைப்புகள்','设置'],
 ['Loading...','Sedang memuatkan...','ஏற்றப்படுகிறது...','正在加载...'],
 ['No more results','Tiada lagi hasil','மேலும் முடிவுகள் இல்லை','没有更多结果'],
 ['Show more','Lihat lagi','மேலும் காட்டு','显示更多'],
 ['Show less','Lihat kurang','குறைவாகக் காட்டு','收起'],
 ['Load more','Muat lagi','மேலும் ஏற்று','加载更多'],
 ['Filter','Tapis','வடிகட்டு','筛选'],
 ['Filters','Penapis','வடிகட்டிகள்','筛选条件'],
 ['Sort by','Susun mengikut','வரிசைப்படுத்து','排序依据'],
 ['Clear filters','Kosongkan penapis','வடிகட்டிகளை நீக்கு','清除筛选'],
 ['Start','Mula','தொடங்கு','开始'],
 ['Complete','Selesai','நிறைவடைந்தது','完成'],
 ['In progress','Sedang berjalan','செயலில் உள்ளது','进行中'],
 ['Submit','Hantar','சமர்ப்பி','提交'],
 ['Learn more','Ketahui lebih lanjut','மேலும் அறிக','了解更多'],
 ['Welcome back','Selamat kembali','மீண்டும் வரவேற்கிறோம்','欢迎回来'],
 ['Manage','Urus','நிர்வகி','管理'],
 ['Notifications','Pemberitahuan','அறிவிப்புகள்','通知'],
 ['Refresh','Muat semula','புதுப்பி','刷新'],
 ['See all','Lihat semua','அனைத்தையும் பார்','查看全部'],
 ['Go back','Kembali','திரும்பிச் செல்','返回'],
 ['Copy','Salin','நகலெடு','复制'],
 ['Copied','Disalin','நகலெடுக்கப்பட்டது','已复制'],
 ['Discover better matches','Temui padanan yang lebih baik','சிறந்த பொருத்தங்களைக் கண்டறியுங்கள்','发现更合适的匹配'],
 ['Make better connections','Bina hubungan yang lebih baik','சிறந்த தொடர்புகளை உருவாக்குங்கள்','建立更好的联系'],
 ['A better way to find the right fit','Cara lebih baik mencari padanan yang tepat','சரியான பொருத்தத்தைக் கண்டறிய ஒரு சிறந்த வழி','找到合适机会的新方式'],
 ['See how it works','Lihat cara ia berfungsi','இது எப்படி இயங்குகிறது என்பதைப் பாருங்கள்','了解运作方式'],
 ['Great skills can fit more than one job.','Kemahiran hebat boleh sesuai untuk lebih daripada satu pekerjaan.','சிறந்த திறன்கள் பல வேலைகளுக்குப் பொருந்தலாம்.','优秀技能可匹配多个职位。'],
 ['Find someone overlooked','Temui bakat yang terlepas pandang','கவனிக்கப்படாத திறமையைக் கண்டறியுங்கள்','发现被忽视的人才'],
 ['See why a role fits','Lihat mengapa jawatan itu sesuai','ஒரு வேலை ஏன் பொருந்துகிறது என்று அறிக','了解职位为何匹配'],
 ['Real reasons, right next to the result.','Alasan sebenar, di sebelah keputusan.','முடிவுகளுடன் தெளிவான காரணங்களும்.','结果旁边就有清晰依据。'],
 ['See where you could grow','Lihat potensi perkembangan anda','நீங்கள் எவ்வாறு வளரலாம் என்று அறிக','了解您的成长空间'],
 ['Explore possible paths, not promises.','Terokai laluan yang mungkin, bukan janji.','சாத்தியமான பாதைகளை ஆராயுங்கள்; உத்தரவாதம் அல்ல.','探索可能的路径，而非保证。'],
 ['Look beyond the job title.','Lihat lebih daripada tajuk jawatan.','பணிப் பெயரைத் தாண்டிப் பாருங்கள்.','别只看职位名称。'],
 ['Every suggestion has a reason.','Setiap cadangan mempunyai sebab.','ஒவ்வொரு பரிந்துரைக்கும் ஒரு காரணம் உண்டு.','每条建议都有依据。'],
 ['Give great talent a closer look.','Beri bakat hebat perhatian yang sewajarnya.','சிறந்த திறமையை இன்னும் நெருக்கமாகப் பாருங்கள்.','认真发现优秀人才。'],
 ['Three easy steps. Better conversations.','Tiga langkah mudah. Perbualan lebih baik.','மூன்று எளிய படிகள். சிறந்த உரையாடல்கள்.','简单三步，开启更好的交流。'],
 ['Choose your people','Pilih calon anda','உங்கள் வேட்பாளர்களைத் தேர்ந்தெடுக்கவும்','选择人才'],
 ['Explore the matches','Terokai padanan','பொருத்தங்களை ஆராயுங்கள்','探索匹配结果'],
 ['Review and decide','Semak dan putuskan','மதிப்பாய்வு செய்து முடிவெடுங்கள்','审查并决定'],
 ['Keep career conversations in one organized place.','Urus perbualan kerjaya di satu tempat.','தொழில் உரையாடல்களை ஒரே இடத்தில் ஒழுங்குபடுத்துங்கள்.','集中管理职业交流。'],
 ['Inbox','Peti masuk','உள்வரவு','收件箱'],
 ['New conversation','Perbualan baharu','புதிய உரையாடல்','新对话'],
 ['Find a person to message.','Cari seseorang untuk dihantar mesej.','செய்தி அனுப்ப ஒருவரைக் கண்டறியுங்கள்.','查找要联系的人。'],
 ['Search by name or company','Cari mengikut nama atau syarikat','பெயர் அல்லது நிறுவனத்தால் தேடு','按姓名或公司搜索'],
 ['Search conversations','Cari perbualan','உரையாடல்களைத் தேடு','搜索对话'],
 ['No conversations found.','Tiada perbualan ditemui.','உரையாடல்கள் இல்லை.','未找到对话。'],
 ['Writing as','Menulis sebagai','எழுதும் அடையாளம்','发送身份'],
 ['Candidate','Calon','வேட்பாளர்','候选人'],
 ['Recruiter','Perekrut','ஆட்சேர்ப்பாளர்','招聘方'],
 ['Message perspective','Paparan mesej','செய்தி பார்வை','消息视角'],
 ['Search contacts','Cari kenalan','தொடர்புகளைத் தேடு','搜索联系人'],
 ['My professional space','Ruang profesional saya','என் தொழில்முறை இடம்','我的职业空间'],
 ['Send message','Hantar mesej','செய்தியை அனுப்பு','发送消息'],
 ['Compose message','Tulis mesej','செய்தியை எழுதுங்கள்','撰写消息'],
 ['Community update','Perkembangan komuniti','சமூகச் செய்தி','社区动态'],
 ['Add image','Tambah imej','படம் சேர்','添加图片'],
 ['Remove image','Buang imej','படத்தை நீக்கு','移除图片'],
 ['Comment on this post','Komen pada siaran ini','இந்தப் பதிவில் கருத்திடுங்கள்','评论这篇帖子'],
 ['Share your thoughts','Kongsi pendapat anda','உங்கள் எண்ணங்களைப் பகிருங்கள்','分享您的想法'],
 ['View jobs','Lihat pekerjaan','வேலைகளைப் பார்','查看职位'],
 ['View applications','Lihat permohonan','விண்ணப்பங்களைப் பார்','查看申请'],
 ['All positions','Semua jawatan','அனைத்து பணிகளும்','所有职位'],
 ['Explore companies','Terokai syarikat','நிறுவனங்களை ஆராயுங்கள்','探索公司'],
 ['Your applications','Permohonan anda','உங்கள் விண்ணப்பங்கள்','您的申请'],
 ['Track applications','Jejak permohonan','விண்ணப்பங்களைக் கண்காணி','跟踪申请'],
 ['Clear search','Kosongkan carian','தேடலை அழி','清除搜索'],
 ['No matches found','Tiada padanan ditemui','பொருத்தங்கள் இல்லை','没有匹配结果'],
 ['Results found','Hasil ditemui','முடிவுகள் கிடைத்தன','找到结果'],
 ['Bookmark','Tanda buku','சேமி','收藏'],
 ['Unsave','Buang daripada simpanan','சேமிப்பிலிருந்து நீக்கு','取消收藏'],
 ['Quick apply','Mohon segera','விரைவாக விண்ணப்பி','快速申请'],
 ['Application submitted','Permohonan dihantar','விண்ணப்பம் சமர்ப்பிக்கப்பட்டது','申请已提交'],
 ['Resume interview','Sambung temu duga','நேர்காணலைத் தொடரவும்','继续面试'],
 ['New interview','Temu duga baharu','புதிய நேர்காணல்','新面试'],
 ['Interview history','Sejarah temu duga','நேர்காணல் வரலாறு','面试历史'],
 ['Interview complete','Temu duga selesai','நேர்காணல் முடிந்தது','面试已完成'],
 ['Question','Soalan','கேள்வி','问题'],
 ['Questions','Soalan','கேள்விகள்','问题'],
 ['Your answer','Jawapan anda','உங்கள் பதில்','您的回答'],
 ['Answer','Jawapan','பதில்','回答'],
 ['Listening','Sedang mendengar','கேட்கிறது','正在聆听'],
 ['Use microphone','Gunakan mikrofon','ஒலிவாங்கியைப் பயன்படுத்தவும்','使用麦克风'],
 ['Stop listening','Hentikan pendengaran','கேட்பதை நிறுத்து','停止聆听'],
 ['Play question','Mainkan soalan','கேள்வியைக் கேளுங்கள்','播放问题'],
 ['Need a hint?','Perlu petunjuk?','குறிப்பு வேண்டுமா?','需要提示吗？'],
 ['Hide coaching tip','Sembunyikan petua','பயிற்சி குறிப்பை மறை','隐藏提示'],
 ['Submit answer','Hantar jawapan','பதிலைச் சமர்ப்பி','提交回答'],
 ['Finish & review','Tamatkan & semak','முடித்து மதிப்பாய்வு செய்','结束并查看反馈'],
 ['Reviewing…','Sedang menyemak…','மதிப்பாய்வு செய்யப்படுகிறது…','正在评估…'],
 ['Session paused','Sesi dijeda','அமர்வு இடைநிறுத்தப்பட்டது','练习已暂停'],
 ['Mira is speaking','Mira sedang bercakap','Mira பேசுகிறார்','Mira 正在讲话'],
 ['Ready for your response','Sedia menerima jawapan anda','உங்கள் பதிலுக்குத் தயார்','等待您的回答'],
 ['Listening to your answer','Sedang mendengar jawapan anda','உங்கள் பதிலைக் கேட்கிறது','正在聆听您的回答'],
 ['Voice speed','Kelajuan suara','குரல் வேகம்','语速'],
 ['Questions completed','Soalan selesai','முடித்த கேள்விகள்','已完成问题'],
 ['Practice time','Masa latihan','பயிற்சி நேரம்','练习时长'],
 ['Your practice snapshot','Ringkasan latihan anda','உங்கள் பயிற்சி சுருக்கம்','练习概况'],
 ['Clear answer','Kosongkan jawapan','பதிலை அழி','清空回答'],
 ['Report','Laporan','அறிக்கை','报告'],
 ['Delete post','Padam siaran','பதிவை நீக்கு','删除帖子'],
 ['Delete your post','Padam siaran anda','உங்கள் பதிவை நீக்கு','删除您的帖子'],
];

export type Translations = Record<Exclude<Locale,'en'>,Record<string,string>>;
const byLocale: Translations={ms:{},ta:{},zh:{},my:{...BURMESE_ENTRIES}};
for (const [english,ms,ta,zh] of [...entries,...EXTENDED_ENTRIES,...CAREER_ENTRIES,...WORKFLOW_ENTRIES,...INSIGHTS_STUDIO_ENTRIES,...TALENT_NETWORK_ENTRIES,...CANDIDATE_PAGE_ENTRIES,...ACCELERATOR_ENTRIES,...CAREER_WORLD_ENTRIES,...JOB_HUNT_ENTRIES]){byLocale.ms[english]=ms;byLocale.ta[english]=ta;byLocale.zh[english]=zh}

for(const [english,ms,ta,zh,my] of FOCUSED_ENTRIES){byLocale.ms[english]=ms;byLocale.ta[english]=ta;byLocale.zh[english]=zh;byLocale.my[english]=my}

// Preserve surrounding whitespace and terminal punctuation when a dictionary phrase is embedded in a text node.
export function lookupTranslation(input:string, locale:Locale):string|null {
 if(locale==='en')return input;
 const original=input.trim();if(!original)return input;
 const dictionary=byLocale[locale];
 let translated=dictionary[original];
 if(!translated){
  const punctuation=original.match(/^(.+?)([.!?:]+)$/);
  if(punctuation){const core=dictionary[punctuation[1].trim()];if(core)translated=core+punctuation[2]}
 }
 if(!translated)return lookupInterpolated(input,locale);
 const start=input.match(/^\s*/)?.[0]||'';const end=input.match(/\s*$/)?.[0]||'';
 return start+translated+end;
}
export function curatedPhraseCount(){return Object.keys(byLocale.ms).length}

/** Dynamic counters remain translated while numeric values and app state stay unchanged. */
const numberFormats: Array<[RegExp,Record<'ms'|'ta'|'zh'|'my',(items:string[])=>string>]> = [
 [/^Page (\d+) of (\d+)$/i, {
  ms: ([a,b])=>`Halaman ${a} daripada ${b}`,ta: ([a,b])=>`பக்கம் ${a} / ${b}`,zh: ([a,b])=>`第 ${a} 页，共 ${b} 页`,my:([a,b])=>`စာမျက်နှာ ${a} / ${b}`}],
 [/^(\d+) positions match your search$/i,{
  ms:([n])=>`${n} jawatan sepadan dengan carian anda`,ta:([n])=>`உங்கள் தேடலுக்கு ${n} பணியிடங்கள் பொருந்துகின்றன`,zh:([n])=>`${n} 个职位符合您的搜索条件`,my:([n])=>`သင့်ရှာဖွေမှုနှင့် ကိုက်ညီသော အလုပ် ${n} ခု`}],
 [/^(\d+) (companies|positions|industries|jobs|candidates|applications|questions|posts|comments)$/i,{
  ms:([n,label])=>`${n} ${({companies:'syarikat',positions:'jawatan',industries:'industri',jobs:'pekerjaan',candidates:'calon',applications:'permohonan',questions:'soalan',posts:'siaran',comments:'komen'} as Record<string,string>)[label.toLowerCase()]}`,
  ta:([n,label])=>`${n} ${({companies:'நிறுவனங்கள்',positions:'பணியிடங்கள்',industries:'துறைகள்',jobs:'வேலைகள்',candidates:'வேட்பாளர்கள்',applications:'விண்ணப்பங்கள்',questions:'கேள்விகள்',posts:'பதிவுகள்',comments:'கருத்துகள்'} as Record<string,string>)[label.toLowerCase()]}`,
  zh:([n,label])=>`${n} ${({companies:'家公司',positions:'个职位',industries:'个行业',jobs:'个工作',candidates:'位候选人',applications:'份申请',questions:'道问题',posts:'条动态',comments:'条评论'} as Record<string,string>)[label.toLowerCase()]}`,
  my:([n,label])=>`${n} ${({companies:'ကုမ္ပဏီ',positions:'ရာထူး',industries:'လုပ်ငန်းကဏ္ဍ',jobs:'အလုပ်',candidates:'လျှောက်ထားသူ',applications:'လျှောက်လွှာ',questions:'မေးခွန်း',posts:'ပို့စ်',comments:'မှတ်ချက်'} as Record<string,string>)[label.toLowerCase()]}`
 }]
];
export function lookupInterpolated(input:string,locale:Locale):string|null{
 if(locale==='en')return input;
 const trim=input.trim();
 // Dynamic labels keep the variable unchanged (names and slide titles are not uploaded).
 const dynamicFormats: Array<[RegExp,Record<'ms'|'ta'|'zh'|'my',(parts:string[])=>string>]>=[
  [/^Message (.+?)…$/,{
   ms:([person])=>`Mesej kepada ${person}…`,ta:([person])=>`${person}-க்கு செய்தி…`,zh:([person])=>`给 ${person} 发消息…`,my:([person])=>`${person} ထံ မက်ဆေ့ချ်ပို့ရန်…`}],
  [/^Follow (.+)$/,{
   ms:([person])=>`Ikuti ${person}`,ta:([person])=>`${person}-ஐப் பின்தொடரவும்`,zh:([person])=>`关注 ${person}`,my:([person])=>`${person} ကို စောင့်ကြည့်ရန်`}],
  [/^Delete interview for (.+)$/,{
   ms:([role])=>`Padam temu duga untuk ${role}`,ta:([role])=>`${role} நேர்காணலை நீக்கவும்`,zh:([role])=>`删除 ${role} 的面试`,my:([role])=>`${role} အင်တာဗျူးကို ဖျက်ရန်`}],
  [/^Go to slide (\d+)$/i,{
   ms:([n])=>`Pergi ke slaid ${n}`,ta:([n])=>`ஸ்லைடு ${n}-க்குச் செல்`,zh:([n])=>`跳到第 ${n} 张幻灯片`,my:([n])=>`ဆလိုက် ${n} သို့ သွားရန်`}],
  [/^PDF slide (\d+)$/i,{
   ms:([n])=>`Slaid PDF ${n}`,ta:([n])=>`PDF ஸ்லைடு ${n}`,zh:([n])=>`PDF 第 ${n} 张幻灯片`,my:([n])=>`PDF ဆလိုက် ${n}`}],
  [/^Slide (\d+): (.+)$/i,{
   ms:([n,title])=>`Slaid ${n}: ${title}`,ta:([n,title])=>`ஸ்லைடு ${n}: ${title}`,zh:([n,title])=>`第 ${n} 张幻灯片：${title}`,my:([n,title])=>`ဆလိုက် ${n} - ${title}`}],
  [/^View (.+?) at (.+)$/i,{
   ms:([role,company])=>`Lihat ${role} di ${company}`,ta:([role,company])=>`${company} நிறுவனத்தில் ${role} பணியைப் பார்க்கவும்`,zh:([role,company])=>`查看 ${company} 的 ${role} 职位`,my:([role,company])=>`${company} တွင် ${role} အလုပ်ကို ကြည့်ရန်`}],
 ];
 for(const [pattern,translations] of dynamicFormats){const match=pattern.exec(trim);if(match){const start=input.match(/^\s*/)?.[0]||'';const end=input.match(/\s*$/)?.[0]||'';return start+translations[locale](match.slice(1))+end}}
 for(const [pattern,translations] of numberFormats){const match=pattern.exec(trim);if(match){const start=input.match(/^\s*/)?.[0]||'';const end=input.match(/\s*$/)?.[0]||'';return start+translations[locale](match.slice(1))+end}}
 return null;
}
export function formatLocalizedDate(input:string|Date,locale:Locale,options:Intl.DateTimeFormatOptions={dateStyle:'medium'}):string{
 const date=input instanceof Date?input:new Date(input);
 if(Number.isNaN(date.getTime()))return String(input);
 const resolved={en:'en-MY',ms:'ms-MY',ta:'ta-MY',zh:'zh-CN',my:'my-MM'}[locale];
 return new Intl.DateTimeFormat(resolved,options).format(date);
}
export function formatLocalizedNumber(value:number,locale:Locale):string{
 return new Intl.NumberFormat({en:'en-MY',ms:'ms-MY',ta:'ta-MY',zh:'zh-CN',my:'my-MM'}[locale]).format(value);
}

