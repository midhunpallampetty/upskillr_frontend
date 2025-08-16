import React from 'react';
import { SectionsListProps } from '../types/SectionsListProps';

const SectionsList: React.FC<SectionsListProps> = ({ sections, setSections }) => {
  const handleSectionChange = (index: number, value: string) => {
    const updatedSections = [...sections];
    updatedSections[index].title = value;
    setSections(updatedSections);
  };

const addSection = () => {
  setSections([
    ...sections,
    {
      title: '',  // If 'title' is actually part of Section, keep it; otherwise, map it to 'sectionName'
      sectionName: '',  // e.g., default to empty string
      examRequired: false,  // Default based on your logic (e.g., false if not required)
      _id: '',  // Or generate a temporary ID, e.g., crypto.randomUUID() if available
      videos: [],  // Empty array for videos
      description: ''  // Empty description
    }
  ]);
};


  const removeSection = (index: number) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections);
  };

  return (
    <div>
      <label className="block font-medium mb-1">Sections</label>
      {sections.map((section, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <input
            type="text"
            placeholder={`Section ${index + 1}`}
            value={section.title}
            onChange={(e) => handleSectionChange(index, e.target.value)}
            className="flex-grow border px-3 py-2 rounded"
            
          />
          {sections.length > 1 && (
            <button
              type="button"
              onClick={() => removeSection(index)}
              className="text-red-600 hover:text-red-800 text-xl"
              title="Remove Section"
            >
              ❌
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addSection}
        className="text-blue-600 hover:underline mt-2"
      >
        ➕ Add Section
      </button>
    </div>
  );
};

export default SectionsList;
