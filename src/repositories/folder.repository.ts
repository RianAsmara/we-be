import { DataSource, Repository, TreeRepository } from 'typeorm';
import { Folder } from '../entities/Folder';
import { File } from '../entities/File';
import { IFolder, IFile, IFolderRepository } from '../domain/folder';

export class FolderRepository implements IFolderRepository {
  private repository: TreeRepository<Folder>;
  private fileRepository: Repository<File>;

  constructor(private dataSource: DataSource) {
    this.repository = dataSource.getTreeRepository(Folder);
    this.fileRepository = dataSource.getRepository(File);
  }

  private async transformToIFolder(folder: Folder): Promise<IFolder> {
    const resolvedFiles = await folder.files;
    const resolvedChildren = await Promise.all(
      folder.children?.map(async (child) => this.transformToIFolder(child)) ?? []
    );

    return {
      id: folder.id,
      name: folder.name,
      path: folder.path,
      parentId: folder.parent?.id ?? null,
      children: resolvedChildren,
      files: resolvedFiles,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt
    };
  }

  async findById(id: string): Promise<IFolder | null> {
    const folder = await this.repository.findOne({
      where: { id },
      relations: ['children', 'files', 'parent']
    });

    if (!folder) return null;
    return this.transformToIFolder(folder);
  }

  async findByPath(path: string): Promise<IFolder | null> {
    const folder = await this.repository.findOne({
      where: { path },
      relations: ['children', 'files', 'parent']
    });

    if (!folder) return null;
    return this.transformToIFolder(folder);
  }

  async findChildren(folderId: string): Promise<IFolder[]> {
    const parent = await this.repository.findOne({ 
      where: { id: folderId },
      relations: ['children', 'files'] 
    });
    if (!parent) return [];
    const descendants = await this.repository.findDescendants(parent);
    return Promise.all(descendants.map(d => this.transformToIFolder(d)));
  }

  async getDirectChildren(folderId: string): Promise<IFolder[]> {
    const parent = await this.repository.findOne({ 
      where: { id: folderId },
      relations: ['children', 'files']
    });
    if (!parent) return [];
    const children = await this.repository.findDescendants(parent, { depth: 1 });
    return Promise.all(children.map(c => this.transformToIFolder(c)));
  }

  async getRootFolders(): Promise<IFolder[]> {
    const roots = await this.repository.findRoots();
    return Promise.all(roots.map(r => this.transformToIFolder(r)));
  }

  async create(folder: Omit<IFolder, 'id' | 'createdAt' | 'updatedAt'>): Promise<IFolder> {
    const newFolder = new Folder();
    newFolder.name = folder.name;
    newFolder.path = folder.path;

    if (folder.parentId) {
      const parentFolder = await this.repository.findOne({ where: { id: folder.parentId } });
      if (parentFolder) {
        newFolder.parent = parentFolder;
      }
    }

    const savedFolder = await this.repository.save(newFolder);
    return this.transformToIFolder(savedFolder);
  }

  async update(id: string, folder: Partial<IFolder>): Promise<IFolder> {
    const existingFolder = await this.repository.findOne({ 
      where: { id },
      relations: ['parent', 'children', 'files']
    });
    if (!existingFolder) {
      throw new Error('Folder not found');
    }
    
    if (folder.name !== undefined) {
      existingFolder.name = folder.name;
    }
    if (folder.path !== undefined) {
      existingFolder.path = folder.path;
    }
    if (folder.parentId !== undefined) {
      if (folder.parentId === null) {
        existingFolder.parent = null;
      } else {
        const parentFolder = await this.repository.findOne({ where: { id: folder.parentId } });
        if (parentFolder) {
          existingFolder.parent = parentFolder;
        }
      }
    }
    const savedFolder = await this.repository.save(existingFolder);
    return this.transformToIFolder(savedFolder);
  }

  async delete(id: string): Promise<void> {
    const folder = await this.repository.findOne({
      where: { id },
      relations: ['files', 'children']
    });
    if (folder) {
      const files = await folder.files;
      if (files && files.length > 0) {
        await this.fileRepository.remove(files);
      }
      await this.repository.remove(folder);
    }
  }

  async getFolderTree(): Promise<IFolder[]> {
    const trees = await this.repository.findTrees({
      relations: ['files']
    });
    return Promise.all(trees.map(tree => this.transformToIFolder(tree)));
  }

  async findFiles(folderId: string): Promise<IFile[]> {
    const folder = await this.repository.findOne({
      where: { id: folderId },
      relations: ['files']
    });
    return folder?.files || [];
  }
}
