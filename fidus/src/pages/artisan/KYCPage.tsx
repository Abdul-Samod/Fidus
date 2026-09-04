import { useState, useEffect } from 'react';
import { kycApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { KYCUploader } from '../../components/KYCUploader';
import { Card } from '../../components/ui/Card';
import { Badge, type BadgeVariant } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import toast from 'react-hot-toast';
import { ShieldCheck } from 'lucide-react';

export default function KYCPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { updateUser } = useAuth();

  const fetchStatus = async () => {
    try {
      const response = await kycApi.getStatus();
      // The backend returns { status, message, user } where user has WTA_Score, KYC_Verified
      setStatus(response.data?.user || response.data);
    } catch (error) {
      console.error('Failed to fetch KYC status:', error);
      toast.error('Failed to load KYC status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleUpload = async (uploadFn: (file: File) => Promise<unknown>, formData: FormData) => {
    const isProfilePic = formData.has('profile_picture');
    const file = formData.get('nin_document') as File 
      || formData.get('profile_picture') as File 
      || formData.get('business_certificate') as File;
    if (!file) return;
    const res = await uploadFn(file);
    toast.success('Document uploaded successfully');
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res as any)?.data?.data;
    if (isProfilePic && responseData?.url) {
      updateUser({ profilePicUrl: responseData.url });
    }
    fetchStatus();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader />
      </div>
    );
  }

  const verifiedVariant: BadgeVariant = status?.KYC_Verified ? 'verified' : 'unverified';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">KYC Verification</h1>
        <p className="text-text-secondary font-body">Verify your identity to increase your trust score and access more jobs</p>
      </div>

      {status && (
        <Card className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="bg-trust-blue/10 p-4 rounded-full border border-trust-blue/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <ShieldCheck className="w-8 h-8 text-trust-blue" />
            </div>
            <div>
              <p className="text-text-secondary font-body text-sm">Current WTA Score</p>
              <p className="text-4xl font-heading font-bold text-trust-blue">{status.WTA_Score ?? 0}</p>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-text-secondary font-body text-sm mb-2">Verification Status</p>
            <Badge variant={verifiedVariant} />
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KYCUploader 
          title="National ID (NIN)"
          description="Upload your NIN document to get verified. This sets your base trust score to 100."
          fieldName="nin_document"
          uploadFn={(formData) => handleUpload(kycApi.uploadNin, formData)}
          currentUrl={status?.kycDetails?.ninUrl || null}
          wtaBonus="Base: 100"
        />

        <KYCUploader 
          title="Profile Picture"
          description="Add a professional photo to boost your trust score."
          fieldName="profile_picture"
          uploadFn={(formData) => handleUpload(kycApi.uploadProfilePic, formData)}
          currentUrl={status?.kycDetails?.profilePicUrl || null}
          wtaBonus="+10"
        />

        <div className="md:col-span-2 max-w-2xl mx-auto w-full">
          <KYCUploader 
            title="Business Certificate"
            description="Upload your registered business certificate for maximum trust."
            fieldName="business_certificate"
            uploadFn={(formData) => handleUpload(kycApi.uploadBusinessCert, formData)}
            currentUrl={status?.kycDetails?.businessCert || null}
            wtaBonus="+20"
          />
        </div>
      </div>
    </div>
  );
}
