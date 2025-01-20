export interface IFolder {
  id: string;
  name: string;
  path: string;
  parentId: string | null;
  children: IFolder[];
  files: IFile[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IFile {
  id: string;
  name: string;
  path: string;
  folderId: string;
  size: number;
  mimeType?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFolderRepository {
  findById(id: string): Promise<IFolder | null>;
  findByPath(path: string): Promise<IFolder | null>;
  findChildren(folderId: string): Promise<IFolder[]>;
  findFiles(folderId: string): Promise<IFile[]>;
  getRootFolders(): Promise<IFolder[]>;
  create(folder: Omit<IFolder, 'id' | 'createdAt' | 'updatedAt'>): Promise<IFolder>;
  update(id: string, folder: Partial<IFolder>): Promise<IFolder>;
  delete(id: string): Promise<void>;
}

export interface IFileRepository {
  findById(id: string): Promise<IFile | null>;
  findByPath(path: string): Promise<IFile | null>;
  create(file: Omit<IFile, 'id' | 'createdAt' | 'updatedAt'>): Promise<IFile>;
  update(id: string, file: Partial<IFile>): Promise<IFile>;
  delete(id: string): Promise<void>;
}
