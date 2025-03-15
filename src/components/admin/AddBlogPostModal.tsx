import React, { useState, useRef } from 'react';
import { supabase, getPublicUrl } from '@/lib/supabase';
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
  // Basic content states
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
  
  // Media states
  const [featuredImage, setFeaturedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  
  // Simple SEO states
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState([]);
  const [metaKeywordInput, setMetaKeywordInput] = useState('');
  
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
    
    // Use title as meta title if empty
    if (!metaTitle) {
      setMetaTitle(newTitle);
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
  
  const handleAddMetaKeyword = (e) => {
    if (e.key === 'Enter' && metaKeywordInput.trim()) {
      e.preventDefault();
      if (!metaKeywords.includes(metaKeywordInput.trim())) {
        setMetaKeywords([...metaKeywords, metaKeywordInput.trim()]);
      }
      setMetaKeywordInput('');
    }
  };

  const handleRemoveMetaKeyword = (keywordToRemove) => {
    setMetaKeywords(metaKeywords.filter(keyword => keyword !== keywordToRemove));
  };

  const handleFeaturedImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setUploadingImage(true);
      console.log('Starting image upload process...');
      
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
      const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      
      console.log('Uploading image with filename:', fileName);
      
      // Upload to Supabase Storage with direct path (not nested)
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Error uploading image:', error);
        toast.error(`Không thể tải lên hình ảnh: ${error.message}`);
        return;
      }
      
      console.log('Upload successful:', data);
      
      // Get public URL of the uploaded image
      const publicUrl = getPublicUrl('blog-images', fileName);
      console.log('Public URL:', publicUrl);
      
      setFeaturedImage(file);
      setFeaturedImageUrl(publicUrl);
      
      toast.success('Đã tải lên hình ảnh thành công');
      
    } catch (error) {
      console.error('Unexpected error uploading image:', error);
      toast.error(`Không thể tải lên hình ảnh: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !slug || !content || !contentEn || !author) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Checking if slug exists...');
      // Check if slug already exists
      const { data: existingPost, error: checkError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking existing slug:', checkError);
        throw checkError;
      }
      
      if (existingPost) {
        toast.error('Đường dẫn (slug) đã tồn tại, vui lòng sử dụng một đường dẫn khác');
        setIsSubmitting(false);
        return;
      }
      
      console.log('Creating blog post with data:', {
        title,
        slug,
        content: content.substring(0, 50) + '...',
        author,
        tags,
        published
      });
      
      // Simple structured data
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "image": featuredImageUrl || "",
        "author": {
          "@type": "Person",
          "name": author
        },
        "datePublished": new Date().toISOString(),
        "dateModified": new Date().toISOString(),
        "publisher": {
          "@type": "Organization",
          "name": "Annam Village",
          "logo": {
            "@type": "ImageObject",
            "url": "https://annamvillage.vn/logo.png"
          }
        }
      };
      
      // Create new blog post with basic SEO fields
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
        // Basic SEO fields
        meta_title: metaTitle || title,
        meta_description: metaDescription || excerpt,
        meta_keywords: metaKeywords,
        structured_data: structuredData
      };
      
      console.log('Sending insert request to blog_posts table');
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(newPost)
        .select();
      
      if (error) {
        console.error('Error inserting blog post:', error);
        throw error;
      }
      
      console.log('Blog post created successfully:', data);
      
      // Send notification email to admin if blog post was created
      try {
        const blogPost = data[0];
        if (blogPost) {
          await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/send-booking-notification`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              blogPost,
              adminEmail: 'admin@annamvillage.vn' // You can replace with your actual admin email
            }),
          });
        }
      } catch (emailError) {
        console.error("Error sending notification email:", emailError);
        // Don't throw here, we don't want to fail the blog creation if just the email fails
      }
      
      toast.success('Đã tạo bài viết thành công');
      onPostAdded();
      handleReset();
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast.error(`Không thể tạo bài viết: ${error.message}`);
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
    
    // Reset SEO fields
    setMetaTitle('');
    setMetaDescription('');
    setMetaKeywords([]);
    setMetaKeywordInput('');
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        handleReset();
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo Bài Viết Mới</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <Tabs defaultValue="vietnamese">
            <TabsList className="mb-4">
              <TabsTrigger value="vietnamese">Tiếng Việt</TabsTrigger>
              <TabsTrigger value="english">Tiếng Anh</TabsTrigger>
              <TabsTrigger value="metadata">Thông tin khác</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
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
                    placeholder="Nhập nội dung b��i viết..."
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
                  placeholder="Brief excerpt about the post" 
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
            
            <TabsContent value="seo" className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Tiêu đề SEO</Label>
                <Input 
                  id="metaTitle" 
                  value={metaTitle} 
                  onChange={(e) => setMetaTitle(e.target.value)} 
                  placeholder={title || "Tiêu đề hiển thị trên kết quả tìm kiếm"} 
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Độ dài lý tưởng: 50-60 ký tự. Hiện tại: {metaTitle.length} ký tự
                </p>
              </div>
              
              <div>
                <Label htmlFor="metaDescription">Mô tả SEO</Label>
                <Textarea 
                  id="metaDescription" 
                  value={metaDescription} 
                  onChange={(e) => setMetaDescription(e.target.value)} 
                  placeholder={excerpt || "Mô tả ngắn hiển thị trên kết quả tìm kiếm"}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Độ dài lý tưởng: 150-160 ký tự. Hiện tại: {metaDescription.length} ký tự
                </p>
              </div>
              
              <div>
                <Label htmlFor="metaKeywords">Từ khóa SEO</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {metaKeywords.map((keyword, index) => (
                    <Badge key={index} className="flex items-center gap-1">
                      {keyword}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveMetaKeyword(keyword)}
                        className="text-xs hover:bg-red-600 rounded-full h-4 w-4 inline-flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input 
                  id="metaKeywords" 
                  value={metaKeywordInput} 
                  onChange={(e) => setMetaKeywordInput(e.target.value)} 
                  onKeyDown={handleAddMetaKeyword} 
                  placeholder="Nhập từ khóa và nhấn Enter" 
                />
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg border border-muted">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium">SEO Preview</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sky-600 text-base font-medium">
                    {metaTitle || title || "Tiêu đề bài viết của bạn"}
                  </p>
                  <p className="text-green-700 text-sm">
                    annamvillage.vn/blog/{slug || "duong-dan-bai-viet"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {metaDescription || excerpt || "Mô tả bài viết của bạn sẽ xuất hiện ở đây..."}
                  </p>
                </div>
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
