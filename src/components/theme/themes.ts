export type ThemeKey = 'minimalist' | 'dark_academia' | 'botanical' | 'pastel' | 'vintage_library'

export interface ThemeColors {
  '--background': string
  '--foreground': string
  '--surface': string
  '--accent': string
  '--muted': string
  '--border': string
  '--glass-bg': string
  '--glass-border': string
  '--preview-color': string
  '--shelf-wood': string
  '--shelf-edge': string
  '--shelf-bottom': string
}

export const themes: Record<ThemeKey, ThemeColors> = {
  minimalist: {
    '--background': '#FAF9F6',
    '--foreground': '#050505', // Absolute dark for Boutique
    '--surface': '#FFFFFF',
    '--accent': '#C19D68',
    '--muted': '#333333', // Deep gray
    '--border': '#E2E0D9',
    '--glass-bg': 'rgba(255, 255, 255, 0.95)',
    '--glass-border': 'rgba(193, 157, 104, 0.4)',
    '--preview-color': '#C19D68',
    '--shelf-wood': '#F3F1ED',
    '--shelf-edge': '#E8E6E1',
    '--shelf-bottom': '#C19D68',
  },
  pastel: {
    '--background': '#05070A',
    '--foreground': '#F0F4FF',
    '--surface': '#0F172A',
    '--accent': '#818CF8',
    '--muted': '#94A3B8',
    '--border': '#1E293B',
    '--glass-bg': 'rgba(15, 23, 42, 0.8)',
    '--glass-border': 'rgba(129, 140, 248, 0.2)',
    '--preview-color': '#818CF8',
    '--shelf-wood': '#1E293B',
    '--shelf-edge': '#0F172A',
    '--shelf-bottom': '#1E293B',
  },
  dark_academia: {
    '--background': '#0F0D0B',
    '--foreground': '#EAE0D5',
    '--surface': '#1A1614',
    '--accent': '#C9A96E',
    '--muted': '#A68B6A',
    '--border': '#2D2621',
    '--glass-bg': 'rgba(26, 22, 20, 0.85)',
    '--glass-border': 'rgba(201, 169, 110, 0.25)',
    '--preview-color': '#C9A96E',
    '--shelf-wood': '#3D2B1F',
    '--shelf-edge': '#2A1A10',
    '--shelf-bottom': '#1A0F08',
  },
  botanical: {
    '--background': '#F0F5F0',
    '--foreground': '#051405', // Near black green
    '--surface': '#FFFFFF',
    '--accent': '#2D5A27',
    '--muted': '#2D3D2D', // Very dark olive
    '--border': '#CCD6CC',
    '--glass-bg': 'rgba(255, 255, 255, 0.9)',
    '--glass-border': 'rgba(45, 90, 39, 0.3)',
    '--preview-color': '#2D5A27',
    '--shelf-wood': '#D5CCBB',
    '--shelf-edge': '#C4B59D',
    '--shelf-bottom': '#B3A085',
  },
  vintage_library: {
    '--background': '#0D0814',
    '--foreground': '#F7F4FF',
    '--surface': '#161126',
    '--accent': '#E5C14B',
    '--muted': '#A69BBF',
    '--border': '#282040',
    '--glass-bg': 'rgba(22, 17, 38, 0.85)',
    '--glass-border': 'rgba(229, 193, 75, 0.3)',
    '--preview-color': '#E5C14B',
    '--shelf-wood': '#282040',
    '--shelf-edge': '#161126',
    '--shelf-bottom': '#0D0814',
  },
}
