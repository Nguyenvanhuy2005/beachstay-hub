
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X, Upload, Image, Loader2, RefreshCw, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { getPublicUrl } from '@/lib/supabase';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  created_at?: string;
}

const GalleryManagement = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newImageCategory, setNewImageCategory] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setImages(data || []);

      // Extract unique categories
      const uniqueCategories = [...new Set((data || []).map(img => img.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast({
        title: 'Lỗi tải dữ liệu',
        description: 'Không thể tải hình ảnh từ thư viện',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Tệp quá lớn',
          description: 'Kích thước tệp không được vượt quá 5MB',
          variant: 'destructive',
        });
        return;
      }
      
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!selectedFile || !newImageCategory || !newImageAlt) {
      toast({
        title: 'Thông tin không đầy đủ',
        description: 'Vui lòng chọn ảnh, nhập mô tả và chọn danh mục',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);
      
      // Upload image to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, selectedFile);

      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const imageUrl = getPublicUrl('images', filePath);
      
      // Save to database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert({
          src: imageUrl,
          alt: newImageAlt,
          category: newImageCategory,
        });
      
      if (dbError) {
        throw dbError;
      }
      
      // Reset form
      setSelectedFile(null);
      setImagePreview(null);
      setNewImageAlt('');
      
      toast({
        title: 'Tải lên thành công',
        description: 'Hình ảnh đã được thêm vào thư viện',
      });
      
      // Refresh images
      fetchImages();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Lỗi tải lên',
        description: 'Không thể tải lên hình ảnh, vui lòng thử lại sau',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id: string, imagePath: string) => {
    try {
      // Extract the filename from the full URL
      const urlParts = imagePath.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `gallery/${fileName}`;
      
      // Delete from database first
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);
      
      if (dbError) {
        throw dbError;
      }
      
      // Then try to delete from storage if it's our own uploaded file
      // (Skip this for initial seed images that might not be in storage)
      if (imagePath.includes('gallery/')) {
        await supabase.storage
          .from('images')
          .remove([filePath]);
      }
      
      toast({
        title: 'Xóa thành công',
        description: 'Hình ảnh đã được xóa khỏi thư viện',
      });
      
      // Update local state
      setImages(images.filter(img => img.id !== id));
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: 'Lỗi xóa ảnh',
        description: 'Không thể xóa hình ảnh, vui lòng thử lại sau',
        variant: 'destructive',
      });
    }
  };

  const clearForm = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setNewImageAlt('');
    setNewImageCategory('');
  };

  const handleNewCategory = (value: string) => {
    // If the value is "new", prompt for a new category
    if (value === "new") {
      const newCategory = prompt('Nhập tên danh mục mới:');
      if (newCategory && newCategory.trim() !== '') {
        setCategories([...categories, newCategory.trim()]);
        setNewImageCategory(newCategory.trim());
      }
    } else {
      setNewImageCategory(value);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quản lý thư viện ảnh</CardTitle>
        <CardDescription>
          Thêm, xóa và quản lý hình ảnh trong thư viện ảnh của website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Upload new image form */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-medium text-lg">Thêm ảnh mới</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUpload">Chọn ảnh</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                    {selectedFile && (
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          setSelectedFile(null);
                          setImagePreview(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="imageAlt">Mô tả ảnh</Label>
                  <Input
                    id="imageAlt"
                    placeholder="Nhập mô tả ảnh"
                    value={newImageAlt}
                    onChange={(e) => setNewImageAlt(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="imageCategory">Danh mục</Label>
                  <Select value={newImageCategory} onValueChange={handleNewCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="new">
                        <span className="flex items-center gap-1">
                          <Plus className="h-3 w-3" />
                          Thêm danh mục mới
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={uploadImage}
                    disabled={!selectedFile || uploading || !newImageAlt || !newImageCategory}
                    className="flex-1"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang tải lên...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Tải lên
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={clearForm}>
                    Xóa form
                  </Button>
                </div>
              </div>
              
              <div className={`border rounded-md flex items-center justify-center h-60 ${imagePreview ? 'p-0' : 'p-4'}`}>
                {imagePreview ? (
                  <img 
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <Image className="h-10 w-10 mx-auto mb-2" />
                    <p>Xem trước ảnh</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Gallery images list */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-lg">Hình ảnh trong thư viện</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchImages} 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-10 border rounded-md">
                <p className="text-gray-500">Chưa có hình ảnh nào trong thư viện</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div 
                    key={image.id}
                    className="border rounded-md overflow-hidden group relative"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={image.src} 
                        alt={image.alt}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="p-2 bg-white border-t">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium truncate">{image.alt}</p>
                          <span className="text-xs text-gray-500">{image.category}</span>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => deleteImage(image.id, image.src)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GalleryManagement;
