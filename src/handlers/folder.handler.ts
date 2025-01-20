import { Elysia } from 'elysia';
import { FolderService } from '../services/folder.service';

export const folderHandler = (folderService: FolderService) => {
  return new Elysia()
    .get('/api/v1/folders', async () => {
      const folders = await folderService.getFolderTree();
      return { data: folders };
    })
    .get('/api/v1/folders/:id/children', async ({ params }) => {
      const children = await folderService.getDirectChildren(params.id);
      return { data: children };
    })
    .get('/api/v1/folders/:id/files', async ({ params }) => {
      const files = await folderService.getFolderFiles(params.id);
      return { data: files };
    })
    .post('/api/v1/folders', async ({ body }) => {
      const { name, parentId } = body as { name: string; parentId?: string };
      const folder = await folderService.createFolder(name, parentId);
      return { data: folder };
    })
    .put('/api/v1/folders/:id', async ({ params, body }) => {
      const { name } = body as { name: string };
      const folder = await folderService.updateFolder(params.id, name);
      return { data: folder };
    })
    .delete('/api/v1/folders/:id', async ({ params }) => {
      await folderService.deleteFolder(params.id);
      return { success: true };
    })
    // File endpoints
    .post('/api/v1/folders/:id/files', async ({ params, body }) => {
      const fileData = body as { name: string; type: string; size: number };
      const file = await folderService.addFile(params.id, fileData);
      return { data: file };
    });
};
