import React from "react";
import { ProjectsMatrix, ProjectsMatrixProps } from "./projects-matrix/ProjectsMatrix";
import { WhatWeProduce, WhatWeProduceProps } from "./what-we-produce/WhatWeProduce";
import { ClientStories, ClientStoriesProps } from "./client-stories/ClientStories";

export interface RockCastleSectionsProps {
  /** Props forwarded to ProjectsMatrix section */
  projectsProps?: ProjectsMatrixProps;
  /** Props forwarded to WhatWeProduce section */
  produceProps?: WhatWeProduceProps;
  /** Props forwarded to ClientStories section */
  storiesProps?: ClientStoriesProps;
  /** Custom wrapper className */
  className?: string;
  /** Custom wrapper style */
  style?: React.CSSProperties;
}

/**
 * RockCastleSections Showcase Component
 * 
 * Renders all three showcase sections together in sequence:
 * 1. Projects Matrix (Architecture in Motion - 10 Projects)
 * 2. What We Produce (Vocabulary Marquee + Capability Band)
 * 3. Client Stories (Editorial Testimonial Ticker)
 */
export const RockCastleSections: React.FC<RockCastleSectionsProps> = ({
  projectsProps,
  produceProps,
  storiesProps,
  className = "",
  style,
}) => {
  return (
    <div
      className={`rc-rockcastle-sections-wrapper ${className}`}
      style={{ width: "100%", overflowX: "hidden", ...style }}
    >
      {/* 1. Projects Matrix Section (Architecture in motion) */}
      <ProjectsMatrix {...projectsProps} />

      {/* 2. What We Produce Section (Vocabulary parallax marquee + Disciplines band) */}
      <WhatWeProduce {...produceProps} />

      {/* 3. Client Stories Section (Editorial review ticker with interactive navigation) */}
      <ClientStories {...storiesProps} />
    </div>
  );
};

export default RockCastleSections;
