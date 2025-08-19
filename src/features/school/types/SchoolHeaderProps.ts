export interface SchoolHeaderProps {
  school: { name: string } | null;
  setSchool: (school: any) => void;
}