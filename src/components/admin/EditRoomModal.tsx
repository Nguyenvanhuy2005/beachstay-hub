import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, Upload, X } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoomAmenities, amenityOptions } from './RoomAmenities';
import DatePriceManagement from './DatePriceManagement';

interface EditRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoomUpdated: () => void;
  roomId: string | null;
}

const EditRoomModal: React.FC<EditRoomModalProps> = ({ open, onOpenChange, onRoomUpdated, roomId }) => {
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [capacity, setCapacity] = useState('');
  const [capacityEn, setCapacityEn] = useState('');
  const [price, setPrice] = useState('');
  const [weekendPrice, setWeekendPrice] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['wifi', 'tv']);
  
  const [address, setAddress] = useState('');
  const [addressEn, setAddressEn] = useState('');
  
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [currentMainImageUrl, setCurrentMainImageUrl] = useState<string | null>(null);
  
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [currentGalleryUrls, setCurrentGalleryUrls] = useState<string[]>([]);

  useEffect(() => {
    if (roomId && open) {
      fetchRoomDetails();
    } else {
      resetForm();
    }
  }, [roomId, open]);

  const fetchRoomDetails = async () => {
    if (!roomId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('room_types')
        .select('*')
        .eq('id', roomId)
        .single();

      if (error) throw error;
      
      if (data) {
        setName(data.name || '');
        setNameEn(data.name_en || '');
        setDescription(data.description || '');
        setDescriptionEn(data.description_en || '');
        setCapacity(data.capacity || '');
        setCapacityEn(data.capacity_en || '');
        setPrice(data.price?.toString() || '');
        setWeekendPrice(data.weekend_price?.toString() || data.price?.toString() || '');
        setIsPopular(data.is_popular || false);
        setSelectedAmenities(data.amenities?.map((a: any) => a.id || a.vi) || ['wifi', 'tv']);
        setCurrentMainImageUrl(data.image_url || null);
        setCurrentGalleryUrls(data.gallery_images || []);
        setAddress(data.address || '');
        setAddressEn(data.address_en || '');
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
      toast.error('Không thể tải thông tin phòng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      
      setGalleryImages(prev => [...prev, ...newFiles]);
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index: number) => {
    if (galleryPreviews[index]) {
      URL.revokeObjectURL(galleryPreviews[index]);
    }
    
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeCurrentGalleryImage = (index: number) => {
    setCurrentGalleryUrls(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setName('');
    setNameEn('');
    setDescription('');
    setDescriptionEn('');
    setCapacity('');
    setCapacityEn('');
    setPrice('');
    setWeekendPrice('');
    setIsPopular(false);
    setSelectedAmenities(['wifi', 'tv']);
    setAddress('');
    setAddressEn('');
    
    if (mainImagePreview) {
      URL.revokeObjectURL(mainImagePreview);
    }
    setMainImage(null);
    setMainImagePreview(null);
    setCurrentMainImageUrl(null);
    
    galleryPreviews.forEach(url => URL.revokeObjectURL(url));
    setGalleryImages([]);
    setGalleryPreviews([]);
    setCurrentGalleryUrls([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !capacity || !price || !weekendPrice) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsSubmitting(true);

    try {
      let mainImageUrl = currentMainImageUrl;

      if (mainImage) {
        const mainImagePath = `room_types/${Date.now()}_main_${mainImage.name.replace(/\s+/g, '_')}`;
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(mainImagePath, mainImage, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw new Error(`Error uploading main image: ${uploadError.message}`);
        }

        const { data: mainImageData } = supabase.storage
          .from('images')
          .getPublicUrl(mainImagePath);

        mainImageUrl = mainImageData.publicUrl;
      }
      
      const newGalleryUrls: string[] = [...currentGalleryUrls];
      
      for (let i = 0; i < galleryImages.length; i++) {
        const file = galleryImages[i];
        const filePath = `room_types/${Date.now()}_gallery_${i}_${file.name.replace(/\s+/g, '_')}`;
        
        const { error: galleryUploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (galleryUploadError) {
          console.error(`Error uploading gallery image ${i}:`, galleryUploadError);
          continue;
        }
        
        const { data: galleryImageData } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
          
        newGalleryUrls.push(galleryImageData.publicUrl);
      }

      if (mainImageUrl && !newGalleryUrls.includes(mainImageUrl)) {
        newGalleryUrls.unshift(mainImageUrl);
      }

      const amenitiesData = selectedAmenities.map(id => {
        const amenity = amenityOptions.find(a => a.id === id);
        return {
          id,
          vi: amenity?.name || id,
          en: amenity?.name_en || id
        };
      });

      const { error: updateError } = await supabase
        .from('room_types')
        .update({
          name,
          name_en: nameEn || name,
          description,
          description_en: descriptionEn || description,
          capacity,
          capacity_en: capacityEn || capacity,
          price: Number(price),
          weekend_price: Number(weekendPrice),
          is_popular: isPopular,
          image_url: mainImageUrl,
          gallery_images: newGalleryUrls,
          amenities: amenitiesData,
          address,
          address_en: addressEn || address
        })
        .eq('id', roomId);

      if (updateError) {
        throw updateError;
      }

      toast.success('Đã cập nhật phòng thành công');
      onRoomUpdated();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error('Không thể cập nhật phòng: ' + (error as any).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-beach-600" />
            <span className="ml-2">Đang tải thông tin phòng...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Phòng</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="amenities">Tiện nghi</TabsTrigger>
              <TabsTrigger value="images">Hình ảnh</TabsTrigger>
              <TabsTrigger value="pricing">Quản lý giá</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên phòng (VI)</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    placeholder="Phòng Deluxe"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name_en">Tên phòng (EN)</Label>
                  <Input 
                    id="name_en" 
                    value={nameEn} 
                    onChange={e => setNameEn(e.target.value)}
                    placeholder="Deluxe Room"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả (VI)</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Mô tả chi tiết về phòng..."
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description_en">Mô tả (EN)</Label>
                  <Textarea 
                    id="description_en" 
                    value={descriptionEn} 
                    onChange={e => setDescriptionEn(e.target.value)}
                    placeholder="Detailed room description..."
                    rows={4}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ (VI)</Label>
                  <Input 
                    id="address" 
                    value={address} 
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Địa chỉ phòng (Ví dụ: Khu nghỉ dưỡng Annam, Hội An)"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address_en">Địa chỉ (EN)</Label>
                  <Input 
                    id="address_en" 
                    value={addressEn} 
                    onChange={e => setAddressEn(e.target.value)}
                    placeholder="Room address (e.g., Annam Resort, Hoi An)"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Sức chứa (VI)</Label>
                  <Input 
                    id="capacity" 
                    value={capacity} 
                    onChange={e => setCapacity(e.target.value)}
                    placeholder="2 người lớn, 1 trẻ em"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="capacity_en">Sức chứa (EN)</Label>
                  <Input 
                    id="capacity_en" 
                    value={capacityEn} 
                    onChange={e => setCapacityEn(e.target.value)}
                    placeholder="2 adults, 1 child"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Giá phòng ngày thường (VND)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    value={price} 
                    onChange={e => setPrice(e.target.value)}
                    placeholder="1500000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weekend_price">Giá phòng cuối tuần/lễ (VND)</Label>
                  <Input 
                    id="weekend_price" 
                    type="number" 
                    value={weekendPrice} 
                    onChange={e => setWeekendPrice(e.target.value)}
                    placeholder="1800000"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  checked={isPopular} 
                  onCheckedChange={setIsPopular} 
                  id="is-popular" 
                />
                <Label htmlFor="is-popular">Đánh dấu là phòng nổi bật</Label>
              </div>
            </TabsContent>
            
            <TabsContent value="amenities" className="space-y-4 mt-4">
              <RoomAmenities
                selectedAmenities={selectedAmenities}
                onChange={setSelectedAmenities}
              />
            </TabsContent>
            
            <TabsContent value="images" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Ảnh chính hiện tại</Label>
                {currentMainImageUrl ? (
                  <div className="flex items-center space-x-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                      <img 
                        src={currentMainImageUrl} 
                        alt="Main" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tải lên ảnh mới để thay thế ảnh hiện tại
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Chưa có ảnh chính</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="main-image">Tải lên ảnh chính mới</Label>
                <Input 
                  id="main-image" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleMainImageChange}
                  className="w-full"
                />
                
                {mainImagePreview && (
                  <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                    <img 
                      src={mainImagePreview} 
                      alt="Main preview" 
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-black/50 p-1 rounded-bl"
                      onClick={() => {
                        URL.revokeObjectURL(mainImagePreview);
                        setMainImage(null);
                        setMainImagePreview(null);
                      }}
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="space-y-2 mt-6">
                <Label>Thư viện ảnh hiện tại</Label>
                {currentGalleryUrls.length > 0 ? (
                  <div className="grid grid-cols-5 gap-2">
                    {currentGalleryUrls.map((url, idx) => (
                      <div key={idx} className="relative h-20 w-20 overflow-hidden rounded-md border">
                        <img 
                          src={url} 
                          alt={`Gallery ${idx}`} 
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-black/50 p-1 rounded-bl"
                          onClick={() => removeCurrentGalleryImage(idx)}
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Chưa có ảnh trong thư viện</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gallery-images">Tải lên ảnh bổ sung</Label>
                <Input 
                  id="gallery-images" 
                  type="file" 
                  accept="image/*" 
                  multiple
                  onChange={handleGalleryImagesChange}
                />
                
                {galleryPreviews.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {galleryPreviews.map((preview, index) => (
                      <div key={index} className="relative h-20 w-20 overflow-hidden rounded-md border">
                        <img 
                          src={preview} 
                          alt={`Gallery ${index}`} 
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-black/50 p-1 rounded-bl"
                          onClick={() => removeGalleryImage(index)}
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="pricing" className="space-y-4 mt-4">
              {roomId && (
                <DatePriceManagement 
                  roomId={roomId} 
                  regularPrice={Number(price) || 0} 
                  weekendPrice={Number(weekendPrice) || 0} 
                />
              )}
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Cập nhật phòng
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoomModal;
