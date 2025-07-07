import Section from "../../../features/course/types/Section";
export interface SectionsListProps {
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
}