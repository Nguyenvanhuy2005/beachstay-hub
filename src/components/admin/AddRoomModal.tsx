
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { X } from 'lucide-react';

interface AddRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoomAdded: () => void;
}

const AddRoomModal = ({ open, onOpenChange, onRoomAdded }: AddRoomModalProps) => {
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [capacity, setCapacity] = useState('');
  const [capacityEn, setCapacityEn] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryImage, setNewGalleryImage] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate inputs
      if (!name || !nameEn || !description || !descriptionEn || !capacity || !capacityEn || !price || !imageUrl) {
        toast.error('Vui lòng điền đầy đủ thông tin');
        setIsSubmitting(false);
        return;
      }

      if (galleryImages.length === 0) {
        toast.error('Vui lòng thêm ít nhất một hình ảnh cho thư viện');
        setIsSubmitting(false);
        return;
      }

      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        toast.error('Giá phòng không hợp lệ');
        setIsSubmitting(false);
        return;
      }

      // Create room amenities array (default amenities)
      const amenities = [
        { name: 'Wifi', icon: 'wifi' },
        { name: 'TV', icon: 'tv' },
        { name: 'Điều hòa', icon: 'wind' },
        { name: 'Minibar', icon: 'wine' }
      ];

      // Include the main image in the gallery if not already present
      const allGalleryImages = [imageUrl, ...galleryImages.filter(img => img !== imageUrl)];

      // Insert new room into database
      const { data, error } = await supabase
        .from('room_types')
        .insert([
          {
            name,
            name_en: nameEn,
            description,
            description_en: descriptionEn,
            capacity,
            capacity_en: capacityEn,
            price: priceNum,
            image_url: imageUrl,
            gallery_images: allGalleryImages,
            is_popular: isPopular,
            amenities
          }
        ]);

      if (error) {
        throw error;
      }

      toast.success('Đã thêm phòng mới thành công');
      onRoomAdded();
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding room:', error);
      toast.error('Không thể thêm phòng: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addGalleryImage = () => {
    if (!newGalleryImage.trim()) {
      toast.error('Vui lòng nhập URL hình ảnh');
      return;
    }
    
    if (galleryImages.includes(newGalleryImage)) {
      toast.error('Hình ảnh này đã tồn tại trong thư viện');
      return;
    }
    
    setGalleryImages([...galleryImages, newGalleryImage]);
    setNewGalleryImage('');
  };

  const removeGalleryImage = (index: number) => {
    const updatedImages = [...galleryImages];
    updatedImages.splice(index, 1);
    setGalleryImages(updatedImages);
  };

  const resetForm = () => {
    setName('');
    setNameEn('');
    setDescription('');
    setDescriptionEn('');
    setCapacity('');
    setCapacityEn('');
    setPrice('');
    setImageUrl('');
    setGalleryImages([]);
    setNewGalleryImage('');
    setIsPopular(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm Phòng Mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên phòng (Tiếng Việt)</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Phòng Deluxe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameEn">Tên phòng (Tiếng Anh)</Label>
              <Input
                id="nameEn"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="Deluxe Room"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả (Tiếng Việt)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả phòng..."
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionEn">Mô tả (Tiếng Anh)</Label>
              <Textarea
                id="descriptionEn"
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder="Room description..."
                rows={3}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Sức chứa (Tiếng Việt)</Label>
              <Input
                id="capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="2 người lớn, 1 trẻ em"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacityEn">Sức chứa (Tiếng Anh)</Label>
              <Input
                id="capacityEn"
                value={capacityEn}
                onChange={(e) => setCapacityEn(e.target.value)}
                placeholder="2 adults, 1 child"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Giá phòng (VND)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1200000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL Hình ảnh chính</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Thư viện hình ảnh</Label>
            <div className="flex items-center space-x-2">
              <Input
                value={newGalleryImage}
                onChange={(e) => setNewGalleryImage(e.target.value)}
                placeholder="Nhập URL hình ảnh cho thư viện"
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={addGalleryImage}
                variant="outline"
              >
                Thêm
              </Button>
            </div>
            
            {galleryImages.length > 0 && (
              <div className="mt-3 border rounded-md p-3">
                <p className="text-sm text-muted-foreground mb-2">Đã thêm {galleryImages.length} hình ảnh:</p>
                <div className="grid grid-cols-2 gap-2">
                  {galleryImages.map((image, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="h-10 w-10 rounded overflow-hidden">
                          <img src={image} alt="Gallery preview" className="h-full w-full object-cover" />
                        </div>
                        <span className="truncate max-w-[120px]">{image.split('/').pop()}</span>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPopular"
              checked={isPopular}
              onCheckedChange={setIsPopular}
            />
            <Label htmlFor="isPopular">Đánh dấu là phòng nổi bật</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : 'Thêm phòng'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoomModal;
