import { useEffect } from "react";
import { Props } from "../types/Props";
  
  const ThumbnailUploader: React.FC<Props> = ({ file, setFile, previewURL, setPreviewURL, setError }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith('image/')) {
        setFile(file);
        setPreviewURL(URL.createObjectURL(file));
        setError('');
      } else {
        setError('Please upload a valid image file');
      }
    };
  
    useEffect(() => {
      return () => {
        if (previewURL) URL.revokeObjectURL(previewURL);
      };
    }, [previewURL]);
  
    return (
      <div>
        <label htmlFor="courseThumbnail" className="block font-medium">Course Thumbnail</label>
        <input id="courseThumbnail" type="file" accept="image/*" onChange={handleChange} />
        {previewURL && <img src={previewURL} alt="Preview" className="mt-2 w-40 h-24 object-cover rounded shadow" />}
      </div>
    );
  };
  
  export default ThumbnailUploader;
  