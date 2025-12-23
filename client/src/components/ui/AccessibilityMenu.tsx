import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Accessibility, 
  X, 
  ZoomIn, 
  ZoomOut, 
  Contrast, 
  Type, 
  MousePointer2, 
  Link2, 
  RotateCcw,
  Eye,
  Pause,
  AlignJustify
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  invertColors: boolean;
  dyslexicFont: boolean;
  highlightLinks: boolean;
  bigCursor: boolean;
  lineHeight: number;
  letterSpacing: number;
  pauseAnimations: boolean;
  focusIndicator: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  highContrast: false,
  invertColors: false,
  dyslexicFont: false,
  highlightLinks: false,
  bigCursor: false,
  lineHeight: 100,
  letterSpacing: 0,
  pauseAnimations: false,
  focusIndicator: false,
};

export function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('accessibility-settings');
      return saved ? JSON.parse(saved) : defaultSettings;
    }
    return defaultSettings;
  });
  const { language } = useLanguage();
  
  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      title: { en: "Accessibility Menu", he: "תפריט נגישות" },
      fontSize: { en: "Text Size", he: "גודל טקסט" },
      increase: { en: "Increase", he: "הגדל" },
      decrease: { en: "Decrease", he: "הקטן" },
      highContrast: { en: "High Contrast", he: "ניגודיות גבוהה" },
      invertColors: { en: "Invert Colors", he: "היפוך צבעים" },
      dyslexicFont: { en: "Dyslexia Friendly", he: "גופן לדיסלקציה" },
      highlightLinks: { en: "Highlight Links", he: "הדגש קישורים" },
      bigCursor: { en: "Large Cursor", he: "סמן גדול" },
      lineHeight: { en: "Line Height", he: "גובה שורה" },
      letterSpacing: { en: "Letter Spacing", he: "מרווח אותיות" },
      pauseAnimations: { en: "Pause Animations", he: "עצור אנימציות" },
      focusIndicator: { en: "Focus Indicator", he: "מחוון מיקוד" },
      reset: { en: "Reset All", he: "איפוס הכל" },
      close: { en: "Close", he: "סגור" },
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  // Apply settings to the document
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    root.style.fontSize = `${settings.fontSize}%`;
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Invert colors
    if (settings.invertColors) {
      root.classList.add('invert-colors');
    } else {
      root.classList.remove('invert-colors');
    }
    
    // Dyslexic font
    if (settings.dyslexicFont) {
      root.classList.add('dyslexic-font');
    } else {
      root.classList.remove('dyslexic-font');
    }
    
    // Highlight links
    if (settings.highlightLinks) {
      root.classList.add('highlight-links');
    } else {
      root.classList.remove('highlight-links');
    }
    
    // Big cursor
    if (settings.bigCursor) {
      root.classList.add('big-cursor');
    } else {
      root.classList.remove('big-cursor');
    }
    
    // Line height
    root.style.setProperty('--a11y-line-height', `${settings.lineHeight}%`);
    if (settings.lineHeight !== 100) {
      root.classList.add('custom-line-height');
    } else {
      root.classList.remove('custom-line-height');
    }
    
    // Letter spacing
    root.style.setProperty('--a11y-letter-spacing', `${settings.letterSpacing * 0.05}em`);
    if (settings.letterSpacing > 0) {
      root.classList.add('custom-letter-spacing');
    } else {
      root.classList.remove('custom-letter-spacing');
    }
    
    // Pause animations
    if (settings.pauseAnimations) {
      root.classList.add('pause-animations');
    } else {
      root.classList.remove('pause-animations');
    }
    
    // Focus indicator
    if (settings.focusIndicator) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }
    
    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <>
      {/* Accessibility Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-[90] w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center"
        aria-label={t('title')}
        data-testid="button-accessibility"
      >
        <Accessibility className="h-6 w-6" />
      </button>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[95]"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-full max-w-md bg-background border-r border-border shadow-2xl z-[100] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Accessibility className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-bold">{t('title')}</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                  aria-label={t('close')}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Settings */}
              <div className="p-4 space-y-6">
                
                {/* Text Size */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 font-medium">
                    <Type className="h-4 w-4" />
                    {t('fontSize')}: {settings.fontSize}%
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateSetting('fontSize', Math.max(80, settings.fontSize - 10))}
                      className="flex-1 py-3 px-4 bg-muted hover:bg-muted/80 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      aria-label={t('decrease')}
                    >
                      <ZoomOut className="h-4 w-4" />
                      A-
                    </button>
                    <button
                      onClick={() => updateSetting('fontSize', Math.min(150, settings.fontSize + 10))}
                      className="flex-1 py-3 px-4 bg-muted hover:bg-muted/80 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      aria-label={t('increase')}
                    >
                      <ZoomIn className="h-4 w-4" />
                      A+
                    </button>
                  </div>
                </div>

                {/* Line Height */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 font-medium">
                    <AlignJustify className="h-4 w-4" />
                    {t('lineHeight')}: {settings.lineHeight}%
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateSetting('lineHeight', Math.max(100, settings.lineHeight - 25))}
                      className="flex-1 py-3 px-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                    >
                      -
                    </button>
                    <button
                      onClick={() => updateSetting('lineHeight', Math.min(200, settings.lineHeight + 25))}
                      className="flex-1 py-3 px-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Letter Spacing */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 font-medium">
                    <Type className="h-4 w-4" />
                    {t('letterSpacing')}: {settings.letterSpacing}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateSetting('letterSpacing', Math.max(0, settings.letterSpacing - 1))}
                      className="flex-1 py-3 px-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                    >
                      -
                    </button>
                    <button
                      onClick={() => updateSetting('letterSpacing', Math.min(5, settings.letterSpacing + 1))}
                      className="flex-1 py-3 px-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Toggle Options */}
                <div className="space-y-3">
                  <ToggleButton
                    active={settings.highContrast}
                    onClick={() => updateSetting('highContrast', !settings.highContrast)}
                    icon={<Contrast className="h-5 w-5" />}
                    label={t('highContrast')}
                  />
                  
                  <ToggleButton
                    active={settings.invertColors}
                    onClick={() => updateSetting('invertColors', !settings.invertColors)}
                    icon={<Eye className="h-5 w-5" />}
                    label={t('invertColors')}
                  />
                  
                  <ToggleButton
                    active={settings.dyslexicFont}
                    onClick={() => updateSetting('dyslexicFont', !settings.dyslexicFont)}
                    icon={<Type className="h-5 w-5" />}
                    label={t('dyslexicFont')}
                  />
                  
                  <ToggleButton
                    active={settings.highlightLinks}
                    onClick={() => updateSetting('highlightLinks', !settings.highlightLinks)}
                    icon={<Link2 className="h-5 w-5" />}
                    label={t('highlightLinks')}
                  />
                  
                  <ToggleButton
                    active={settings.bigCursor}
                    onClick={() => updateSetting('bigCursor', !settings.bigCursor)}
                    icon={<MousePointer2 className="h-5 w-5" />}
                    label={t('bigCursor')}
                  />
                  
                  <ToggleButton
                    active={settings.pauseAnimations}
                    onClick={() => updateSetting('pauseAnimations', !settings.pauseAnimations)}
                    icon={<Pause className="h-5 w-5" />}
                    label={t('pauseAnimations')}
                  />
                  
                  <ToggleButton
                    active={settings.focusIndicator}
                    onClick={() => updateSetting('focusIndicator', !settings.focusIndicator)}
                    icon={<MousePointer2 className="h-5 w-5" />}
                    label={t('focusIndicator')}
                  />
                </div>

                {/* Reset Button */}
                <button
                  onClick={resetSettings}
                  className="w-full py-3 px-4 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  {t('reset')}
                </button>

                {/* Accessibility Statement */}
                <div className="text-xs text-muted-foreground text-center pt-4 border-t border-border">
                  <p>WCAG 2.2 AA Compliant</p>
                  <p className="mt-1">© {new Date().getFullYear()} Gal Shinhorn Studio</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function ToggleButton({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full py-4 px-4 rounded-lg flex items-center gap-3 transition-all",
        active 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted hover:bg-muted/80"
      )}
      aria-pressed={active}
    >
      {icon}
      <span className="font-medium">{label}</span>
      <span className={cn(
        "ml-auto w-12 h-6 rounded-full relative transition-colors",
        active ? "bg-primary-foreground/30" : "bg-foreground/20"
      )}>
        <span className={cn(
          "absolute top-1 w-4 h-4 rounded-full transition-all",
          active ? "right-1 bg-primary-foreground" : "left-1 bg-foreground/50"
        )} />
      </span>
    </button>
  );
}
