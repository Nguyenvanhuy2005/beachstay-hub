
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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

  const resetForm = () => {
    setName('');
    setNameEn('');
    setDescription('');
    setDescriptionEn('');
    setCapacity('');
    setCapacityEn('');
    setPrice('');
    setImageUrl('');
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
              <Label htmlFor="imageUrl">URL Hình ảnh</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
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
