/**
 * Utility functions for OG image generation
 * Color codes for difficulty levels and courses
 */

export interface DifficultyConfig {
  label: string;
  color: string;
  bgColor: string;
}

export interface CourseConfig {
  label: string;
  color: string;
  bgColor: string;
}

export const DIFFICULTY_COLORS: Record<string, DifficultyConfig> = {
  easy: {
    label: "Easy",
    color: "#10b981",
    bgColor: "#d1fae5",
  },
  medium: {
    label: "Medium",
    color: "#f59e0b",
    bgColor: "#fef3c7",
  },
  hard: {
    label: "Hard",
    color: "#ef4444",
    bgColor: "#fee2e2",
  },
  expert: {
    label: "Expert",
    color: "#8b5cf6",
    bgColor: "#ede9fe",
  },
};

export const COURSE_COLORS: Record<string, CourseConfig> = {
  endocrinology: {
    label: "Endocrinology",
    color: "#06b6d4", // Cyan
    bgColor: "#cffafe",
  },
  psychiatry: {
    label: "Psychiatry",
    color: "#ec4899", // Pink
    bgColor: "#fce7f3",
  },
  "child and adolescent psychiatry": {
    label: "Child And Adolescent Psychiatry",
    color: "#ec4899", // Pink
    bgColor: "#fce7f3",
  },
  neurology: {
    label: "Neurology",
    color: "#a855f7", // Purple
    bgColor: "#f3e8ff",
  },
  "cardiothoracic surgery": {
    label: "Cardiothoracic Surgery",
    color: "#14b8a6", // Teal
    bgColor: "#ccfbf1",
  },
  "aerospace medicine": {
    label: "Aerospace Medicine",
    color: "#f97316", // Orange
    bgColor: "#ffedd5",
  },
  "clinical neurophysiology": {
    label: "Clinical Neurophysiology",
    color: "#ef4444", // Red
    bgColor: "#fee2e2",
  },
  gastroenterology: {
    label: "Gastroenterology",
    color: "#3b82f6", // Blue
    bgColor: "#dbeafe",
  },
  "infectious diseases": {
    label: "Infectious Diseases",
    color: "#22c55e", // Green
    bgColor: "#dcfce7",
  },
  "medical oncology": {
    label: "Medical Oncology",
    color: "#eab308", // Yellow
    bgColor: "#fef9c3",
  },
  dermatology: {
    label: "Dermatology",
    color: "#6366f1", // Indigo
    bgColor: "#e0e7ff",
  },
  "obstetrics and gynaecology": {
    label: "Obstetrics And Gynaecology",
    color: "#d946ef", // Fuchsia
    bgColor: "#fae8ff",
  },
  neuropathology: {
    label: "Neuropathology",
    color: "#f43f5e", // Rose
    bgColor: "#ffe4e6",
  },
  allergy: {
    label: "Allergy",
    color: "#84cc16", // Lime
    bgColor: "#ecfccb",
  },
  "critical care medicine": {
    label: "Critical Care Medicine",
    color: "#0ea5e9", // Sky
    bgColor: "#e0f2fe",
  },
  "geriatric medicine": {
    label: "Geriatric Medicine",
    color: "#10b981", // Emerald
    bgColor: "#d1fae5",
  },
  neurosurgery: {
    label: "Neurosurgery",
    color: "#8b5cf6", // Violet
    bgColor: "#ede9fe",
  },
  cardiology: {
    label: "Cardiology",
    color: "#f59e0b", // Amber
    bgColor: "#fef3c7",
  },
  "emergency medicine": {
    label: "Emergency Medicine",
    color: "#64748b", // Slate
    bgColor: "#f1f5f9",
  },
  "internal medicine": {
    label: "Internal Medicine",
    color: "#06b6d4", // Cyan (Repeat start)
    bgColor: "#cffafe",
  },
  pharmacology: {
    label: "Pharmacology",
    color: "#ec4899",
    bgColor: "#fce7f3",
  },
  "clinical genetics": {
    label: "Clinical Genetics",
    color: "#a855f7",
    bgColor: "#f3e8ff",
  },
  "otorhinolaryngology (ENT)": {
    label: "Otorhinolaryngology (ENT)",
    color: "#14b8a6",
    bgColor: "#ccfbf1",
  },
  "hospice and palliative medicine": {
    label: "Hospice And Palliative Medicine",
    color: "#f97316",
    bgColor: "#ffedd5",
  },
  paediatrics: {
    label: "Paediatrics",
    color: "#ef4444",
    bgColor: "#fee2e2",
  },
  "general practice": {
    label: "General Practice",
    color: "#3b82f6",
    bgColor: "#dbeafe",
  },
  anaesthetics: {
    label: "Anaesthetics",
    color: "#22c55e",
    bgColor: "#dcfce7",
  },
  "clinical oncology": {
    label: "Clinical Oncology",
    color: "#eab308",
    bgColor: "#fef9c3",
  },
  "clinical radiology": {
    label: "Clinical Radiology",
    color: "#6366f1",
    bgColor: "#e0e7ff",
  },
  "community sexual and reproductive health": {
    label: "Community Sexual And Reproductive Health",
    color: "#d946ef",
    bgColor: "#fae8ff",
  },
  "diagnostic neuropathology": {
    label: "Diagnostic Neuropathology",
    color: "#f43f5e",
    bgColor: "#ffe4e6",
  },
  "forensic histopathology": {
    label: "Forensic Histopathology",
    color: "#84cc16",
    bgColor: "#ecfccb",
  },
  "general surgery": {
    label: "General Surgery",
    color: "#0ea5e9",
    bgColor: "#e0f2fe",
  },
  haematology: {
    label: "Haematology",
    color: "#10b981",
    bgColor: "#d1fae5",
  },
  histopathology: {
    label: "Histopathology",
    color: "#8b5cf6",
    bgColor: "#ede9fe",
  },
  immunology: {
    label: "Immunology",
    color: "#f59e0b",
    bgColor: "#fef3c7",
  },
  "medical microbiology": {
    label: "Medical Microbiology",
    color: "#64748b",
    bgColor: "#f1f5f9",
  },
  "medical ophthalmology": {
    label: "Medical Ophthalmology",
    color: "#06b6d4",
    bgColor: "#cffafe",
  },
  "medical psychotherapy": {
    label: "Medical Psychotherapy",
    color: "#ec4899",
    bgColor: "#fce7f3",
  },
  "occupational medicine": {
    label: "Occupational Medicine",
    color: "#a855f7",
    bgColor: "#f3e8ff",
  },
  "old age psychiatry": {
    label: "Old Age Psychiatry",
    color: "#14b8a6",
    bgColor: "#ccfbf1",
  },
  ophthalmology: {
    label: "Ophthalmology",
    color: "#f97316",
    bgColor: "#ffedd5",
  },
  "oral and maxillo-facial surgery": {
    label: "Oral And Maxillo-facial Surgery",
    color: "#ef4444",
    bgColor: "#fee2e2",
  },
  "paediatric cardiology": {
    label: "Paediatric Cardiology",
    color: "#3b82f6",
    bgColor: "#dbeafe",
  },
  "paediatric surgery": {
    label: "Paediatric Surgery",
    color: "#22c55e",
    bgColor: "#dcfce7",
  },
  "plastic surgery": {
    label: "Plastic Surgery",
    color: "#eab308",
    bgColor: "#fef9c3",
  },
  "psychiatry of learning disability": {
    label: "Psychiatry Of Learning Disability",
    color: "#6366f1",
    bgColor: "#e0e7ff",
  },
  "public health medicine": {
    label: "Public Health Medicine",
    color: "#d946ef",
    bgColor: "#fae8ff",
  },
  "rehabilitation medicine": {
    label: "Rehabilitation Medicine",
    color: "#f43f5e",
    bgColor: "#ffe4e6",
  },
  "renal medicine": {
    label: "Renal Medicine",
    color: "#84cc16",
    bgColor: "#ecfccb",
  },
  "respiratory medicine": {
    label: "Respiratory Medicine",
    color: "#0ea5e9",
    bgColor: "#e0f2fe",
  },
  rheumatology: {
    label: "Rheumatology",
    color: "#10b981",
    bgColor: "#d1fae5",
  },
  "sport and exercise medicine": {
    label: "Sport And Exercise Medicine",
    color: "#8b5cf6",
    bgColor: "#ede9fe",
  },
  "trauma and orthopaedic surgery": {
    label: "Trauma And Orthopaedic Surgery",
    color: "#f59e0b",
    bgColor: "#fef3c7",
  },
  "tropical medicine": {
    label: "Tropical Medicine",
    color: "#64748b",
    bgColor: "#f1f5f9",
  },
  urology: {
    label: "Urology",
    color: "#06b6d4",
    bgColor: "#cffafe",
  },
  "vascular surgery": {
    label: "Vascular Surgery",
    color: "#ec4899",
    bgColor: "#fce7f3",
  },
  anatomy: {
    label: "Anatomy",
    color: "#a855f7",
    bgColor: "#f3e8ff",
  },
  ethics: {
    label: "Ethics",
    color: "#14b8a6",
    bgColor: "#ccfbf1",
  },
};

// export function getDifficultyColor(
//   difficulty: string = "medium",
// ): DifficultyConfig {
//   return (
//     DIFFICULTY_COLORS[difficulty.toLowerCase()] || DIFFICULTY_COLORS.medium
//   );
// }

export function getCourseColor(course: string = "anatomy"): CourseConfig {
  if (!COURSE_COLORS[course.toLowerCase()])
    return { label: course, color: "#000000", bgColor: "#ffffff" };
  return COURSE_COLORS[course.toLowerCase()] || COURSE_COLORS.anatomy;
}

export function getContrastColor(bgColor: string): string {
  // Simple brightness calculation
  const color = bgColor.replace("#", "");
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#ffffff";
}

export function getDifficultyConfig(level: number) {
  switch (Number(level)) {
    case 1:
      return {
        label: "Recall",
        color: "#16a34a", // Green-600
        bgColor: "#dcfce7", // Green-100
      };
    case 2:
      return {
        label: "Understanding",
        color: "#0891b2", // Cyan-600
        bgColor: "#cffafe", // Cyan-100
      };
    case 3:
      return {
        label: "Application",
        color: "#ca8a04", // Yellow-600
        bgColor: "#fef9c3", // Yellow-100
      };
    case 4:
      return {
        label: "Analysis",
        color: "#ea580c", // Orange-600
        bgColor: "#ffedd5", // Orange-100
      };
    case 5:
      return {
        label: "Complex Reasoning",
        color: "#dc2626", // Red-600
        bgColor: "#fee2e2", // Red-100
      };
    default:
      return null
  }
}
