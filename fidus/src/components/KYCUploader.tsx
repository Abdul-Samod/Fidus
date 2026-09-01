import React, { useRef, useState } from 'react';
import { UploadCloud, CheckCircle2, Loader2, Eye } from 'lucide-react';
import { Card } from './ui/Card';
import { ImageModal } from './ui/ImageModal';

export interface KYCUploaderProps {
  title: string;
  description: string;
  fieldName: string;
  uploadFn: (formData: FormData) => Promise<void>;
  currentUrl: string | null;
  wtaBonus: string;
}

export const KYCUploader: React.FC<KYCUploaderProps> = ({
  title,
  description,
  fieldName,
  uploadFn,
  currentUrl,
  wtaBonus,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append(fieldName, file);
      await uploadFn(formData);
    } catch (err: any) {
      setError(err.message || 'Failed to upload document');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  const isImage = currentUrl?.match(/\.(jpeg|jpg|gif|png)$/i) != null || currentUrl?.includes('res.cloudinary.com');

  return (
    <>
      <Card className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-heading font-bold text-lg text-primary">{title}</h3>
          <span className="text-xs font-bold text-trust-blue bg-trust-blue/10 px-2.5 py-1 rounded-full">
            +{wtaBonus} WTA
          </span>
        </div>
        <p className="text-sm font-body text-secondary mb-6">{description}</p>

        {currentUrl ? (
          <div className="mt-auto space-y-3">
            <div className="bg-emerald/10 border border-emerald/20 rounded-lg p-4 flex items-center text-emerald">
              <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium font-body truncate">Document Uploaded Successfully</span>
            </div>
            {isImage && (
              <div 
                className="relative h-32 w-full rounded-lg overflow-hidden border border-border group cursor-pointer"
                onClick={() => setModalOpen(true)}
              >
                <img src={currentUrl} alt={title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div 
            className="mt-auto border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-trust-blue/50 hover:bg-trust-blue/5 transition-all cursor-pointer"
            onClick={triggerSelect}
          >
            {loading ? (
              <Loader2 className="w-8 h-8 text-trust-blue animate-spin mb-3" />
            ) : (
              <UploadCloud className="w-8 h-8 text-muted mb-3 group-hover:text-trust-blue transition-colors" />
            )}
            <span className="text-sm font-body text-primary font-medium mb-1">
              {loading ? 'Uploading...' : 'Click to upload document'}
            </span>
            <span className="text-xs font-body text-muted">
              PDF, JPG, or PNG (max 5MB)
            </span>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,image/jpeg,image/png"
              onChange={handleFileChange}
              disabled={loading}
            />
          </div>
        )}
        {error && <p className="text-rose text-xs font-body mt-2">{error}</p>}
      </Card>
      
      {currentUrl && isImage && (
        <ImageModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          imageUrl={currentUrl} 
          altText={title}
        />
      )}
    </>
  );
};
