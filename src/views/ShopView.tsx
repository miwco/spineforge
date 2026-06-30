import React, { useState } from 'react';
import { Coins, Palette, Volume2, Award, Zap, Check, Shield, Image as ImageIcon, Flame, Crown, Music } from 'lucide-react';
import type { AppState } from '../hooks/useAppState';

interface ShopViewProps {
  state: AppState;
  purchaseCosmetic: (id: string, price: number) => { success: boolean; error?: string };
  equipCosmetic: (type: 'theme' | 'sound' | 'title' | 'badge' | 'animation' | 'relic', value: string) => void;
}

interface ShopItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  type: 'theme' | 'sound' | 'title' | 'routine' | 'badge' | 'animation' | 'relic';
  value: string;
  icon?: React.ReactNode;
  bg?: string;
}

const SHOP_ITEMS: ShopItem[] = [
  // Industrial Themes
  { id: 'theme-retro', name: 'VOLCANIC HEAT', desc: 'Crust-magma red and ash black glow', price: 100, type: 'theme', value: 'theme-retro', bg: 'linear-gradient(135deg, #ff2a00, #5e2715)', icon: <Flame size={48} color="#ffffff" opacity={0.5} /> },
  { id: 'theme-forest', name: 'ANCIENT RUNES', desc: 'Corrupted emerald green forge energy', price: 150, type: 'theme', value: 'theme-forest', bg: 'linear-gradient(135deg, #00ffaa, #104f32)', icon: <Palette size={48} color="#ffffff" opacity={0.5} /> },
  { id: 'theme-cyber', name: 'VOIDWALKER', desc: 'Dark cosmic nebula purple sparks', price: 200, type: 'theme', value: 'theme-cyber', bg: 'linear-gradient(135deg, #a855f7, #0c0817)', icon: <ImageIcon size={48} color="#ffffff" opacity={0.5} /> },
  { id: 'theme-ember', name: 'EMBER CORE', desc: 'Pure white-hot glowing ember theme', price: 500, type: 'theme', value: 'theme-ember', bg: 'linear-gradient(135deg, #ffffff, #f37021)', icon: <Flame size={48} color="#000000" opacity={0.5} /> },

  // Synthesized Sound Packs
  { id: 'sound-zen', name: 'ZEN BOWL CHIME', desc: 'Tibetan singing bowls with long decay', price: 80, type: 'sound', value: 'zen', bg: 'linear-gradient(135deg, #2c3e50, #1a252f)', icon: <Music size={48} color="#bdc3c7" /> },
  { id: 'sound-synthwave', name: 'SYNTH DETUNE', desc: 'Heavy sawtooth synthesizer chord alerts', price: 80, type: 'sound', value: 'synthwave', bg: 'linear-gradient(135deg, #8e44ad, #2c3e50)', icon: <Volume2 size={48} color="#e74c3c" /> },
  { id: 'sound-arcane', name: 'ARCANE RESONANCE', desc: 'Deep bass impacts and ethereal choirs', price: 250, type: 'sound', value: 'arcane', bg: 'linear-gradient(135deg, #d35400, #c0392b)', icon: <Volume2 size={48} color="#f1c40f" /> },

  // Badges
  { id: 'badge-anvil', name: 'IRON ANVIL', desc: 'A heavy iron anvil dashboard badge', price: 150, type: 'badge', value: 'badge-anvil', bg: 'linear-gradient(135deg, #7f8c8d, #34495e)', icon: <Shield size={48} color="#ecf0f1" /> },
  { id: 'badge-molten', name: 'MOLTEN CORE', desc: 'A glowing hot vertebrae badge', price: 400, type: 'badge', value: 'badge-molten', bg: 'linear-gradient(135deg, #f39c12, #d35400)', icon: <Flame size={48} color="#ffffff" /> },
  { id: 'badge-titan', name: 'TITAN SHIELD', desc: 'An unbreakable shield badge', price: 1000, type: 'badge', value: 'badge-titan', bg: 'linear-gradient(135deg, #ecf0f1, #bdc3c7)', icon: <Shield size={48} color="#2c3e50" /> },

  // Animations
  { id: 'anim-sparks', name: 'FORGE SPARKS', desc: 'Grinding sparks completion effect', price: 150, type: 'animation', value: 'anim-sparks', bg: 'linear-gradient(135deg, #e67e22, #d35400)', icon: <Zap size={48} color="#ffffff" /> },
  { id: 'anim-eruption', name: 'MOLTEN ERUPTION', desc: 'Massive magma explosion effect', price: 450, type: 'animation', value: 'anim-eruption', bg: 'linear-gradient(135deg, #c0392b, #8e44ad)', icon: <Flame size={48} color="#f1c40f" /> },

  // Honorary Ranks (Titles)
  { id: 'title-sentinel', name: 'SPINE SENTINEL', desc: 'Calcium pillars, defend the nervous path!', price: 50, type: 'title', value: 'Spine Sentinel', bg: '#0c0e12', icon: <Award size={32} color="var(--primary)" /> },
  { id: 'title-lord', name: 'LUMBAR LORD', desc: 'Ruler of the lower five vertebrae plates', price: 100, type: 'title', value: 'Lumbar Lord', bg: '#0c0e12', icon: <Award size={32} color="var(--primary)" /> },
  { id: 'title-defender', name: 'DISK DEFENDER', desc: 'Shielding gelatinous L4-L5 cushioning', price: 250, type: 'title', value: 'Disk Defender', bg: '#0c0e12', icon: <Award size={32} color="var(--primary)" /> },
  { id: 'title-master', name: 'FORGE MASTER', desc: 'The highest rank of the iron temple', price: 1000, type: 'title', value: 'Forge Master', bg: '#0c0e12', icon: <Award size={32} color="var(--primary)" /> },

  // Routine Blueprints
  { id: 'routine-decompress', name: 'DECOMPRESS & STRETCH', desc: 'Blueprint: Cat-Cow and Child Pose stretches', price: 300, type: 'routine', value: 'routine-decompress', bg: '#0c0e12', icon: <Zap size={32} color="var(--primary)" /> },
  { id: 'routine-glutes', name: 'GLUTE BOOSTER', desc: 'Blueprint: Bridge holds and Clamshell activations', price: 500, type: 'routine', value: 'routine-glutes', bg: '#0c0e12', icon: <Zap size={32} color="var(--primary)" /> },
  
  // End-game Relics
  { id: 'relic-crown', name: 'CROWN OF POSTURE', desc: 'A legendary glowing crown of pure light', price: 5000, type: 'relic', value: 'relic-crown', bg: 'radial-gradient(circle, #f1c40f, #d35400)', icon: <Crown size={48} color="#ffffff" /> },
];

export const ShopView: React.FC<ShopViewProps> = ({ state, purchaseCosmetic, equipCosmetic }) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleBuyOrEquip = (item: ShopItem) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const isUnlocked = state.unlockedCosmetics.includes(item.id);

    if (isUnlocked) {
      if (item.type !== 'routine' && item.type !== 'relic') {
        equipCosmetic(item.type as any, item.value);
        setSuccessMsg(`${item.name} EQUIPPED!`);
      } else if (item.type === 'routine') {
        equipCosmetic('title', state.activeTitle); // redraw trigger
        localStorage.setItem('spineforge_active_routine', item.value);
        setSuccessMsg(`ACTIVE BLUEPRINT SET TO: ${item.name}`);
      } else if (item.type === 'relic') {
        setSuccessMsg(`RELIC ${item.name} IS ACTIVE IN YOUR INVENTORY!`);
      }
    } else {
      const res = purchaseCosmetic(item.id, item.price);
      if (res.success) {
        setSuccessMsg(`UNLOCKED: ${item.name}!`);
        if (item.type !== 'routine' && item.type !== 'relic') {
          equipCosmetic(item.type as any, item.value);
        } else if (item.type === 'routine') {
          localStorage.setItem('spineforge_active_routine', item.value);
        }
      } else {
        setErrorMsg(res.error || 'FORGE REJECTION.');
      }
    }
  };

  const getEquippedStatus = (item: ShopItem): boolean => {
    if (item.type === 'theme') return state.activeTheme === item.value;
    if (item.type === 'sound') return state.activeSoundPack === item.value;
    if (item.type === 'title') return state.activeTitle === item.value;
    if (item.type === 'badge') return state.activeBadge === item.value;
    if (item.type === 'animation') return state.activeAnimation === item.value;
    if (item.type === 'relic') return state.unlockedCosmetics.includes(item.id);
    if (item.type === 'routine') {
      const active = localStorage.getItem('spineforge_active_routine') || 'default';
      return active === item.value;
    }
    return false;
  };

  const renderSection = (title: string, type: ShopItem['type'], icon: React.ReactNode) => {
    const items = SHOP_ITEMS.filter((i) => i.type === type);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
          {icon}
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{title}</h3>
        </div>
        <div className={type === 'theme' || type === 'sound' || type === 'badge' || type === 'animation' || type === 'relic' ? "shop-grid-images" : "shop-grid"}>
          
          {/* Default items shown if relevant */}
          {type === 'theme' && (
            <div className="shop-card-image-variant">
              <div className="shop-image-placeholder" style={{ background: 'linear-gradient(135deg, #1C2833, #0f1115)' }}>
                <Palette size={48} color="#7f8c8d" />
              </div>
              <div className="shop-card-info" style={{ padding: '12px' }}>
                <span className="shop-card-title">STEEL FORGE</span>
                <span className="shop-card-desc" style={{ marginBottom: '10px', minHeight: '30px' }}>Default heavy industrial slate look</span>
                <button
                  className={`btn ${state.activeTheme === 'theme-classic-dark' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%', padding: '8px', fontSize: '0.8rem' }}
                  onClick={() => equipCosmetic('theme', 'theme-classic-dark')}
                >
                  {state.activeTheme === 'theme-classic-dark' ? <Check size={14} /> : 'EQUIP'}
                </button>
              </div>
            </div>
          )}

          {type === 'sound' && (
            <div className="shop-card-image-variant">
              <div className="shop-image-placeholder" style={{ background: 'linear-gradient(135deg, #111, #222)' }}>
                <Music size={48} color="#7f8c8d" />
              </div>
              <div className="shop-card-info" style={{ padding: '12px' }}>
                <span className="shop-card-title">8-BIT CHIRP</span>
                <span className="shop-card-desc" style={{ marginBottom: '10px', minHeight: '30px' }}>Default game-synth bloops</span>
                <button
                  className={`btn ${state.activeSoundPack === '8-bit' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%', padding: '8px', fontSize: '0.8rem' }}
                  onClick={() => equipCosmetic('sound', '8-bit')}
                >
                  {state.activeSoundPack === '8-bit' ? <Check size={14} /> : 'EQUIP'}
                </button>
              </div>
            </div>
          )}

          {type === 'title' && (
            <div className="shop-card">
              <div className="shop-card-info">
                <span className="shop-card-title">SPINE INITIATE</span>
                <span className="shop-card-desc">Default initial rank title</span>
              </div>
              <button
                className={`btn ${state.activeTitle === 'Spine Initiate' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ width: 'auto', padding: '6px 14px', fontSize: '0.8rem' }}
                onClick={() => equipCosmetic('title', 'Spine Initiate')}
              >
                {state.activeTitle === 'Spine Initiate' ? <Check size={14} /> : 'EQUIP'}
              </button>
            </div>
          )}
          
          {type === 'badge' && (
            <div className="shop-card-image-variant">
              <div className="shop-image-placeholder" style={{ background: 'linear-gradient(135deg, #111, #222)' }}>
                <Shield size={48} color="#7f8c8d" />
              </div>
              <div className="shop-card-info" style={{ padding: '12px' }}>
                <span className="shop-card-title">NO BADGE</span>
                <span className="shop-card-desc" style={{ marginBottom: '10px', minHeight: '30px' }}>Default clear dashboard</span>
                <button
                  className={`btn ${state.activeBadge === 'badge-none' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%', padding: '8px', fontSize: '0.8rem' }}
                  onClick={() => equipCosmetic('badge', 'badge-none')}
                >
                  {state.activeBadge === 'badge-none' ? <Check size={14} /> : 'EQUIP'}
                </button>
              </div>
            </div>
          )}

          {type === 'animation' && (
            <div className="shop-card-image-variant">
              <div className="shop-image-placeholder" style={{ background: 'linear-gradient(135deg, #111, #222)' }}>
                <Zap size={48} color="#7f8c8d" />
              </div>
              <div className="shop-card-info" style={{ padding: '12px' }}>
                <span className="shop-card-title">DEFAULT</span>
                <span className="shop-card-desc" style={{ marginBottom: '10px', minHeight: '30px' }}>Standard completion screen</span>
                <button
                  className={`btn ${state.activeAnimation === 'anim-none' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%', padding: '8px', fontSize: '0.8rem' }}
                  onClick={() => equipCosmetic('animation', 'anim-none')}
                >
                  {state.activeAnimation === 'anim-none' ? <Check size={14} /> : 'EQUIP'}
                </button>
              </div>
            </div>
          )}

          {type === 'routine' && (
            <div className="shop-card">
              <div className="shop-card-info">
                <span className="shop-card-title">CORE BACK ROUTINE</span>
                <span className="shop-card-desc">The default 5-minute stabilizer routine</span>
              </div>
              <button
                className={`btn ${(localStorage.getItem('spineforge_active_routine') || 'default') === 'default' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ width: 'auto', padding: '6px 14px', fontSize: '0.8rem' }}
                onClick={() => {
                  localStorage.setItem('spineforge_active_routine', 'default');
                  equipCosmetic('title', state.activeTitle);
                  setSuccessMsg('ACTIVE BLUEPRINT: CORE BACK ROUTINE!');
                }}
              >
                {(localStorage.getItem('spineforge_active_routine') || 'default') === 'default' ? <Check size={14} /> : 'EQUIP'}
              </button>
            </div>
          )}

          {items.map((item) => {
            const isUnlocked = state.unlockedCosmetics.includes(item.id);
            const isEquipped = getEquippedStatus(item);
            
            const isImageCard = ['theme', 'sound', 'badge', 'animation', 'relic'].includes(item.type);

            if (isImageCard) {
              return (
                <div key={item.id} className="shop-card-image-variant">
                  <div className="shop-image-placeholder" style={{ background: item.bg }}>
                    {item.icon}
                  </div>
                  <div className="shop-card-info" style={{ padding: '12px' }}>
                    <span className="shop-card-title">{item.name}</span>
                    <span className="shop-card-desc" style={{ marginBottom: '10px', minHeight: '30px' }}>{item.desc}</span>
                    <button
                      className={`btn ${isEquipped ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ width: '100%', padding: '8px', fontSize: '0.8rem', color: !isUnlocked && !isEquipped ? 'var(--primary)' : undefined }}
                      onClick={() => handleBuyOrEquip(item)}
                    >
                      {isEquipped ? (
                        <Check size={14} />
                      ) : isUnlocked ? (
                        item.type === 'relic' ? 'OWNED' : 'EQUIP'
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <Coins size={12} />
                          {item.price}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              );
            }

            // Normal list card
            return (
              <div key={item.id} className="shop-card">
                <div className="shop-card-info">
                  <span className="shop-card-title">{item.name}</span>
                  <span className="shop-card-desc">{item.desc}</span>
                </div>
                <button
                  className={`btn ${isEquipped ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: 'auto', padding: '6px 14px', fontSize: '0.8rem', color: !isUnlocked && !isEquipped ? 'var(--primary)' : undefined }}
                  onClick={() => handleBuyOrEquip(item)}
                >
                  {isEquipped ? (
                    <Check size={14} />
                  ) : isUnlocked ? (
                    'EQUIP'
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Coins size={12} />
                      {item.price}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fade-in scroll-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <h2>FORGE DEPOT</h2>
        <div className="stat-pill coins">
          <Coins size={16} />
          <span>{state.coins} COINS</span>
        </div>
      </div>

      {errorMsg && (
        <div className="glass-card" style={{ borderColor: '#c0392b', padding: '10px 16px', color: '#ff2a00', fontWeight: '700', fontSize: '0.85rem' }}>
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="glass-card" style={{ borderColor: 'var(--primary)', padding: '10px 16px', color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem' }}>
          {successMsg}
        </div>
      )}

      {renderSection('AMBIENT VISUAL THEMES', 'theme', <Palette size={18} color="var(--primary)" />)}
      {renderSection('DASHBOARD BADGES', 'badge', <Shield size={18} color="var(--primary)" />)}
      {renderSection('COMPLETION ANIMATIONS', 'animation', <Zap size={18} color="var(--primary)" />)}
      {renderSection('HONORARY TITLES', 'title', <Award size={18} color="var(--primary)" />)}
      {renderSection('AUDITORY EMISSIONS', 'sound', <Volume2 size={18} color="var(--primary)" />)}
      {renderSection('ROUTINE BLUEPRINTS', 'routine', <Zap size={18} color="var(--primary)" />)}
      {renderSection('LEGENDARY RELICS', 'relic', <Crown size={18} color="var(--primary)" />)}
    </div>
  );
};
