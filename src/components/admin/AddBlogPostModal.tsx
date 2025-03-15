
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AddBlogPostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostAdded: () => void;
}

const AddBlogPostModal = ({ open, onOpenChange, onPostAdded }: AddBlogPostModalProps) => {
  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [content, setContent] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [slug, setSlug] = useState('');
  const [author, setAuthor] = useState('Admin');
  const [featuredImage, setFeaturedImage] = useState('');
  const [published, setPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    // Auto-generate slug from title if user hasn't manually changed it
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
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
            featured_image: featuredImage,
            published,
            published_at: publishedAt,
            tags: []
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

  const resetForm = () => {
    setTitle('');
    setTitleEn('');
    setContent('');
    setContentEn('');
    setExcerpt('');
    setExcerptEn('');
    setSlug('');
    setAuthor('Admin');
    setFeaturedImage('');
    setPublished(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm Bài Viết Mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề (Tiếng Việt)</Label>
              <Input
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Tiêu đề bài viết"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleEn">Tiêu đề (Tiếng Anh)</Label>
              <Input
                id="titleEn"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Post title"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug URL</Label>
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
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerptEn">Tóm tắt (Tiếng Anh)</Label>
              <Textarea
                id="excerptEn"
                value={excerptEn}
                onChange={(e) => setExcerptEn(e.target.value)}
                placeholder="Short excerpt about the post..."
                rows={2}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Nội dung (Tiếng Việt)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nội dung bài viết..."
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentEn">Nội dung (Tiếng Anh)</Label>
            <Textarea
              id="contentEn"
              value={contentEn}
              onChange={(e) => setContentEn(e.target.value)}
              placeholder="Post content..."
              rows={6}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="featuredImage">URL Hình ảnh đại diện</Label>
              <Input
                id="featuredImage"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
            />
            <Label htmlFor="published">Đăng bài ngay</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : 'Thêm bài viết'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBlogPostModal;
