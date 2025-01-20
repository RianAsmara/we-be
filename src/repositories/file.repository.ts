import { DataSource, Repository } from 'typeorm';
import { File } from '../entities/File';

export class FileRepository {
    private repository: Repository<File>;

    constructor(private dataSource: DataSource) {
        this.repository = dataSource.getRepository(File);
    }

    async findByFolderId(folderId: string): Promise<File[]> {
        return this.repository.find({
            where: { folder: { id: folderId } },
            relations: ['folder']
        });
    }

    async create(file: Partial<File>): Promise<File> {
        const newFile = this.repository.create(file);
        return this.repository.save(newFile);
    }

    async update(id: string, file: Partial<File>): Promise<File | null> {
        const existingFile = await this.repository.findOne({ where: { id } });
        if (!existingFile) return null;

        Object.assign(existingFile, file);
        return this.repository.save(existingFile);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
