import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, Tree, TreeChildren, TreeParent } from "typeorm"
import { File } from "./File"

@Entity()
@Tree("materialized-path")
export class Folder {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({ type: "varchar" })
    name!: string

    @Column({ type: "varchar", nullable: true })
    description!: string

    @Column({ type: "varchar", unique: true })
    path!: string

    @Column({ type: "varchar", nullable: true })
    parentId!: string | null;

    @TreeParent()
    parent!: Folder | null

    @TreeChildren()
    children!: Folder[]

    @OneToMany(() => File, (file) => file.folder, { lazy: true })
    files!: Promise<File[]>

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date
}
