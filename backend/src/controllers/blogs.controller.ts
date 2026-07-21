import { Request, Response } from 'express';
import prisma from '../config/db';
import logger from '../utils/logger';
import { TracedRequest } from '../middlewares/trace.middleware';

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const { category, search, status } = req.query;

    const where: any = {};

    // By default, show only PUBLISHED blogs to guests/users
    where.status = status ? String(status) : 'PUBLISHED';

    if (category) {
      where.category = String(category);
    }

    if (search) {
      const searchStr = String(search).toLowerCase();
      where.OR = [
        { title: { contains: searchStr } },
        { excerpt: { contains: searchStr } },
        { content: { contains: searchStr } }
      ];
    }

    const blogs = await prisma.blog.findMany({
      where,
      orderBy: { publishedDate: 'desc' }
    });

    return res.status(200).json({ statusCode: 200, blogs });
  } catch (error) {
    logger.error({ message: 'Get All Blogs Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to fetch blogs' });
  }
};

export const getBlogBySlug = async (req: TracedRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id;

    const blog = await prisma.blog.findUnique({ where: { slug } });

    if (!blog) {
      return res.status(404).json({ statusCode: 404, message: 'Blog post not found.' });
    }

    // Increment blog view count
    const updatedBlog = await prisma.blog.update({
      where: { id: blog.id },
      data: { views: blog.views + 1 }
    });

    // Record activity and update lead score (+1 score for reading blogs)
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        await prisma.user.update({
          where: { id: userId },
          data: { leadScore: user.leadScore + 1 }
        });

        await prisma.leadActivity.create({
          data: {
            userId,
            action: 'VIEW_BLOG',
            details: `Read blog post: ${blog.title}`
          }
        });
      }
    }

    return res.status(200).json({ statusCode: 200, blog: updatedBlog });
  } catch (error) {
    logger.error({ message: 'Get Blog By Slug Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to retrieve blog details' });
  }
};

export const createBlog = async (req: TracedRequest, res: Response) => {
  try {
    const { title, excerpt, content, featuredImg, author, category, readingTime, status } = req.body;

    if (!title || !content || !category || !author) {
      return res.status(400).json({ statusCode: 400, message: 'Title, content, author, and category are required.' });
    }

    // Generate slug
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        excerpt: excerpt || '',
        content,
        featuredImg: featuredImg || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop&q=60',
        author,
        category,
        readingTime: parseInt(readingTime) || 5,
        status: status || 'DRAFT'
      }
    });

    // Audit logs for admin actions
    await prisma.auditLog.create({
      data: {
        user: req.user?.email || 'Admin',
        action: 'CREATE_BLOG',
        ip: req.ip,
        browser: req.headers['user-agent']
      }
    });

    logger.info({ message: 'New Blog Post created', blogId: blog.id, title });
    return res.status(201).json({ statusCode: 201, message: 'Blog post created successfully.', blog });
  } catch (error) {
    logger.error({ message: 'Create Blog Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to create blog post' });
  }
};

export const updateBlog = async (req: TracedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, featuredImg, author, category, readingTime, status } = req.body;

    const existingBlog = await prisma.blog.findUnique({ where: { id } });
    if (!existingBlog) {
      return res.status(404).json({ statusCode: 404, message: 'Blog post not found.' });
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        title: title || existingBlog.title,
        excerpt: excerpt || existingBlog.excerpt,
        content: content || existingBlog.content,
        featuredImg: featuredImg || existingBlog.featuredImg,
        author: author || existingBlog.author,
        category: category || existingBlog.category,
        readingTime: readingTime !== undefined ? parseInt(readingTime) : existingBlog.readingTime,
        status: status || existingBlog.status
      }
    });

    // Audit logs for admin actions
    await prisma.auditLog.create({
      data: {
        user: req.user?.email || 'Admin',
        action: 'UPDATE_BLOG',
        ip: req.ip,
        browser: req.headers['user-agent']
      }
    });

    return res.status(200).json({ statusCode: 200, message: 'Blog post updated successfully.', blog: updatedBlog });
  } catch (error) {
    logger.error({ message: 'Update Blog Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to update blog post' });
  }
};

export const deleteBlog = async (req: TracedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingBlog = await prisma.blog.findUnique({ where: { id } });
    if (!existingBlog) {
      return res.status(404).json({ statusCode: 404, message: 'Blog post not found.' });
    }

    await prisma.blog.delete({ where: { id } });

    // Audit logs for admin actions
    await prisma.auditLog.create({
      data: {
        user: req.user?.email || 'Admin',
        action: 'DELETE_BLOG',
        ip: req.ip,
        browser: req.headers['user-agent']
      }
    });

    return res.status(200).json({ statusCode: 200, message: 'Blog post deleted successfully.' });
  } catch (error) {
    logger.error({ message: 'Delete Blog Error', error: error instanceof Error ? error.message : error });
    return res.status(500).json({ statusCode: 500, message: 'Failed to delete blog post' });
  }
};
