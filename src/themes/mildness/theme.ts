export interface ThemeConfig {
  name: string;
  fontFamily: {
    title: string;
    body: string;
    accent?: string;
  };
  colors: {
    primary: string;
    secondary: string;
    background: string;
    cardBg: string;
    text: string;
    textMuted: string;
    accent: string;
  };
  borderRadius: string;
}

export const mildnessTheme: ThemeConfig = {
  name: 'mildness',
  fontFamily: {
    title: 'var(--font-serif)',
    body: 'var(--font-sans)',
  },
  colors: {
    primary: '#78350f', // Amber/Earthy brown
    secondary: '#fef3c7',
    background: '#fafaf9', // Warm stone/off-white
    cardBg: '#ffffff',
    text: '#1c1917',
    textMuted: '#78716c',
    accent: '#d97706',
  },
  borderRadius: '1rem',
};
