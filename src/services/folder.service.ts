import { FolderRepository } from '../repositories/folder.repository';
import { IFile, IFolder } from '../domain/folder';
import { File } from '../entities/File';

export class FolderService {
  constructor(private folderRepository: FolderRepository) {}

  async getFolderTree(): Promise<IFolder[]> {
    return this.folderRepository.getFolderTree();
  }

  async getDirectChildren(folderId: string): Promise<IFolder[]> {
    return this.folderRepository.getDirectChildren(folderId);
  }

  async getFolderFiles(folderId: string): Promise<IFile[]> {
    return this.folderRepository.findFiles(folderId);
  }

  async createFolder(name: string, parentId?: string): Promise<IFolder> {
    let path = `/${name}`;
    if (parentId) {
      const parentFolder = await this.folderRepository.findById(parentId);
      if (!parentFolder) {
        throw new Error('Parent folder not found');
      }
      path = `${parentFolder.path}/${name}`;
    }
    return this.folderRepository.create({ name, parentId: parentId ?? null, path });
  }

  async updateFolder(id: string, name: string): Promise<IFolder | null> {
    return this.folderRepository.update(id, { name });
  }

  async deleteFolder(id: string): Promise<void> {
    return this.folderRepository.delete(id);
  }

  async addFile(folderId: string, fileData: Partial<File>): Promise<File> {
    return this.folderRepository.addFile(folderId, fileData);
  }
}
