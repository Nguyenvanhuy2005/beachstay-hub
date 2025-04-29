
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { Loader2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucketName: string;
  folderPath?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  bucketName,
  folderPath = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.includes('image')) {
      toast.error('Chỉ chấp nhận file hình ảnh');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file tối đa là 5MB');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;
      
      console.log('Uploading file to', bucketName, filePath);
      
      // First check if bucket exists, if not create it
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();
        
      if (bucketsError) {
        console.error('Error checking buckets:', bucketsError);
        throw new Error('Could not check storage buckets');
      }
      
      const bucketExists = buckets.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        console.log('Bucket does not exist, creating:', bucketName);
        const { error: createBucketError } = await supabase
          .storage
          .createBucket(bucketName, {
            public: true
          });
          
        if (createBucketError) {
          console.error('Error creating bucket:', createBucketError);
          throw new Error('Could not create storage bucket');
        }
      }
      
      // Upload file
      const { error: uploadError } = await supabase
        .storage
        .from(bucketName)
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Upload failed');
      }
      
      // Get public URL
      const { data: urlData } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      console.log('Upload successful, public URL:', urlData.publicUrl);
      
      onChange(urlData.publicUrl);
      toast.success('Tải lên hình ảnh thành công');
      
    } catch (error: any) {
      console.error('Error during upload:', error);
      toast.error(`Lỗi tải lên: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemove = () => {
    onChange('');
  };
  
  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative">
          <img 
            src={value}
            alt="Uploaded"
            className="max-h-[200px] rounded-md object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center bg-gray-50">
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Đang tải lên...</p>
            </div>
          ) : (
            <>
              <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag & drop hoặc click để tải lên hình ảnh
              </p>
              <Input
                id="image-upload"
                type="file"
                onChange={handleUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Chọn hình ảnh
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
