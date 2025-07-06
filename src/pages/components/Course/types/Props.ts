export interface Props {
    file: File | null;
    setFile: (file: File | null) => void;
    previewURL: string | null;
    setPreviewURL: (url: string | null) => void;
    setError: (msg: string) => void;
  }