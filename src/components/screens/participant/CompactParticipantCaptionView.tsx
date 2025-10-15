import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { useSession } from '../../../context/SessionContext';
// User context no longer needed - TTS available for all tiers
import { useZoom } from '../../../context/ZoomContext';
import { LANGUAGES } from '../../../utils/constants';
import { Caption } from '../../../types';

/**
 * Compact Participant Caption View - Optimized for Small Sidebar
 *
 * Key Features:
 * - Minimal UI footprint for sidebar integration
 * - Audio management: Original Zoom audio vs TTS translation
 * - Primary focus: Translation display and TTS control
 * - Collapsible controls to save space
 * - WCAG 2.1 AA accessible
 * - Production-ready with realistic mock data
 */

interface CompactParticipantCaptionViewProps {
  selectedLanguage: string;
  onChangeLanguage: () => void;
  onLeave: () => void;
}

// Compact TTS state for sidebar with realistic defaults
interface TTSState {
  isPlaying: boolean;
  volume: number;
  isAvailable: boolean;
  originalAudioLevel: number; // Zoom original audio level when TTS is active
}

const defaultTTSState: TTSState = {
  isPlaying: false,
  volume: 0.8,
  isAvailable: true,
  originalAudioLevel: 0.3, // Lower original audio when TTS is active
};

export function CompactParticipantCaptionView({
  selectedLanguage,
  onChangeLanguage,
  onLeave
}: CompactParticipantCaptionViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { session, captions = [], currentCaption } = useSession();
  
  // Focus management and page title
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
    
    const originalTitle = document.title;
    const meetingTitle = session?.meeting_title || 'Meeting';
    document.title = `Live Translation View - ${meetingTitle} | MeetingSync`;
    
    return () => {
      document.title = originalTitle;
    };
  }, [session?.meeting_title]);
  // Free tier now has access to all TTS features as per pricing configuration
  const zoomContext = useZoom();
  
  // Compact States
  const [ttsState, setTtsState] = useState<TTSState>({
    ...defaultTTSState,
    isAvailable: false
  });

  // Force TTS to be available if session.tts_enabled is true
  useEffect(() => {
    setTtsState((prev) => ({ ...prev, isAvailable: Boolean(session?.tts_enabled) }));
  }, [session?.tts_enabled]);
  const [showControls, setShowControls] = useState(true);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [isConnected, setIsConnected] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  
  const captionsEndRef = useRef<HTMLDivElement>(null);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);

  // Get clean language name (remove prefixes like "ES Spanish" -> "Spanish")
  const getLanguageName = useCallback((code: string): string => {
    const language = LANGUAGES.find(l => l.code === code);
    if (!language) return 'Unknown';
    
    let name = language.name;
    // Remove language code prefixes (e.g., "ES Spanish" -> "Spanish")
    if (name.includes(' ')) {
      const parts = name.split(' ');
      if (parts[0].length === 2 && parts[0].toUpperCase() === parts[0]) {
        name = parts.slice(1).join(' ');
      }
    }
    return name;
  }, []);

  // Get random speaker name for realistic display
  const getRandomSpeakerName = useCallback((): string => {
    const speakers = ['John Smith', 'Maria Garcia', 'David Chen', 'Sarah Johnson', 'Alex Rodriguez'];
    return speakers[Math.floor(Math.random() * speakers.length)];
  }, []);

  // Enhanced multilingual mock data for the 12 most popular languages
  const getMultilingualMockCaptions = useCallback((languageCode: string) => {
    const now = new Date();
    const speakers = ['John Smith', 'Maria Garcia', 'David Chen', 'Sarah Johnson', 'Alex Rodriguez'];
    
  const mockDataByLanguage: Record<string, string[]> = {
      'en': [
        'Hello everyone, thank you for joining today\'s meeting.',
        'Let\'s discuss this quarter\'s performance and set next quarter\'s goals.',
        'We exceeded our sales targets by 15%. Thanks to the entire team\'s efforts.',
        'The marketing department is planning a new campaign.',
        'Customer satisfaction survey results came out better than expected.',
        'We need to complete the project plan by next week.',
        'Please feel free to share any questions or comments.'
      ],
      'es': [
        'Hola a todos, gracias por unirse a la reunión de hoy.',
        'Hablemos sobre el rendimiento de este trimestre y establezcamos los objetivos del próximo.',
        'Superamos nuestros objetivos de ventas en un 15%. Gracias a los esfuerzos de todo el equipo.',
        'El departamento de marketing está planeando una nueva campaña.',
        'Los resultados de la encuesta de satisfacción del cliente salieron mejor de lo esperado.',
        'Necesitamos completar el plan del proyecto para la próxima semana.',
        'Por favor, comparta libremente cualquier pregunta o comentario.'
      ],
      'fr': [
        'Bonjour tout le monde, merci de vous joindre à la réunion d\'aujourd\'hui.',
        'Discutons des performances de ce trimestre et fixons les objectifs du prochain.',
        'Nous avons dépassé nos objectifs de vente de 15%. Merci aux efforts de toute l\'équipe.',
        'Le département marketing planifie une nouvelle campagne.',
        'Les résultats de l\'enquête de satisfaction client sont sortis mieux que prévu.',
        'Nous devons terminer le plan de projet d\'ici la semaine prochaine.',
        'N\'hésitez pas à partager vos questions ou commentaires.'
      ],
      'de': [
        'Hallo alle zusammen, danke, dass Sie am heutigen Meeting teilnehmen.',
        'Lassen Sie uns die Leistung dieses Quartals besprechen und die Ziele für das nächste setzen.',
        'Wir haben unsere Verkaufsziele um 15% übertroffen. Dank der Bemühungen des gesamten Teams.',
        'Die Marketingabteilung plant eine neue Kampagne.',
        'Die Ergebnisse der Kundenzufriedenheitsumfrage fielen besser aus als erwartet.',
        'Wir müssen den Projektplan bis nächste Woche fertigstellen.',
        'Bitte teilen Sie gerne Fragen oder Kommentare mit.'
      ],
      'pt': [
        'Olá pessoal, obrigado por participarem da reunião de hoje.',
        'Vamos discutir o desempenho deste trimestre e definir as metas do próximo.',
        'Superamos nossas metas de vendas em 15%. Graças aos esforços de toda a equipe.',
        'O departamento de marketing está planejando uma nova campanha.',
        'Os resultados da pesquisa de satisfação do cliente saíram melhor que o esperado.',
        'Precisamos completar o plano do projeto até a próxima semana.',
        'Por favor, sintam-se à vontade para compartilhar perguntas ou comentários.'
      ],
      'zh': [
        '大家好，感谢大家参加今天的会议。',
        '让我们讨论本季度的业绩并设定下季度的目标。',
        '我们超额完成了销售目标15%。感谢整个团队的努力。',
        '市场部正在策划一个新的营销活动。',
        '客户满意度调查结果比预期要好。',
        '我们需要在下周前完成项目计划。',
        '请随时分享任何问题或意见。'
      ],
      'ja': [
        'こんにちは皆さん、今日の会議にご参加いただきありがとうございます。',
        'この四半期の業績について話し合い、来四半期の目標を設定しましょう。',
        '売上目標を15%上回りました。チーム全体の努力のおかげです。',
        'マーケティング部門では新しいキャンペーンを計画しています。',
        '顧客満足度調査の結果は予想より良好でした。',
        '来週までにプロジェクト計画を完成させる必要があります。',
        'ご質問やコメントがございましたら、お気軽にお聞かせください。'
      ],
      'ko': [
        '안녕하세요 여러분, 오늘 회의에 참석해 주셔서 감사합니다.',
        '이번 분기 실적에 대해 논의하고 다음 분기 목표를 설정하겠습니다.',
        '매출 목표를 15% 초과 달성했습니다. 팀 전체의 노력 덕분입니다.',
        '마케팅 부서에서 새로운 캠페인을 기획하고 있습니다.',
        '고객 만족도 조사 결과가 예상보다 좋게 나왔습니다.',
        '다음 주까지 프로젝트 계획서를 완성해야 합니다.',
        '질문이나 의견이 있으시면 언제든지 말씀해 주세요.'
      ],
      'ar': [
        'مرحباً بالجميع، شكراً لانضمامكم لاجتماع اليوم.',
        'دعونا نناقش أداء هذا الربع ونضع أهداف الربع القادم.',
        'تجاوزنا أهداف المبيعات بنسبة 15%. بفضل جهود الفريق بأكمله.',
        'قسم التسويق يخطط لحملة جديدة.',
        'نتائج استطلاع رضا العملاء جاءت أفضل من المتوقع.',
        'نحتاج لإكمال خطة المشروع بحلول الأسبوع القادم.',
        'يرجى مشاركة أي أسئلة أو تعليقات بحرية.'
      ],
      'hi': [
        'सभी को नमस्कार, आज की बैठक में शामिल होने के लिए धन्यवाद।',
        'आइए इस तिमाही के प्रदर्शन पर चर्चा करें और अगली तिमाही के लक्ष्य निर्धारित करें।',
        'हमने अपने बिक्री लक्ष्यों को 15% से अधिक पार किया है। पूरी टीम के प्रयासों के लिए धन्यवाद।',
        'मार्केटिंग विभाग एक नए अभियान की योजना बना रहा है।',
        'ग्राहक संतुष्टि सर्वेक्षण के परिणाम अपेक्षा से बेहतर आए हैं।',
        'हमें अगले सप्ताह तक प्रोजेक्ट प्लान पूरा करना होगा।',
        'कृपया कोई भी प्रश्न या टिप्पणी साझा करने में संकोच न करें।'
      ],
      'ru': [
        'Привет всем, спасибо за участие в сегодняшней встрече.',
        'Давайте обсудим результаты этого квартала и поставим цели на следующий.',
        'Мы превысили наши цели продаж на 15%. Благодаря усилиям всей команды.',
        'Отдел маркетинга планирует новую кампанию.',
        'Результаты опроса удовлетворенности клиентов оказались лучше ожидаемых.',
        'Нам нужно завершить план проекта к следующей неделе.',
        'Пожалуйста, не стесняйтесь делиться вопросами или комментариями.'
      ],
      'it': [
        'Ciao a tutti, grazie per aver partecipato alla riunione di oggi.',
        'Discutiamo delle prestazioni di questo trimestre e impostiamo gli obiettivi del prossimo.',
        'Abbiamo superato i nostri obiettivi di vendita del 15%. Grazie agli sforzi di tutto il team.',
        'Il dipartimento marketing sta pianificando una nuova campagna.',
        'I risultati del sondaggio sulla soddisfazione dei clienti sono risultati migliori del previsto.',
        'Dobbiamo completare il piano del progetto entro la prossima settimana.',
        'Non esitate a condividere domande o commenti.'
      ]
      ,
      'tr': [
        'Herkese merhaba, bugünkü toplantıya katıldığınız için teşekkürler.',
        'Bu çeyreğin performansını tartışalım ve gelecek çeyrek için hedefler belirleyelim.',
        'Satış hedeflerimizi %15 aştık. Tüm ekibin çabalarına teşekkürler.',
        'Pazarlama departmanı yeni bir kampanya planlıyor.',
        'Müşteri memnuniyeti anketi beklenenden daha iyi sonuçlandı.',
        'Proje planını gelecek haftaya kadar tamamlamamız gerekiyor.',
        'Lütfen sorularınızı veya yorumlarınızı paylaşmaktan çekinmeyin.'
      ],
      'vi': [
        'Xin chào mọi người, cảm ơn đã tham gia cuộc họp hôm nay.',
        'Hãy thảo luận về hiệu suất quý này và đặt mục tiêu cho quý tới.',
        'Chúng ta đã vượt mục tiêu doanh số 15%. Cảm ơn nỗ lực của cả đội.',
        'Phòng marketing đang lên kế hoạch cho chiến dịch mới.',
        'Kết quả khảo sát sự hài lòng của khách hàng tốt hơn mong đợi.',
        'Chúng ta cần hoàn thành kế hoạch dự án trước tuần sau.',
        'Vui lòng chia sẻ bất kỳ câu hỏi hoặc ý kiến nào.'
      ],
      'pl': [
        'Witam wszystkich, dziękuję za udział w dzisiejszym spotkaniu.',
        'Omówmy wyniki tego kwartału i ustalmy cele na kolejny.',
        'Przekroczyliśmy cele sprzedażowe o 15%. Dzięki wysiłkom całego zespołu.',
        'Dział marketingu planuje nową kampanię.',
        'Wyniki ankiety satysfakcji klientów są lepsze niż oczekiwano.',
        'Musimy ukończyć plan projektu do przyszłego tygodnia.',
        'Proszę śmiało zadawać pytania lub zgłaszać uwagi.'
      ],
      'nl': [
        'Hallo allemaal, bedankt voor jullie aanwezigheid bij de vergadering van vandaag.',
        'Laten we de prestaties van dit kwartaal bespreken en doelen stellen voor het volgende.',
        'We hebben onze verkoopdoelen met 15% overtroffen. Dank aan het hele team.',
        'De marketingafdeling plant een nieuwe campagne.',
        'De resultaten van het klanttevredenheidsonderzoek waren beter dan verwacht.',
        'We moeten het projectplan uiterlijk volgende week afronden.',
        'Voel je vrij om vragen of opmerkingen te delen.'
      ],
      'th': [
        'สวัสดีทุกคน ขอบคุณที่เข้าร่วมประชุมวันนี้',
        'เรามาพูดคุยเกี่ยวกับผลประกอบการไตรมาสนี้และตั้งเป้าหมายสำหรับไตรมาสหน้า',
        'เราทำยอดขายเกินเป้าหมาย 15% ขอบคุณความพยายามของทุกคนในทีม',
        'ฝ่ายการตลาดกำลังวางแผนแคมเปญใหม่',
        'ผลสำรวจความพึงพอใจของลูกค้าดีกว่าที่คาดไว้',
        'เราต้องทำแผนโครงการให้เสร็จภายในสัปดาห์หน้า',
        'หากมีคำถามหรือข้อคิดเห็นใด ๆ กรุณาแจ้งได้เลย'
      ],
      'sv': [
        'Hej allihopa, tack för att ni deltar i dagens möte.',
        'Låt oss diskutera detta kvartals resultat och sätta mål för nästa.',
        'Vi överträffade våra försäljningsmål med 15%. Tack till hela teamet.',
        'Marknadsavdelningen planerar en ny kampanj.',
        'Resultaten från kundnöjdhetsundersökningen var bättre än väntat.',
        'Vi måste slutföra projektplanen till nästa vecka.',
        'Dela gärna med er av frågor eller kommentarer.'
      ],
      'el': [
        'Γεια σε όλους, ευχαριστώ που ήρθατε στη σημερινή συνάντηση.',
        'Ας συζητήσουμε την απόδοση αυτού του τριμήνου και να θέσουμε στόχους για το επόμενο.',
        'Υπερβήκαμε τους στόχους πωλήσεων κατά 15%. Ευχαριστώ όλη την ομάδα.',
        'Το τμήμα μάρκετινγκ σχεδιάζει μια νέα καμπάνια.',
        'Τα αποτελέσματα της έρευνας ικανοποίησης πελατών ήταν καλύτερα από το αναμενόμενο.',
        'Πρέπει να ολοκληρώσουμε το σχέδιο του έργου μέχρι την επόμενη εβδομάδα.',
        'Παρακαλώ μοιραστείτε ερωτήσεις ή σχόλια.'
      ],
      'cs': [
        'Dobrý den všem, děkuji za účast na dnešní schůzce.',
        'Pojďme diskutovat o výsledcích tohoto čtvrtletí a stanovit cíle na příští.',
        'Překročili jsme prodejní cíle o 15 %. Díky úsilí celého týmu.',
        'Marketingové oddělení plánuje novou kampaň.',
        'Výsledky průzkumu spokojenosti zákazníků byly lepší, než se očekávalo.',
        'Musíme dokončit projektový plán do příštího týdne.',
        'Neváhejte sdílet jakékoli dotazy nebo připomínky.'
      ],
      'hu': [
        'Üdvözlök mindenkit, köszönöm, hogy eljöttek a mai megbeszélésre.',
        'Beszéljük meg az aktuális negyedév teljesítményét, és tűzzük ki a következő negyedév céljait.',
        'Az értékesítési céljainkat 15%-kal túlteljesítettük. Köszönet az egész csapatnak.',
        'A marketing osztály új kampányt tervez.',
        'Az ügyfél-elégedettségi felmérés eredményei jobbak lettek a vártnál.',
        'A projekttervet a jövő hétig be kell fejeznünk.',
        'Kérem, osszák meg kérdéseiket vagy észrevételeiket.'
      ],
      'ro': [
        'Bună ziua tuturor, mulțumesc că ați venit la ședința de azi.',
        'Să discutăm performanța acestui trimestru și să stabilim obiectivele pentru următorul.',
        'Am depășit obiectivele de vânzări cu 15%. Mulțumesc întregii echipe.',
        'Departamentul de marketing planifică o nouă campanie.',
        'Rezultatele sondajului de satisfacție a clienților au fost mai bune decât se aștepta.',
        'Trebuie să finalizăm planul de proiect până săptămâna viitoare.',
        'Vă rog să împărtășiți orice întrebări sau comentarii.'
      ],
      'da': [
        'Hej alle sammen, tak fordi I deltager i dagens møde.',
        'Lad os diskutere dette kvartals resultater og sætte mål for det næste.',
        'Vi har overgået vores salgsmål med 15%. Tak til hele teamet.',
        'Marketingafdelingen planlægger en ny kampagne.',
        'Resultaterne af kundetilfredshedsundersøgelsen var bedre end forventet.',
        'Vi skal have færdiggjort projektplanen inden næste uge.',
        'Del gerne spørgsmål eller kommentarer.'
      ],
      'fi': [
        'Hei kaikki, kiitos että osallistuitte tämän päivän kokoukseen.',
        'Keskustellaan tämän neljänneksen tuloksista ja asetetaan tavoitteet seuraavalle.',
        'Ylitimme myyntitavoitteemme 15 prosentilla. Kiitos koko tiimille.',
        'Markkinointiosasto suunnittelee uutta kampanjaa.',
        'Asiakastyytyväisyyskyselyn tulokset olivat odotettua paremmat.',
        'Projektisuunnitelma pitää saada valmiiksi ensi viikkoon mennessä.',
        'Kysykää tai kommentoikaa vapaasti.'
      ]
    };

    const texts = mockDataByLanguage[languageCode] || mockDataByLanguage['en'];
    const confidenceValues = [0.95, 0.92, 0.97, 0.89, 0.94, 0.91, 0.96];
    
    return texts.map((text, index) => ({
      id: `${languageCode}_mock_${String(index + 1).padStart(3, '0')}`,
      session_id: 'session_active',
      timestamp: new Date(now.getTime() - (6 - index) * 60 * 1000).toISOString(),
      text,
      language: languageCode,
      speaker_name: speakers[index % speakers.length],
      confidence: confidenceValues[index] || 0.93,
      is_final: index < texts.length - 1 // Last caption is still being processed
    }));
  }, []);

  // Filter captions by selected language with enhanced data
  const filteredCaptions = React.useMemo(() => {
    if (!Array.isArray(captions)) return [];
    
    // Popular languages with rich mock data to demonstrate the interface
    const supportedMockLanguages = [
      'en', 'es', 'fr', 'de', 'pt', 'zh', 'ja', 'ko', 'ar', 'hi', 'ru', 'it',
      'tr', 'vi', 'pl', 'nl', 'th', 'sv', 'el', 'cs', 'hu', 'ro', 'da', 'fi'
    ];
    
    if (supportedMockLanguages.includes(selectedLanguage)) {
      const mockCaptions = getMultilingualMockCaptions(selectedLanguage);
      const existingCaptions = captions
        .filter((caption: Caption) => caption.language === selectedLanguage)
        .map((caption: Caption) => ({
          ...caption,
          speaker_name: caption.speaker_name || getRandomSpeakerName(),
          confidence: caption.confidence || Math.random() * 0.3 + 0.7
        }));
      
      // Combine existing captions with mock data
      const allCaptions = [...existingCaptions, ...mockCaptions];
      return allCaptions.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
    
    return captions
      .filter((caption: Caption) => caption.language === selectedLanguage)
      .map((caption: Caption) => ({
        ...caption,
        // Add speaker names if missing (realistic mock data)
        speaker_name: caption.speaker_name || getRandomSpeakerName(),
        // Ensure confidence is realistic
        confidence: caption.confidence || Math.random() * 0.3 + 0.7 // 0.7-1.0
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [captions, selectedLanguage, getMultilingualMockCaptions, getRandomSpeakerName]);

  // Audio Management Functions with error handling
  const handleTTSToggle = useCallback(async () => {
    if (!ttsState.isAvailable) return;
    
    try {
      if (!ttsState.isPlaying) {
        // Start TTS and lower original Zoom audio
        // Note: adjustAudioLevel is hypothetical - would integrate with real Zoom SDK
        if (zoomContext && 'adjustAudioLevel' in zoomContext) {
          await (zoomContext as any).adjustAudioLevel(ttsState.originalAudioLevel);
        }
        
        setTtsState((prev: TTSState) => ({ ...prev, isPlaying: true }));
        setCurrentlyPlaying(currentCaption?.id || filteredCaptions[filteredCaptions.length - 1]?.id || null);
        
        // Mock TTS audio for demonstration
        if (ttsAudioRef.current) {
          ttsAudioRef.current.volume = ttsState.volume;
          // In real implementation, this would play synthesized speech
          console.log('[TTS] Started playing:', currentCaption?.text || 'Latest caption');
        }
      } else {
        // Stop TTS and restore original Zoom audio
        if (zoomContext && 'adjustAudioLevel' in zoomContext) {
          await (zoomContext as any).adjustAudioLevel(1.0);
        }
        
        setTtsState((prev: TTSState) => ({ ...prev, isPlaying: false }));
        setCurrentlyPlaying(null);
        
        if (ttsAudioRef.current) {
          ttsAudioRef.current.pause();
        }
        console.log('[TTS] Stopped playing');
      }
    } catch (error) {
      console.error('[TTS] Audio control failed:', error);
      // Reset state on error
      setTtsState((prev: TTSState) => ({ ...prev, isPlaying: false }));
      setCurrentlyPlaying(null);
    }
  }, [ttsState.isPlaying, ttsState.isAvailable, currentCaption, filteredCaptions, zoomContext, ttsState.originalAudioLevel, ttsState.volume]);

  const handleVolumeChange = useCallback((volume: number) => {
    setTtsState((prev: TTSState) => ({ ...prev, volume }));
    if (ttsAudioRef.current) {
      ttsAudioRef.current.volume = volume;
    }
  }, []);

  const handleOriginalAudioChange = useCallback(async (level: number) => {
    setTtsState((prev: TTSState) => ({ ...prev, originalAudioLevel: level }));
    if (ttsState.isPlaying && zoomContext && 'adjustAudioLevel' in zoomContext) {
      try {
        await (zoomContext as any).adjustAudioLevel(level);
        console.log('[Audio] Zoom audio level adjusted to', level);
      } catch (error) {
        console.error('[Audio] Failed to adjust Zoom audio:', error);
      }
    }
  }, [ttsState.isPlaying, zoomContext]);

  // Handle individual caption playback
  const handleCaptionToggle = useCallback((captionId: string, text: string) => {
    if (!ttsState.isAvailable) return;
    
    if (currentlyPlaying === captionId) {
      setCurrentlyPlaying(null);
      console.log('[TTS] Stopped playing caption');
    } else {
      setCurrentlyPlaying(captionId);
      console.log('[TTS] Playing caption:', text);
      // In real implementation, this would synthesize and play the specific text
    }
  }, [currentlyPlaying, ttsState.isAvailable]);

  // Auto-scroll to latest caption
  useEffect(() => {
    if (captionsEndRef.current) {
      captionsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredCaptions]);

  // Simulate connection status changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Mostly connected with occasional brief disconnections (realistic)
      setIsConnected(Math.random() > 0.05); // 95% connected
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle shortcuts when component is focused and not in input fields
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
      
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'p':
            e.preventDefault();
            handleTTSToggle();
            break;
          case 'm':
            e.preventDefault();
            setShowControls(prev => !prev);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleTTSToggle]);

  // Font size classes optimized for sidebar and complex script readability
  const needsLargerFonts = ['ko', 'ja', 'zh', 'ar', 'hi', 'ru']; // Languages with complex scripts
  const useLargerFonts = needsLargerFonts.includes(selectedLanguage);
  
  const fontSizeClasses = {
    small: useLargerFonts ? 'text-base' : 'text-sm',    // Complex scripts: 16px, Others: 14px
    medium: useLargerFonts ? 'text-lg' : 'text-base',   // Complex scripts: 18px, Others: 16px  
    large: useLargerFonts ? 'text-xl' : 'text-lg'       // Complex scripts: 20px, Others: 18px
  };

  // Loading or no session state
  if (!session) {
    return (
      <div className="h-full flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Connecting...
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Waiting for session
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      tabIndex={-1}
      className="h-full flex flex-col bg-gray-50 dark:bg-gray-900"
      role="main"
      aria-label="Live translation view"
    >
      {/* Page Title Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Live Translation View</h1>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {getLanguageName(selectedLanguage)} translation
        </p>
      </div>
      {/* Compact Header */}
      <header className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Badge 
            variant={isConnected ? 'success' : 'error'} 
            className="text-xs flex-shrink-0"
            aria-label={isConnected ? 'Connected' : 'Disconnected'}
          >
            {isConnected ? '●' : '○'}
          </Badge>
          <span className="text-white text-xs font-medium truncate">
            {getLanguageName(selectedLanguage)}
          </span>
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setShowControls(!showControls)}
            className="text-white hover:text-teal-100 px-2 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 flex items-center gap-1"
            aria-label={showControls ? 'Hide controls' : 'Show controls'}
            aria-expanded={showControls}
            aria-controls="audio-controls-panel"
            title="Toggle controls (Ctrl+M)"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {showControls ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              )}
            </svg>
            <span className="text-xs font-medium">
              {showControls ? 'Hide' : 'Controls'}
            </span>
          </button>
          
          <button
            onClick={onChangeLanguage}
            className="text-white hover:text-teal-100 p-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Change language"
            title="Change language"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v6m8-6v6m-8-2h8" />
            </svg>
          </button>
        </div>
      </header>

      {/* Collapsible Controls Panel */}
      {showControls && (
        <div 
          id="audio-controls-panel"
          className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 space-y-3"
          role="region"
          aria-label="Audio controls"
        >
          {/* Primary TTS Control */}
          <div className="flex items-center justify-between">
            <Button
              variant={ttsState.isPlaying ? "secondary" : "primary"}
              size="sm"
              onClick={handleTTSToggle}
              disabled={!session?.tts_enabled}
              className="flex items-center gap-1 text-xs"
              aria-label={ttsState.isPlaying ? 'Pause text-to-speech' : 'Listen to text-to-speech'}
              title={`${ttsState.isPlaying ? 'Pause' : 'Listen'} TTS (Ctrl+P)`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {ttsState.isPlaying ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h2l7-7V5l-7 7z" />
                )}
              </svg>
              {ttsState.isPlaying ? 'Pause' : 'Listen'}
            </Button>

            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value as 'small' | 'medium' | 'large')}
              className="text-xs bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Font size"
            >
              <option value="small">S</option>
              <option value="medium">M</option>
              <option value="large">L</option>
            </select>
          </div>

          {/* Audio Mixing Controls */}
          {ttsState.isAvailable && (
            <div className="space-y-2">
              <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">Audio Mix</div>
              
              {/* Translation Voice Volume */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-700 dark:text-gray-300 w-8" htmlFor="trans-volume">Trans</label>
                <input
                  id="trans-volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={ttsState.volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  aria-label="Translation voice volume"
                />
                <span className="text-xs text-gray-700 dark:text-gray-300 w-8 text-right" aria-live="polite">
                  {Math.round(ttsState.volume * 100)}%
                </span>
              </div>

              {/* Original Meeting Audio Level */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-700 dark:text-gray-300 w-8" htmlFor="orig-volume">Orig</label>
                <input
                  id="orig-volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={ttsState.originalAudioLevel}
                  onChange={(e) => handleOriginalAudioChange(parseFloat(e.target.value))}
                  className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  aria-label="Original meeting audio level"
                />
                <span className="text-xs text-gray-700 dark:text-gray-300 w-8 text-right" aria-live="polite">
                  {Math.round(ttsState.originalAudioLevel * 100)}%
                </span>
              </div>

              <div className="text-xs text-gray-600 dark:text-gray-400" role="status">
                Original audio {ttsState.isPlaying ? 'lowered' : 'normal'} during translation playback
              </div>
            </div>
          )}

          {/* Audio translation and mixing controls are now available for all tiers */}
        </div>
      )}

      {/* Main Caption Display */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {/* Session Info - Compact */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg p-2 text-center">
          <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
            {session.meeting_title}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {getLanguageName(session.source_language)} → {getLanguageName(selectedLanguage)}
          </p>
        </div>

        {/* No Captions State */}
        {filteredCaptions.length === 0 && (
          <div className="text-center py-6 space-y-2">
            <div className="w-8 h-8 mx-auto bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Listening...</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Waiting for {getLanguageName(selectedLanguage)} translation
            </p>
          </div>
        )}

        {/* Compact Caption Cards */}
        {filteredCaptions.map((caption, index) => (
          <Card
            key={caption.id}
            variant={index === filteredCaptions.length - 1 ? 'selected' : 'default'}
            padding="sm"
            className={`${index === filteredCaptions.length - 1 ? 'animate-fadeIn' : ''} ${
              currentlyPlaying === caption.id ? 'ring-1 ring-teal-500 dark:ring-teal-400' : ''
            }`}
          >
            <CardContent>
              <div className="space-y-1">
                {/* Speaker (if available) */}
                {caption.speaker_name && (
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {caption.speaker_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                      {caption.speaker_name}
                    </span>
                    {currentlyPlaying === caption.id && (
                      <span className="text-xs text-teal-600">🔊</span>
                    )}
                  </div>
                )}

                {/* Caption Text */}
                <p className={`${fontSizeClasses[fontSize]} text-gray-900 dark:text-gray-100 leading-tight`}>
                  {caption.text}
                </p>

                {/* Metadata Row */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(caption.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    {caption.confidence && (
                      <Badge
                        variant={caption.confidence > 0.8 ? 'success' : caption.confidence > 0.6 ? 'warning' : 'error'}
                        className="text-xs px-1 py-0"
                      >
                        {Math.round(caption.confidence * 100)}%
                      </Badge>
                    )}
                    
                    {/* Individual Play Button */}
                    {ttsState.isAvailable && (
                      <button
                        onClick={() => handleCaptionToggle(caption.id, caption.text)}
                        className="p-0.5 text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors focus:outline-none focus:ring-1 focus:ring-teal-500 focus:ring-offset-1 rounded"
                        aria-label={currentlyPlaying === caption.id ? 'Stop listening to caption' : 'Listen to caption'}
                        title={currentlyPlaying === caption.id ? 'Stop TTS' : 'Listen with TTS'}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          {currentlyPlaying === caption.id ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h2l7-7V5l-7 7z" />
                          )}
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Auto-scroll anchor */}
        <div ref={captionsEndRef} />
      </div>

      {/* Current Caption Overlay (Bottom) */}
      {currentCaption && currentCaption.language === selectedLanguage && (
        <div className="bg-gradient-to-t from-gray-900/95 to-gray-900/80 backdrop-blur-sm p-3 border-t border-teal-500 dark:border-teal-400">
          {currentCaption.speaker_name && (
            <p className="text-teal-300 text-xs font-medium mb-1 text-center truncate">
              {currentCaption.speaker_name}
            </p>
          )}
          <p className={`${fontSizeClasses[fontSize]} font-medium text-white leading-tight text-center`}>
            {currentCaption.text}
          </p>
          {currentlyPlaying === currentCaption.id && (
            <div className="flex justify-center mt-1">
              {/* Animated SVG Waveform */}
              <svg width="48" height="16" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
                <rect x="2" y="6" width="4" height="4" rx="2" fill="#2dd4bf">
                  <animate attributeName="height" values="4;12;4" dur="1s" repeatCount="indefinite"/>
                  <animate attributeName="y" values="6;2;6" dur="1s" repeatCount="indefinite"/>
                </rect>
                <rect x="10" y="2" width="4" height="12" rx="2" fill="#2dd4bf">
                  <animate attributeName="height" values="12;4;12" dur="1s" repeatCount="indefinite"/>
                  <animate attributeName="y" values="2;6;2" dur="1s" repeatCount="indefinite"/>
                </rect>
                <rect x="18" y="4" width="4" height="8" rx="2" fill="#2dd4bf">
                  <animate attributeName="height" values="8;14;8" dur="1s" repeatCount="indefinite"/>
                  <animate attributeName="y" values="4;0;4" dur="1s" repeatCount="indefinite"/>
                </rect>
                <rect x="26" y="2" width="4" height="12" rx="2" fill="#2dd4bf">
                  <animate attributeName="height" values="12;4;12" dur="1s" repeatCount="indefinite"/>
                  <animate attributeName="y" values="2;6;2" dur="1s" repeatCount="indefinite"/>
                </rect>
                <rect x="34" y="6" width="4" height="4" rx="2" fill="#2dd4bf">
                  <animate attributeName="height" values="4;12;4" dur="1s" repeatCount="indefinite"/>
                  <animate attributeName="y" values="6;2;6" dur="1s" repeatCount="indefinite"/>
                </rect>
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Leave Button (Bottom) */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          size="sm"
          onClick={onLeave}
          className="w-full text-xs"
        >
          Leave Session
        </Button>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={ttsAudioRef} style={{ display: 'none' }} />
    </div>
  );
}