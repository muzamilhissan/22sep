import React from "react";

interface SectionHeaderProps {
  icon: React.ReactNode;
  badge: string;
  title: string;
  subtitle: string;
  isNew?: boolean;
}

export default function SectionHeader({ icon, badge, title, subtitle, isNew = true }: SectionHeaderProps) {
  return (
    <>
      <div className="section-badge">
        {icon}
        <span>{badge}</span>
        {isNew && <span className="new-pill">NEW</span>}
      </div>
      <h2 className="section-title">{title}</h2>
      <p className="section-sub">{subtitle}</p>
    </>
  );
}
