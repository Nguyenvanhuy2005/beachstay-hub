
import React, { useState } from 'react';
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

interface AddRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoomAdded: () => void;
}

const AddRoomModal: React.FC<AddRoomModalProps> = ({ open, onOpenChange, onRoomAdded }) => {
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [shortDescriptionEn, setShortDescriptionEn] = useState('');
  const [capacity, setCapacity] = useState('');
  const [capacityEn, setCapacityEn] = useState('');
  const [price, setPrice] = useState('');
  const [weekendPrice, setWeekendPrice] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['wifi', 'tv']);
  
  const [address, setAddress] = useState('');
  const [addressEn, setAddressEn] = useState('');
  
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

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
    URL.revokeObjectURL(galleryPreviews[index]);
    
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setName('');
    setNameEn('');
    setDescription('');
    setDescriptionEn('');
    setShortDescription('');
    setShortDescriptionEn('');
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
    
    galleryPreviews.forEach(url => URL.revokeObjectURL(url));
    setGalleryImages([]);
    setGalleryPreviews([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !capacity || !price || !weekendPrice || !mainImage) {
      toast.error('Vui lòng điền đầy đủ thông tin và chọn ảnh chính');
      return;
    }

    setIsSubmitting(true);

    try {
      const mainImagePath = `room_types/${Date.now()}_main_${mainImage.name.replace(/\s+/g, '_')}`;
      
      console.log('Uploading main image to path:', mainImagePath);
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('images')
        .upload(mainImagePath, mainImage, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`Error uploading main image: ${uploadError.message}`);
      }

      console.log('Main image uploaded successfully:', uploadData);

      const { data: mainImageData } = supabase.storage
        .from('images')
        .getPublicUrl(mainImagePath);

      const mainImageUrl = mainImageData.publicUrl;
      console.log('Main image URL:', mainImageUrl);
      
      const galleryUrls: string[] = [];
      
      if (mainImageUrl) {
        galleryUrls.push(mainImageUrl);
      }
      
      for (let i = 0; i < galleryImages.length; i++) {
        try {
          const file = galleryImages[i];
          const filePath = `room_types/${Date.now()}_gallery_${i}_${file.name.replace(/\s+/g, '_')}`;
          
          const { error: galleryUploadError, data: galleryUploadData } = await supabase.storage
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
            
          if (galleryImageData?.publicUrl) {
            galleryUrls.push(galleryImageData.publicUrl);
          }
        } catch (galleryError) {
          console.error(`Error processing gallery image ${i}:`, galleryError);
        }
      }

      const amenitiesData = selectedAmenities.map(id => {
        const amenity = amenityOptions.find(a => a.id === id);
        return {
          id,
          vi: amenity?.name || id,
          en: amenity?.name_en || id
        };
      });

      console.log('Creating room record with data:', {
        name,
        image_url: mainImageUrl,
        gallery_images: galleryUrls,
        price,
        weekend_price: weekendPrice,
        address,
        address_en: addressEn
      });

      const { error: insertError, data: insertedRoom } = await supabase
        .from('room_types')
        .insert({
          name,
          name_en: nameEn || name,
          description,
          description_en: descriptionEn || description,
          short_description: shortDescription || description.substring(0, 150) + (description.length > 150 ? '...' : ''),
          short_description_en: shortDescriptionEn || (descriptionEn ? descriptionEn.substring(0, 150) + (descriptionEn.length > 150 ? '...' : '') : ''),
          capacity,
          capacity_en: capacityEn || capacity,
          price: Number(price),
          weekend_price: Number(weekendPrice),
          is_popular: isPopular,
          image_url: mainImageUrl,
          gallery_images: galleryUrls,
          amenities: amenitiesData,
          address,
          address_en: addressEn || address
        })
        .select('*')
        .single();

      if (insertError) {
        throw insertError;
      }

      console.log('Room added successfully:', insertedRoom);
      toast.success('Đã thêm phòng thành công');
      onRoomAdded();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error adding room:', error);
      toast.error('Không thể thêm phòng: ' + (error as any).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm Phòng Mới</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="amenities">Tiện nghi</TabsTrigger>
              <TabsTrigger value="images">Hình ảnh</TabsTrigger>
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
                  <Label htmlFor="short_description">Mô tả ngắn (VI)</Label>
                  <Textarea 
                    id="short_description" 
                    value={shortDescription} 
                    onChange={e => setShortDescription(e.target.value)}
                    placeholder="Mô tả ngắn gọn về phòng (hiển thị ở trang danh sách)..."
                    rows={2}
                  />
                  <p className="text-xs text-gray-500">
                    *Tối đa 150 ký tự, nếu để trống sẽ tự lấy từ mô tả đầy đủ
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="short_description_en">Mô tả ngắn (EN)</Label>
                  <Textarea 
                    id="short_description_en" 
                    value={shortDescriptionEn} 
                    onChange={e => setShortDescriptionEn(e.target.value)}
                    placeholder="Brief room description (shown in listing)..."
                    rows={2}
                  />
                  <p className="text-xs text-gray-500">
                    *Max 150 characters, if empty will use full description
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả đầy đủ (VI)</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Mô tả chi tiết về phòng..."
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description_en">Mô tả đầy đủ (EN)</Label>
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
                <Label htmlFor="main-image">Ảnh chính (bắt buộc)</Label>
                <div className="flex items-center space-x-4">
                  <Input 
                    id="main-image" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleMainImageChange}
                    className="w-2/3"
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
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gallery-images">Ảnh bổ sung (tùy chọn)</Label>
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
                  Thêm phòng
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoomModal;
