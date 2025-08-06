
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from './ImageUpload';
import { Loader2, AlertTriangle } from 'lucide-react';

interface AddBlogPostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostAdded: () => void;
}

const AddBlogPostModal = ({ open, onOpenChange, onPostAdded }: AddBlogPostModalProps) => {
  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [slug, setSlug] = useState('');
  const [author, setAuthor] = useState('Annam Village');
  const [content, setContent] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [featuredImage, setFeaturedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const quillRef = useRef<ReactQuill>(null);
  
  const generateSlug = (text: string) => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };
  
  const handleTagsInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagsInput.trim();
      
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);
        setTagsInput('');
      }
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Custom image upload handler for ReactQuill
  const imageHandler = () => {
    // Create an input element
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    
    // When a file is selected
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      
      try {
        // Check file type and size
        if (!file.type.includes('image/')) {
          toast.error('Chỉ chấp nhận file hình ảnh');
          return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Kích thước file tối đa là 5MB');
          return;
        }
        
        // Show loading toast
        const loadingToast = toast.loading('Đang tải hình ảnh...');
        
        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `content/${fileName}`;
        
        // Try to upload to blog-images bucket first
        let uploadResult = await supabase.storage
          .from('blog-images')
          .upload(filePath, file);
          
        // If there's an error with blog-images bucket, try the images bucket
        if (uploadResult.error) {
          console.log('Trying fallback bucket:', uploadResult.error);
          uploadResult = await supabase.storage
            .from('images')
            .upload(filePath, file);
            
          if (uploadResult.error) {
            toast.error('Không thể tải lên hình ảnh');
            toast.dismiss(loadingToast);
            return;
          }
        }
        
        // Get the URL for the uploaded image
        const bucket = uploadResult.error ? 'images' : 'blog-images';
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);
          
        // Insert the image into the editor
        const quill = quillRef.current?.getEditor();
        const range = quill?.getSelection(true);
        
        if (quill && range) {
          quill.insertEmbed(range.index, 'image', urlData.publicUrl);
        }
        
        toast.dismiss(loadingToast);
        toast.success('Đã tải lên hình ảnh thành công');
        
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Lỗi khi tải lên hình ảnh');
      }
    };
  };
  
  // Configure Quill modules with custom handlers
  const quillModules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!title) {
        setError('Vui lòng nhập tiêu đề bài viết');
        setIsLoading(false);
        return;
      }
      
      if (!slug) {
        setError('Vui lòng nhập đường dẫn cho bài viết');
        setIsLoading(false);
        return;
      }
      
      if (!content) {
        setError('Vui lòng nhập nội dung bài viết');
        setIsLoading(false);
        return;
      }
      
      console.log('Creating new blog post with data:', {
        title,
        title_en: titleEn,
        slug,
        author,
        content,
        content_en: contentEn,
        excerpt,
        excerpt_en: excerptEn,
        tags,
        published: isPublished,
        featured_image: featuredImage,
      });
      
      // Check if slug already exists
      const { data: existingPost, error: slugCheckError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      
      if (slugCheckError) {
        console.error('Error checking for existing slug:', slugCheckError);
        throw new Error('Không thể kiểm tra đường dẫn');
      }
      
      if (existingPost) {
        setError('Đường dẫn này đã tồn tại, vui lòng sử dụng đường dẫn khác');
        setIsLoading(false);
        return;
      }
      
      // Create post in database
      const { data, error: insertError } = await supabase
        .from('blog_posts')
        .insert({
          title,
          title_en: titleEn || title, // Default to Vietnamese title if English not provided
          slug,
          author,
          content,
          content_en: contentEn || content, // Default to Vietnamese content if English not provided
          excerpt: excerpt || title.substring(0, 150), // Default to first 150 chars of title if excerpt not provided
          excerpt_en: excerptEn || titleEn?.substring(0, 150) || title.substring(0, 150),
          tags,
          published: isPublished,
          published_at: isPublished ? new Date().toISOString() : null,
          featured_image: featuredImage
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('Error creating blog post:', insertError);
        throw new Error('Không thể tạo bài viết');
      }
      
      console.log('Blog post created successfully:', data);
      
      // Send notification about new blog post
      try {
        // Get admin email
        const { data: adminData, error: adminError } = await supabase
          .from('admin_access')
          .select('email')
          .eq('is_active', true)
          .limit(1)
          .maybeSingle();
        
        if (!adminError && adminData?.email) {
          console.log('Sending blog post notification to:', adminData.email);
          
          await supabase.functions.invoke('send-gmail', {
            body: { 
              type: 'blog_notification',
              data: {
                title: data.title,
                author: data.author,
                created_at: data.created_at,
                published: data.published,
                slug: data.slug,
                adminEmail: adminData.email
              }
            }
          });
        }
      } catch (notificationError) {
        console.error('Error sending blog post notification:', notificationError);
        // Don't throw - we already created the blog post successfully
      }
      
      toast.success('Đã tạo bài viết thành công!');
      onPostAdded();
      resetForm();
      onOpenChange(false);
      
    } catch (error: any) {
      console.error('Error in blog post creation:', error);
      setError(error.message || 'Đã xảy ra lỗi khi tạo bài viết');
      toast.error('Không thể tạo bài viết');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setTitleEn('');
    setSlug('');
    setAuthor('Annam Village');
    setContent('');
    setContentEn('');
    setExcerpt('');
    setExcerptEn('');
    setTags([]);
    setTagsInput('');
    setIsPublished(false);
    setFeaturedImage('');
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo bài viết mới</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex items-start gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        <Tabs defaultValue="vietnamese">
          <TabsList className="mb-4">
            <TabsTrigger value="vietnamese">Tiếng Việt</TabsTrigger>
            <TabsTrigger value="english">Tiếng Anh</TabsTrigger>
            <TabsTrigger value="settings">Cài đặt</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vietnamese" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Nhập tiêu đề bài viết"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="excerpt">Tóm tắt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Nhập tóm tắt bài viết (150-200 ký tự)"
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="content">Nội dung</Label>
                <div className="min-h-[300px]">
                  <ReactQuill 
                    ref={quillRef}
                    theme="snow" 
                    value={content} 
                    onChange={setContent}
                    placeholder="Nhập nội dung bài viết..."
                    modules={quillModules}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Nhấp vào biểu tượng hình ảnh để chèn ảnh vào nội dung bài viết.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="english" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title-en">Title (English)</Label>
                <Input
                  id="title-en"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Enter post title in English"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="excerpt-en">Excerpt (English)</Label>
                <Textarea
                  id="excerpt-en"
                  value={excerptEn}
                  onChange={(e) => setExcerptEn(e.target.value)}
                  placeholder="Enter post excerpt in English (150-200 characters)"
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="content-en">Content (English)</Label>
                <div className="min-h-[300px]">
                  <ReactQuill 
                    theme="snow" 
                    value={contentEn} 
                    onChange={setContentEn}
                    placeholder="Enter post content in English..."
                    modules={quillModules}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Click on the image icon to insert images into the post content.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="slug">Đường dẫn</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="URL friendly slug (e.g. my-blog-post)"
                />
                <p className="text-sm text-muted-foreground">
                  Blog sẽ được truy cập tại: /blog/{slug}
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="author">Tác giả</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Tên tác giả"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="tags">Thẻ (tags)</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <div key={tag} className="bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                      <span>{tag}</span>
                      <button 
                        type="button" 
                        onClick={() => removeTag(tag)}
                        className="h-4 w-4 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <Input
                  id="tags"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  onKeyDown={handleTagsInputKeyDown}
                  placeholder="Nhập tag và nhấn Enter"
                />
                <p className="text-sm text-muted-foreground">
                  Nhập tag và nhấn Enter để thêm. Tags giúp phân loại bài viết.
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="featured-image">Hình ảnh chính</Label>
                <ImageUpload
                  value={featuredImage}
                  onChange={setFeaturedImage}
                  bucketName="blog-images"
                  folderPath="featured"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Switch 
                  id="published" 
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
                <Label htmlFor="published">Xuất bản ngay</Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? 'Đang lưu...' : 'Tạo bài viết'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBlogPostModal;
