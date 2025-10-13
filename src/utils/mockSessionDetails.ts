/**
 * Mock Session Details Data
 *
 * Detailed session information including full transcripts, participants, and metrics
 */

export interface TranscriptLine {
  id: string;
  timestamp: string; // HH:MM:SS format
  speaker_name: string;
  original_language: string;
  original_text: string;
  translations: Record<string, string>; // language code -> translated text
  confidence: number; // 0-1
}

export interface SessionParticipant {
  id: string;
  name: string;
  email?: string;
  joined_at: string;
  left_at?: string;
  duration_minutes: number;
  language_selected: string;
  messages_viewed: number;
}

export interface SessionDetail {
  id: string;
  meeting_title: string;
  host_name: string;
  meeting_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  source_language: string;
  target_languages: string[];
  transcript: TranscriptLine[];
  participants: SessionParticipant[];
  recording_url?: string;
  metrics: {
    total_messages: number;
    avg_confidence: number;
    languages_used: number;
    peak_concurrent_users: number;
  };
}

export const MOCK_SESSION_DETAIL: SessionDetail = {
  id: 'session_001',
  meeting_title: 'Q4 Product Planning Meeting',
  host_name: 'John Doe',
  meeting_date: '2025-10-08',
  start_time: '14:00',
  end_time: '15:30',
  duration_minutes: 90,
  source_language: 'en',
  target_languages: ['es', 'fr', 'de', 'ja'],
  transcript: [
    {
      id: 'tr_001',
      timestamp: '00:00:15',
      speaker_name: 'John Doe',
      original_language: 'en',
      original_text: 'Welcome everyone to today\'s product planning meeting. Let\'s start by reviewing our Q4 roadmap.',
      translations: {
        es: 'Bienvenidos a todos a la reunión de planificación de productos de hoy. Comencemos revisando nuestra hoja de ruta del cuarto trimestre.',
        fr: 'Bienvenue à tous à la réunion de planification des produits d\'aujourd\'hui. Commençons par examiner notre feuille de route du T4.',
        de: 'Willkommen alle zur heutigen Produktplanungsbesprechung. Beginnen wir mit der Überprüfung unserer Q4-Roadmap.',
        ja: '本日の製品計画会議へようこそ。Q4のロードマップを確認することから始めましょう。'
      },
      confidence: 0.98
    },
    {
      id: 'tr_002',
      timestamp: '00:00:42',
      speaker_name: 'Maria Garcia',
      original_language: 'es',
      original_text: '¿Podríamos discutir primero el presupuesto? Tengo algunas preguntas sobre la asignación de recursos.',
      translations: {
        en: 'Could we discuss the budget first? I have some questions about resource allocation.',
        fr: 'Pourrions-nous d\'abord discuter du budget? J\'ai quelques questions sur l\'allocation des ressources.',
        de: 'Könnten wir zuerst über das Budget sprechen? Ich habe einige Fragen zur Ressourcenzuteilung.',
        ja: '最初に予算について話し合えますか？リソース配分についていくつか質問があります。'
      },
      confidence: 0.95
    },
    {
      id: 'tr_003',
      timestamp: '00:01:05',
      speaker_name: 'John Doe',
      original_language: 'en',
      original_text: 'Absolutely, Maria. That\'s a great point. The budget breakdown is on slide 3.',
      translations: {
        es: 'Por supuesto, María. Es un buen punto. El desglose del presupuesto está en la diapositiva 3.',
        fr: 'Absolument, Maria. C\'est un bon point. La répartition du budget est sur la diapositive 3.',
        de: 'Auf jeden Fall, Maria. Das ist ein guter Punkt. Die Budgetaufschlüsselung ist auf Folie 3.',
        ja: 'もちろん、マリア。良いポイントですね。予算の内訳はスライド3にあります。'
      },
      confidence: 0.97
    },
    {
      id: 'tr_004',
      timestamp: '00:01:28',
      speaker_name: 'Pierre Dubois',
      original_language: 'fr',
      original_text: 'Je pense que nous devrions augmenter le budget marketing de 20% pour atteindre nos objectifs de croissance.',
      translations: {
        en: 'I think we should increase the marketing budget by 20% to meet our growth targets.',
        es: 'Creo que deberíamos aumentar el presupuesto de marketing en un 20% para alcanzar nuestros objetivos de crecimiento.',
        de: 'Ich denke, wir sollten das Marketing-Budget um 20% erhöhen, um unsere Wachstumsziele zu erreichen.',
        ja: '成長目標を達成するために、マーケティング予算を20％増やすべきだと思います。'
      },
      confidence: 0.96
    },
    {
      id: 'tr_005',
      timestamp: '00:02:10',
      speaker_name: 'Yuki Tanaka',
      original_language: 'ja',
      original_text: '日本市場では、ローカライゼーションにもっと投資する必要があります。現在のアプローチでは不十分です。',
      translations: {
        en: 'In the Japanese market, we need to invest more in localization. The current approach is insufficient.',
        es: 'En el mercado japonés, necesitamos invertir más en localización. El enfoque actual es insuficiente.',
        fr: 'Sur le marché japonais, nous devons investir davantage dans la localisation. L\'approche actuelle est insuffisante.',
        de: 'Auf dem japanischen Markt müssen wir mehr in die Lokalisierung investieren. Der aktuelle Ansatz ist unzureichend.'
      },
      confidence: 0.94
    },
    {
      id: 'tr_006',
      timestamp: '00:02:45',
      speaker_name: 'John Doe',
      original_language: 'en',
      original_text: 'Excellent feedback, everyone. Let\'s break this down into action items. Maria, can you lead the budget analysis?',
      translations: {
        es: 'Excelente retroalimentación, todos. Dividamos esto en elementos de acción. María, ¿puedes liderar el análisis del presupuesto?',
        fr: 'Excellents retours, tout le monde. Décomposons cela en éléments d\'action. Maria, peux-tu diriger l\'analyse budgétaire?',
        de: 'Ausgezeichnetes Feedback, alle zusammen. Lassen Sie uns dies in Aktionspunkte aufteilen. Maria, kannst du die Budgetanalyse leiten?',
        ja: '素晴らしいフィードバックをありがとうございます。これをアクション項目に分解しましょう。マリア、予算分析をリードしてもらえますか？'
      },
      confidence: 0.98
    },
    {
      id: 'tr_007',
      timestamp: '00:03:12',
      speaker_name: 'Maria Garcia',
      original_language: 'es',
      original_text: 'Sí, puedo tener el análisis listo para el viernes. Necesitaré datos del último trimestre.',
      translations: {
        en: 'Yes, I can have the analysis ready by Friday. I\'ll need data from the last quarter.',
        fr: 'Oui, je peux avoir l\'analyse prête pour vendredi. J\'aurai besoin des données du dernier trimestre.',
        de: 'Ja, ich kann die Analyse bis Freitag fertig haben. Ich brauche Daten aus dem letzten Quartal.',
        ja: 'はい、金曜日までに分析を準備できます。前四半期のデータが必要になります。'
      },
      confidence: 0.96
    },
    {
      id: 'tr_008',
      timestamp: '00:03:40',
      speaker_name: 'John Doe',
      original_language: 'en',
      original_text: 'Perfect. I\'ll send you the Q3 reports this afternoon. Next item on the agenda is feature prioritization.',
      translations: {
        es: 'Perfecto. Te enviaré los informes del tercer trimestre esta tarde. El siguiente punto de la agenda es la priorización de características.',
        fr: 'Parfait. Je vous enverrai les rapports du T3 cet après-midi. Le prochain point à l\'ordre du jour est la priorisation des fonctionnalités.',
        de: 'Perfekt. Ich schicke Ihnen heute Nachmittag die Q3-Berichte. Der nächste Punkt auf der Tagesordnung ist die Funktionspriorisierung.',
        ja: '完璧です。今日の午後、第3四半期のレポートを送ります。次の議題は機能の優先順位付けです。'
      },
      confidence: 0.99
    }
  ],
  participants: [
    {
      id: 'p_001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      joined_at: '14:00',
      left_at: '15:30',
      duration_minutes: 90,
      language_selected: 'en',
      messages_viewed: 8
    },
    {
      id: 'p_002',
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      joined_at: '14:02',
      left_at: '15:30',
      duration_minutes: 88,
      language_selected: 'es',
      messages_viewed: 8
    },
    {
      id: 'p_003',
      name: 'Pierre Dubois',
      email: 'pierre.dubois@example.com',
      joined_at: '14:00',
      left_at: '15:25',
      duration_minutes: 85,
      language_selected: 'fr',
      messages_viewed: 8
    },
    {
      id: 'p_004',
      name: 'Yuki Tanaka',
      email: 'yuki.tanaka@example.com',
      joined_at: '14:05',
      left_at: '15:30',
      duration_minutes: 85,
      language_selected: 'ja',
      messages_viewed: 7
    },
    {
      id: 'p_005',
      name: 'Klaus Schmidt',
      email: 'klaus.schmidt@example.com',
      joined_at: '14:00',
      left_at: '15:15',
      duration_minutes: 75,
      language_selected: 'de',
      messages_viewed: 6
    }
  ],
  recording_url: 'https://example.com/recordings/session_001.mp4', // Mockup URL
  metrics: {
    total_messages: 8,
    avg_confidence: 0.97,
    languages_used: 5,
    peak_concurrent_users: 5
  }
};
