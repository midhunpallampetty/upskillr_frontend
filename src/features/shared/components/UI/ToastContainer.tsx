import { XMarkIcon } from '@heroicons/react/24/outline';
import {Toast} from '../../types/ImportsAndTypes';
export  const ToastContainer = ({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) => {
  if (!toasts.length) return null;

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`max-w-sm rounded-xl p-4 shadow-2xl transform transition-all duration-500 ease-out backdrop-blur-sm border ${
            toast.type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' :
            toast.type === 'error' ? 'bg-rose-500/90 border-rose-400 text-white' :
            toast.type === 'warning' ? 'bg-amber-500/90 border-amber-400 text-white' :
            'bg-blue-500/90 border-blue-400 text-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 flex-shrink-0 text-white/80 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
