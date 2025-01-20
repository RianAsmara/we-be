import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm"
import { Folder } from "./Folder"

@Entity()
export class File {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({ type: "varchar" })
    name!: string

    @Column({ type: "varchar" })
    type!: string

    @Column({ type: "int" })
    size!: number

    @Column({ type: "varchar" })
    path!: string

    @Column({ type: "uuid" })
    folderId!: string

    @ManyToOne(() => Folder, (folder) => folder.files, { lazy: true })
    folder!: Promise<Folder>

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date
}
