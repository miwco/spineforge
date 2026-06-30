import React from 'react';
import { ShieldAlert, Stethoscope, ShieldCheck } from 'lucide-react';

export const SafetyView: React.FC = () => {
  return (
    <div className="fade-in scroll-container">
      <div className="glass-card highlight" style={{ borderColor: 'var(--accent)', boxShadow: '0 0 15px rgba(244, 63, 94, 0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <ShieldAlert size={28} color="var(--accent)" />
          <h2 style={{ color: 'var(--text-primary)' }}>Listen to Your Body</h2>
        </div>
        <p style={{ color: 'var(--text-primary)', fontWeight: '500', marginBottom: '12px' }}>
          SpineForge is designed for maintenance, not medical rehabilitation. Please follow these safety rules:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>•</span>
            <p><strong>Stop immediately</strong> if you experience sharp or sudden pain during any movement.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>•</span>
            <p>If pain begins to <strong>radiate</strong> down your buttocks or leg, stop the exercise.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>•</span>
            <p>Watch out for any new <strong>numbness, tingling, or weakness</strong> in your legs or feet.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>•</span>
            <p>If anything feels unsafe or unstable, skip that movement.</p>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <Stethoscope size={24} color="var(--secondary)" />
          <h3>When to Seek Help</h3>
        </div>
        <p style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
          Consult a physician or physical therapist if your back pain is persistent, worsening, or accompanied by:
        </p>
        <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <li>Loss of bowel or bladder control (seek emergency care immediately)</li>
          <li>Unexplained weight loss or fever accompanied by back pain</li>
          <li>History of severe trauma or cancer</li>
          <li>Difficulty raising your foot (foot drop) or standing on your toes</li>
        </ul>
      </div>

      <div className="glass-card" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <ShieldCheck size={36} color="var(--primary)" style={{ flexShrink: 0 }} />
        <div>
          <h4 style={{ fontWeight: '700' }}>Forging Safe Habits</h4>
          <p style={{ fontSize: '0.8rem' }}>Consistency beats intensity. Slow, controlled, pain-free movements build a strong foundation over time.</p>
        </div>
      </div>
    </div>
  );
};
