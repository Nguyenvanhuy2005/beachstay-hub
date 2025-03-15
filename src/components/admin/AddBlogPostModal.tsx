
import React, { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Plus, X, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddBlogPostModal = ({ open, onOpenChange, onPostAdded }) => {
  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [author, setAuthor] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [published, setPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [featuredImage, setFeaturedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  
  const fileInputRef = useRef(null);

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Generate slug from title if slug is empty
    if (!slug) {
      setSlug(generateSlug(newTitle));
    }
  };

  const generateSlug = (text) => {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-'); // Replace multiple - with single -
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFeaturedImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setUploadingImage(true);
      
      // Check file size
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Kích thước tệp quá lớn (tối đa 5MB)');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Chỉ chấp nhận tệp hình ảnh');
        return;
      }
      
      // Generate a unique path for the image
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}-${file.name}`;
      const filePath = `blog-images/${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Error uploading image:', error);
        toast.error('Không thể tải lên hình ảnh');
        return;
      }
      
      // Get public URL of the uploaded image
      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);
      
      setFeaturedImage(file);
      setFeaturedImageUrl(urlData.publicUrl);
      toast.success('Đã tải lên hình ảnh thành công');
      
    } catch (error) {
      console.error('Unexpected error uploading image:', error);
      toast.error('Không thể tải lên hình ảnh');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !titleEn || !slug || !content || !contentEn || !author) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if slug already exists
      const { data: existingPost, error: checkError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      
      if (checkError) {
        throw checkError;
      }
      
      if (existingPost) {
        toast.error('Đường dẫn (slug) đã tồn tại, vui lòng sử dụng một đường dẫn khác');
        setIsSubmitting(false);
        return;
      }
      
      // Create new blog post
      const newPost = {
        title,
        title_en: titleEn,
        slug,
        content,
        content_en: contentEn,
        excerpt: excerpt || null,
        excerpt_en: excerptEn || null,
        author,
        tags,
        published,
        published_at: published ? new Date().toISOString() : null,
        featured_image: featuredImageUrl || null,
      };
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(newPost)
        .select();
      
      if (error) {
        throw error;
      }
      
      toast.success('Đã tạo bài viết thành công');
      onPostAdded();
      handleReset();
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast.error('Không thể tạo bài viết');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setTitleEn('');
    setSlug('');
    setContent('');
    setContentEn('');
    setExcerpt('');
    setExcerptEn('');
    setAuthor('');
    setTags([]);
    setTagInput('');
    setPublished(false);
    setFeaturedImage(null);
    setFeaturedImageUrl('');
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        handleReset();
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo Bài Viết Mới</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <Tabs defaultValue="vietnamese">
            <TabsList className="mb-4">
              <TabsTrigger value="vietnamese">Tiếng Việt</TabsTrigger>
              <TabsTrigger value="english">Tiếng Anh</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vietnamese" className="space-y-4">
              <div>
                <Label htmlFor="title">Tiêu Đề (Tiếng Việt) <span className="text-red-500">*</span></Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={handleTitleChange} 
                  placeholder="Nhập tiêu đề bài viết" 
                />
              </div>
              
              <div>
                <Label htmlFor="excerpt">Tóm Tắt (Tiếng Việt)</Label>
                <Textarea 
                  id="excerpt" 
                  value={excerpt} 
                  onChange={(e) => setExcerpt(e.target.value)} 
                  placeholder="Tóm tắt ngắn gọn về bài viết (sẽ hiển thị ở trang danh sách)" 
                  rows={3} 
                />
              </div>
              
              <div>
                <Label htmlFor="content">Nội Dung (Tiếng Việt) <span className="text-red-500">*</span></Label>
                <div className="mt-1 mb-8 h-64 border rounded-md">
                  <ReactQuill 
                    theme="snow" 
                    value={content} 
                    onChange={setContent}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Nhập nội dung bài viết..."
                    className="h-56"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="english" className="space-y-4">
              <div>
                <Label htmlFor="title_en">Tiêu Đề (Tiếng Anh) <span className="text-red-500">*</span></Label>
                <Input 
                  id="title_en" 
                  value={titleEn} 
                  onChange={(e) => setTitleEn(e.target.value)} 
                  placeholder="Enter post title" 
                />
              </div>
              
              <div>
                <Label htmlFor="excerpt_en">Tóm Tắt (Tiếng Anh)</Label>
                <Textarea 
                  id="excerpt_en" 
                  value={excerptEn} 
                  onChange={(e) => setExcerptEn(e.target.value)} 
                  placeholder="Brief excerpt about the post (will be displayed in the listing page)" 
                  rows={3} 
                />
              </div>
              
              <div>
                <Label htmlFor="content_en">Nội Dung (Tiếng Anh) <span className="text-red-500">*</span></Label>
                <div className="mt-1 mb-8 h-64 border rounded-md">
                  <ReactQuill 
                    theme="snow" 
                    value={contentEn} 
                    onChange={setContentEn}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Enter post content..."
                    className="h-56"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="metadata" className="space-y-4">
              <div>
                <Label htmlFor="slug">Đường Dẫn (Slug) <span className="text-red-500">*</span></Label>
                <Input 
                  id="slug" 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)} 
                  placeholder="duong-dan-bai-viet" 
                />
                <p className="text-sm text-gray-500 mt-1">URL: /blog/{slug}</p>
              </div>
              
              <div>
                <Label htmlFor="author">Tác Giả <span className="text-red-500">*</span></Label>
                <Input 
                  id="author" 
                  value={author} 
                  onChange={(e) => setAuthor(e.target.value)} 
                  placeholder="Tên tác giả" 
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Thẻ</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} className="flex items-center gap-1">
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(tag)}
                        className="text-xs hover:bg-red-600 rounded-full h-4 w-4 inline-flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input 
                  id="tags" 
                  value={tagInput} 
                  onChange={(e) => setTagInput(e.target.value)} 
                  onKeyDown={handleAddTag} 
                  placeholder="Nhập thẻ và nhấn Enter" 
                />
              </div>
              
              <div>
                <Label htmlFor="featured-image">Ảnh Đại Diện</Label>
                <div className="mt-2">
                  {featuredImageUrl ? (
                    <div className="relative w-full h-48 rounded-md overflow-hidden mb-2">
                      <img 
                        src={featuredImageUrl} 
                        alt="Featured" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                        onClick={() => {
                          setFeaturedImage(null);
                          setFeaturedImageUrl('');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      type="button" 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-full h-24 border-dashed"
                    >
                      {uploadingImage ? (
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-5 w-5 mr-2" />
                      )}
                      {uploadingImage ? 'Đang tải lên...' : 'Tải lên ảnh đại diện'}
                    </Button>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFeaturedImageChange}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="published" 
                  checked={published}
                  onCheckedChange={setPublished}
                />
                <Label htmlFor="published">Xuất bản ngay</Label>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang Tạo...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Tạo Bài Viết
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBlogPostModal;
