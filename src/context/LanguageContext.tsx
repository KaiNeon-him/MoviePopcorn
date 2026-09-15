import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';

export interface Translations {
  // Navigation
  home: string;
  movies: string;
  tvShows: string;
  trending: string;
  watchlist: string;
  search: string;
  
  // Common
  signIn: string;
  signUp: string;
  signOut: string;
  profile: string;
  settings: string;
  watchHistory: string;
  
  // Actions
  watchNow: string;
  moreInfo: string;
  addToWatchlist: string;
  removeFromWatchlist: string;
  inWatchlist: string;
  back: string;
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  clear: string;
  
  // Content
  popular: string;
  topRated: string;
  nowPlaying: string;
  upcoming: string;
  continueWatching: string;
  
  // Player
  areYouStillWatching: string;
  yesContinue: string;
  stopPlaying: string;
  skipIntro: string;
  skipOutro: string;
  
  // Settings
  appearance: string;
  playback: string;
  audioSubtitles: string;
  notifications: string;
  parentalControls: string;
  dataUsage: string;
  account: string;
  theme: string;
  dark: string;
  light: string;
  language: string;
  
  // Messages
  welcomeBack: string;
  startJourney: string;
  noResults: string;
  loading: string;
}

const translations: Record<Language, Translations> = {
  en: {
    home: 'Home',
    movies: 'Movies',
    tvShows: 'TV Shows',
    trending: 'Trending',
    watchlist: 'Watchlist',
    search: 'Search',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    profile: 'Profile',
    settings: 'Settings',
    watchHistory: 'Watch History',
    watchNow: 'Watch Now',
    moreInfo: 'More Info',
    addToWatchlist: 'Add to Watchlist',
    removeFromWatchlist: 'Remove from Watchlist',
    inWatchlist: 'In Watchlist',
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    clear: 'Clear',
    popular: 'Popular',
    topRated: 'Top Rated',
    nowPlaying: 'Now Playing',
    upcoming: 'Upcoming',
    continueWatching: 'Continue Watching',
    areYouStillWatching: 'Are you still watching?',
    yesContinue: 'Yes, Continue',
    stopPlaying: 'Stop Playing',
    skipIntro: 'Skip Intro',
    skipOutro: 'Skip Outro',
    appearance: 'Appearance',
    playback: 'Playback',
    audioSubtitles: 'Audio & Subtitles',
    notifications: 'Notifications',
    parentalControls: 'Parental Controls',
    dataUsage: 'Data Usage',
    account: 'Account',
    theme: 'Theme',
    dark: 'Dark',
    light: 'Light',
    language: 'Language',
    welcomeBack: 'Welcome back to your movie universe',
    startJourney: 'Start your cinematic journey',
    noResults: 'No results found',
    loading: 'Loading...',
  },
  es: {
    home: 'Inicio',
    movies: 'Películas',
    tvShows: 'Series',
    trending: 'Tendencias',
    watchlist: 'Mi Lista',
    search: 'Buscar',
    signIn: 'Iniciar Sesión',
    signUp: 'Registrarse',
    signOut: 'Cerrar Sesión',
    profile: 'Perfil',
    settings: 'Configuración',
    watchHistory: 'Historial',
    watchNow: 'Ver Ahora',
    moreInfo: 'Más Info',
    addToWatchlist: 'Agregar a Mi Lista',
    removeFromWatchlist: 'Quitar de Mi Lista',
    inWatchlist: 'En Mi Lista',
    back: 'Volver',
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    clear: 'Limpiar',
    popular: 'Populares',
    topRated: 'Mejor Valoradas',
    nowPlaying: 'En Cartelera',
    upcoming: 'Próximamente',
    continueWatching: 'Continuar Viendo',
    areYouStillWatching: '¿Sigues viendo?',
    yesContinue: 'Sí, Continuar',
    stopPlaying: 'Detener',
    skipIntro: 'Saltar Intro',
    skipOutro: 'Saltar Final',
    appearance: 'Apariencia',
    playback: 'Reproducción',
    audioSubtitles: 'Audio y Subtítulos',
    notifications: 'Notificaciones',
    parentalControls: 'Control Parental',
    dataUsage: 'Uso de Datos',
    account: 'Cuenta',
    theme: 'Tema',
    dark: 'Oscuro',
    light: 'Claro',
    language: 'Idioma',
    welcomeBack: 'Bienvenido de vuelta a tu universo de películas',
    startJourney: 'Comienza tu viaje cinematográfico',
    noResults: 'No se encontraron resultados',
    loading: 'Cargando...',
  },
  fr: {
    home: 'Accueil',
    movies: 'Films',
    tvShows: 'Séries',
    trending: 'Tendances',
    watchlist: 'Ma Liste',
    search: 'Rechercher',
    signIn: 'Se Connecter',
    signUp: "S'inscrire",
    signOut: 'Se Déconnecter',
    profile: 'Profil',
    settings: 'Paramètres',
    watchHistory: 'Historique',
    watchNow: 'Regarder',
    moreInfo: "Plus d'Info",
    addToWatchlist: 'Ajouter à Ma Liste',
    removeFromWatchlist: 'Retirer de Ma Liste',
    inWatchlist: 'Dans Ma Liste',
    back: 'Retour',
    save: 'Enregistrer',
    cancel: 'Annuler',
    edit: 'Modifier',
    delete: 'Supprimer',
    clear: 'Effacer',
    popular: 'Populaires',
    topRated: 'Mieux Notés',
    nowPlaying: 'En Salle',
    upcoming: 'À Venir',
    continueWatching: 'Continuer à Regarder',
    areYouStillWatching: 'Regardez-vous toujours?',
    yesContinue: 'Oui, Continuer',
    stopPlaying: 'Arrêter',
    skipIntro: "Passer l'Intro",
    skipOutro: 'Passer la Fin',
    appearance: 'Apparence',
    playback: 'Lecture',
    audioSubtitles: 'Audio et Sous-titres',
    notifications: 'Notifications',
    parentalControls: 'Contrôle Parental',
    dataUsage: 'Utilisation des Données',
    account: 'Compte',
    theme: 'Thème',
    dark: 'Sombre',
    light: 'Clair',
    language: 'Langue',
    welcomeBack: 'Bienvenue dans votre univers cinématographique',
    startJourney: 'Commencez votre voyage cinématographique',
    noResults: 'Aucun résultat trouvé',
    loading: 'Chargement...',
  },
  de: {
    home: 'Startseite',
    movies: 'Filme',
    tvShows: 'Serien',
    trending: 'Angesagt',
    watchlist: 'Meine Liste',
    search: 'Suchen',
    signIn: 'Anmelden',
    signUp: 'Registrieren',
    signOut: 'Abmelden',
    profile: 'Profil',
    settings: 'Einstellungen',
    watchHistory: 'Verlauf',
    watchNow: 'Jetzt Ansehen',
    moreInfo: 'Mehr Infos',
    addToWatchlist: 'Zur Liste hinzufügen',
    removeFromWatchlist: 'Aus Liste entfernen',
    inWatchlist: 'In der Liste',
    back: 'Zurück',
    save: 'Speichern',
    cancel: 'Abbrechen',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    clear: 'Leeren',
    popular: 'Beliebt',
    topRated: 'Am besten bewertet',
    nowPlaying: 'Im Kino',
    upcoming: 'Demnächst',
    continueWatching: 'Weiterschauen',
    areYouStillWatching: 'Schaust du noch?',
    yesContinue: 'Ja, Weiter',
    stopPlaying: 'Stopp',
    skipIntro: 'Intro überspringen',
    skipOutro: 'Outro überspringen',
    appearance: 'Erscheinungsbild',
    playback: 'Wiedergabe',
    audioSubtitles: 'Audio & Untertitel',
    notifications: 'Benachrichtigungen',
    parentalControls: 'Jugendschutz',
    dataUsage: 'Datennutzung',
    account: 'Konto',
    theme: 'Thema',
    dark: 'Dunkel',
    light: 'Hell',
    language: 'Sprache',
    welcomeBack: 'Willkommen zurück in deiner Filmwelt',
    startJourney: 'Beginne deine cineastische Reise',
    noResults: 'Keine Ergebnisse gefunden',
    loading: 'Laden...',
  },
  zh: {
    home: '首页',
    movies: '电影',
    tvShows: '电视剧',
    trending: '热门',
    watchlist: '我的列表',
    search: '搜索',
    signIn: '登录',
    signUp: '注册',
    signOut: '退出',
    profile: '个人资料',
    settings: '设置',
    watchHistory: '观看历史',
    watchNow: '立即观看',
    moreInfo: '更多信息',
    addToWatchlist: '添加到列表',
    removeFromWatchlist: '从列表移除',
    inWatchlist: '在列表中',
    back: '返回',
    save: '保存',
    cancel: '取消',
    edit: '编辑',
    delete: '删除',
    clear: '清除',
    popular: '热门',
    topRated: '评分最高',
    nowPlaying: '正在上映',
    upcoming: '即将上映',
    continueWatching: '继续观看',
    areYouStillWatching: '你还在观看吗?',
    yesContinue: '是的,继续',
    stopPlaying: '停止播放',
    skipIntro: '跳过片头',
    skipOutro: '跳过片尾',
    appearance: '外观',
    playback: '播放',
    audioSubtitles: '音频和字幕',
    notifications: '通知',
    parentalControls: '家长控制',
    dataUsage: '数据使用',
    account: '账户',
    theme: '主题',
    dark: '深色',
    light: '浅色',
    language: '语言',
    welcomeBack: '欢迎回到你的电影世界',
    startJourney: '开始你的电影之旅',
    noResults: '未找到结果',
    loading: '加载中...',
  },
  ja: {
    home: 'ホーム',
    movies: '映画',
    tvShows: 'テレビ番組',
    trending: 'トレンド',
    watchlist: 'マイリスト',
    search: '検索',
    signIn: 'ログイン',
    signUp: '登録',
    signOut: 'ログアウト',
    profile: 'プロフィール',
    settings: '設定',
    watchHistory: '視聴履歴',
    watchNow: '今すぐ見る',
    moreInfo: '詳細',
    addToWatchlist: 'リストに追加',
    removeFromWatchlist: 'リストから削除',
    inWatchlist: 'リストに追加済み',
    back: '戻る',
    save: '保存',
    cancel: 'キャンセル',
    edit: '編集',
    delete: '削除',
    clear: 'クリア',
    popular: '人気',
    topRated: '高評価',
    nowPlaying: '上映中',
    upcoming: '公開予定',
    continueWatching: '視聴を続ける',
    areYouStillWatching: 'まだ見ていますか?',
    yesContinue: 'はい、続ける',
    stopPlaying: '停止',
    skipIntro: 'イントロをスキップ',
    skipOutro: 'アウトロをスキップ',
    appearance: '外観',
    playback: '再生',
    audioSubtitles: '音声と字幕',
    notifications: '通知',
    parentalControls: 'ペアレンタルコントロール',
    dataUsage: 'データ使用',
    account: 'アカウント',
    theme: 'テーマ',
    dark: 'ダーク',
    light: 'ライト',
    language: '言語',
    welcomeBack: '映画の世界へようこそ',
    startJourney: '映画の旅を始めよう',
    noResults: '結果が見つかりません',
    loading: '読み込み中...',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const stored = localStorage.getItem('moviepopcorn_language') as Language;
    if (stored && translations[stored]) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('moviepopcorn_language', lang);
  };

  const t = (key: keyof Translations): string => {
    return translations[language][key] || translations.en[key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export const languageNames: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  zh: '中文',
  ja: '日本語',
};
