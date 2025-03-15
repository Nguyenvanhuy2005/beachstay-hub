
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImagePlus, X, Upload } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface AddBlogPostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostAdded: () => void;
}

// Rich Text Editor modules and formats config
const editorModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image', 'video'],
    [{ 'align': [] }],
    ['clean']
  ],
};

const editorFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent',
  'link', 'image', 'video',
  'align'
];

const AddBlogPostModal = ({ open, onOpenChange, onPostAdded }: AddBlogPostModalProps) => {
  // Form data states
  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [content, setContent] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [slug, setSlug] = useState('');
  const [author, setAuthor] = useState('Admin');
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState('');
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>([]);
  const [published, setPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // SEO fields
  const [metaTitle, setMetaTitle] = useState('');
  const [metaTitleEn, setMetaTitleEn] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaDescriptionEn, setMetaDescriptionEn] = useState('');
  const [keywords, setKeywords] = useState('');
  const [keywordsEn, setKeywordsEn] = useState('');
  
  // File input refs
  const featuredImageRef = useRef<HTMLInputElement>(null);
  const galleryImagesRef = useRef<HTMLInputElement>(null);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
      .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'i')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[ùúụủũưừứựửữ]/g, 'u')
      .replace(/[ỳýỵỷỹ]/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Auto-generate meta title if empty
    if (!metaTitle) {
      setMetaTitle(newTitle);
    }
    
    // Auto-generate slug from title if user hasn't manually changed it
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleTitleEnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitleEn = e.target.value;
    setTitleEn(newTitleEn);
    
    // Auto-generate meta title if empty
    if (!metaTitleEn) {
      setMetaTitleEn(newTitleEn);
    }
  };

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFeaturedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFeaturedImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setGalleryImages(prev => [...prev, ...files]);
      
      // Create previews
      const newPreviews: string[] = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newPreviews.push(event.target.result as string);
            if (newPreviews.length === files.length) {
              setGalleryImagePreviews(prev => [...prev, ...newPreviews]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setTitle('');
    setTitleEn('');
    setContent('');
    setContentEn('');
    setExcerpt('');
    setExcerptEn('');
    setSlug('');
    setAuthor('Admin');
    setFeaturedImage(null);
    setFeaturedImagePreview('');
    setGalleryImages([]);
    setGalleryImagePreviews([]);
    setPublished(false);
    setMetaTitle('');
    setMetaTitleEn('');
    setMetaDescription('');
    setMetaDescriptionEn('');
    setKeywords('');
    setKeywordsEn('');
  };

  const uploadImage = async (file: File, bucket: string = 'blog-images'): Promise<string> => {
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);
      
      if (error) throw error;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate inputs
      if (!title || !titleEn || !content || !contentEn || !slug || !author) {
        toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
        setIsSubmitting(false);
        return;
      }

      // Upload featured image if provided
      let featuredImageUrl = '';
      if (featuredImage) {
        featuredImageUrl = await uploadImage(featuredImage);
      }

      // Upload gallery images if provided
      const galleryUrls: string[] = [];
      if (galleryImages.length > 0) {
        for (const image of galleryImages) {
          const imageUrl = await uploadImage(image);
          galleryUrls.push(imageUrl);
        }
      }

      // Current date for published_at if publishing immediately
      const publishedAt = published ? new Date().toISOString() : null;

      // Insert new blog post into database
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([
          {
            title,
            title_en: titleEn,
            content,
            content_en: contentEn,
            excerpt,
            excerpt_en: excerptEn,
            slug,
            author,
            featured_image: featuredImageUrl,
            gallery_images: galleryUrls,
            published,
            published_at: publishedAt,
            tags: keywords ? keywords.split(',').map(tag => tag.trim()) : [],
            meta_title: metaTitle || title,
            meta_title_en: metaTitleEn || titleEn,
            meta_description: metaDescription || excerpt,
            meta_description_en: metaDescriptionEn || excerptEn,
            keywords: keywords,
            keywords_en: keywordsEn
          }
        ]);

      if (error) {
        throw error;
      }

      toast.success('Đã thêm bài viết mới thành công');
      onPostAdded();
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding blog post:', error);
      toast.error('Không thể thêm bài viết: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[95vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Thêm Bài Viết Mới</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="content" className="w-full">
            <div className="px-6">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="content">Nội dung</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="images">Hình ảnh</TabsTrigger>
                <TabsTrigger value="publication">Xuất bản</TabsTrigger>
              </TabsList>
            </div>
            
            <ScrollArea className="h-[calc(95vh-200px)] px-6">
              <TabsContent value="content" className="space-y-4 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Tiêu đề (Tiếng Việt) <span className="text-red-500">*</span></Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={handleTitleChange}
                      placeholder="Tiêu đề bài viết"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="titleEn">Tiêu đề (Tiếng Anh) <span className="text-red-500">*</span></Label>
                    <Input
                      id="titleEn"
                      value={titleEn}
                      onChange={handleTitleEnChange}
                      placeholder="Post title"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug URL <span className="text-red-500">*</span></Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="ten-bai-viet"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Slug sẽ được dùng trong URL của bài viết. Ví dụ: /blog/ten-bai-viet
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Tóm tắt (Tiếng Việt)</Label>
                    <Textarea
                      id="excerpt"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Tóm tắt ngắn về bài viết..."
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Tóm tắt ngắn sẽ hiển thị ở trang danh sách bài viết
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="excerptEn">Tóm tắt (Tiếng Anh)</Label>
                    <Textarea
                      id="excerptEn"
                      value={excerptEn}
                      onChange={(e) => setExcerptEn(e.target.value)}
                      placeholder="Short excerpt about the post..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Nội dung (Tiếng Việt) <span className="text-red-500">*</span></Label>
                  <div className="min-h-[250px]">
                    <ReactQuill
                      theme="snow"
                      value={content}
                      onChange={setContent}
                      modules={editorModules}
                      formats={editorFormats}
                      placeholder="Nhập nội dung bài viết..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contentEn">Nội dung (Tiếng Anh) <span className="text-red-500">*</span></Label>
                  <div className="min-h-[250px]">
                    <ReactQuill
                      theme="snow"
                      value={contentEn}
                      onChange={setContentEn}
                      modules={editorModules}
                      formats={editorFormats}
                      placeholder="Enter post content..."
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title (Tiếng Việt)</Label>
                    <Input
                      id="metaTitle"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="Meta title cho SEO"
                    />
                    <p className="text-xs text-muted-foreground">
                      Để trống để sử dụng tiêu đề bài viết
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaTitleEn">Meta Title (Tiếng Anh)</Label>
                    <Input
                      id="metaTitleEn"
                      value={metaTitleEn}
                      onChange={(e) => setMetaTitleEn(e.target.value)}
                      placeholder="Meta title for SEO"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description (Tiếng Việt)</Label>
                    <Textarea
                      id="metaDescription"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Mô tả cho SEO"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Mô tả tóm tắt về bài viết, tối ưu 150-160 ký tự
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaDescriptionEn">Meta Description (Tiếng Anh)</Label>
                    <Textarea
                      id="metaDescriptionEn"
                      value={metaDescriptionEn}
                      onChange={(e) => setMetaDescriptionEn(e.target.value)}
                      placeholder="Description for SEO"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Từ khóa (Tiếng Việt)</Label>
                    <Textarea
                      id="keywords"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="du lịch, biển, resort, nghỉ dưỡng"
                      rows={2}
                    />
                    <p className="text-xs text-muted-foreground">
                      Các từ khóa phân cách bằng dấu phẩy (,)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keywordsEn">Từ khóa (Tiếng Anh)</Label>
                    <Textarea
                      id="keywordsEn"
                      value={keywordsEn}
                      onChange={(e) => setKeywordsEn(e.target.value)}
                      placeholder="travel, beach, resort, vacation"
                      rows={2}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="images" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="featuredImage">Hình ảnh đại diện</Label>
                    <div className="mt-2 flex flex-col space-y-2">
                      <div className="flex items-center space-x-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => featuredImageRef.current?.click()}
                          className="w-full"
                        >
                          <ImagePlus className="h-4 w-4 mr-2" />
                          Chọn hình ảnh đại diện
                        </Button>
                        <input
                          ref={featuredImageRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFeaturedImageChange}
                          className="hidden"
                        />
                      </div>
                      
                      {featuredImagePreview && (
                        <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            src={featuredImagePreview} 
                            alt="Featured preview" 
                            className="w-full h-full object-contain"
                          />
                          <Button 
                            type="button"
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-2 right-2 h-8 w-8"
                            onClick={() => {
                              setFeaturedImage(null);
                              setFeaturedImagePreview('');
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <Label htmlFor="galleryImages">Thư viện hình ảnh</Label>
                    <div className="mt-2 flex flex-col space-y-4">
                      <div className="flex items-center space-x-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => galleryImagesRef.current?.click()}
                          className="w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Thêm hình ảnh vào thư viện
                        </Button>
                        <input
                          ref={galleryImagesRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryImagesChange}
                          className="hidden"
                        />
                      </div>
                      
                      {galleryImagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                          {galleryImagePreviews.map((preview, index) => (
                            <div key={index} className="relative group aspect-square bg-gray-100 rounded-md overflow-hidden">
                              <img 
                                src={preview} 
                                alt={`Gallery image ${index + 1}`} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                <Button 
                                  type="button"
                                  variant="destructive" 
                                  size="icon" 
                                  className="opacity-0 group-hover:opacity-100 h-8 w-8"
                                  onClick={() => removeGalleryImage(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="publication" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="author">Tác giả</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Tên tác giả"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={published}
                    onCheckedChange={setPublished}
                  />
                  <Label htmlFor="published">Đăng bài ngay</Label>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-md mt-4">
                  <h3 className="font-medium mb-2">Hướng dẫn SEO:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Sử dụng tiêu đề hấp dẫn có chứa từ khóa chính</li>
                    <li>Viết mô tả thu hút người đọc, tối ưu 150-160 ký tự</li>
                    <li>Cấu trúc bài viết rõ ràng với các tiêu đề h2, h3</li>
                    <li>Thêm hình ảnh có alt text mô tả</li>
                    <li>Sử dụng từ khóa tự nhiên trong nội dung</li>
                  </ul>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <DialogFooter className="p-6 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting} className="ml-2">
              {isSubmitting ? 'Đang xử lý...' : 'Thêm bài viết'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBlogPostModal;
