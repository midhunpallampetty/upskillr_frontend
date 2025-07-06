import Section from "./Section";
export interface SectionsListProps {
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
}