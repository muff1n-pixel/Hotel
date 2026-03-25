import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebHomeShopPageModel } from '../../Models/Web/Home/Shop/Page/WebHomeShopPageModel';
import sizeOf from 'image-size';
import { WebHomeItemModel } from '../../Models/Web/Home/Item/WebHomeItemModel';
import { WebHomeShopPageItemModel } from '../../Models/Web/Home/Shop/Item/WebHomeShopPageItem';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type PageItem = {
    id: string;
    name: string;
    description?: string;
};

const categories = ['backgrounds', 'stickers', 'notes', 'widgets'];

const IMAGE_EXTENSIONS = [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.webp',
    '.svg',
    '.bmp',
    '.tiff',
    '.ico',
    '.avif'
];

async function scanDir(
    dir: string,
    parentId: string | null = null
): Promise<void> {
    try {
        let data: PageItem[] = [];

        try {
            const jsonPath = path.join(dir, 'data.json');
            data = await readJson(jsonPath);
        } catch {
        }

        const elements = await readdir(dir, { withFileTypes: true });

        for (const element of elements) {
            if (element.isDirectory()) {

                const fullPath = path.join(dir, element.name);
                const folderName = element.name;
                
                const pageData = data.find(item => item.id === folderName);

                await WebHomeShopPageModel.findOrCreate({
                    where: { id: folderName },
                    defaults: {
                        id: folderName,
                        parentId: parentId,
                        title: pageData ? pageData.name : folderName,
                        description: pageData?.description ?? null
                    }
                });

                await scanDir(fullPath, folderName);
            } else if (element.isFile()) {
                const fullPath = path.join(dir, element.name);

                const ext = path.extname(element.name).toLowerCase();

                if (!IMAGE_EXTENSIONS.includes(ext)) continue;

                const nameWithoutExt = path.basename(element.name, ext);

                let width: number | null = null;
                let height: number | null = null;

                try {
                    const buffer = await readFile(fullPath);
                    const dimensions = sizeOf(buffer);

                    width = dimensions.width ?? null;
                    height = dimensions.height ?? null;

                } catch (e) {
                    console.log('Error reading image:', fullPath);
                }

                const fileData = data.find(item => item.id === nameWithoutExt);

                try {
                    await WebHomeItemModel.findOrCreate({
                        where: { id: `${parentId}_${nameWithoutExt}` },
                        defaults: {
                            id: `${parentId}_${nameWithoutExt}`,
                            title: fileData ? fileData.name : nameWithoutExt,
                            description: fileData?.description ?? null,
                            type: fullPath
                                .split(path.sep)
                                .find(part => categories.includes(part)) ?? null,
                            image: (parentId != null && categories.includes(parentId)) ? element.name : `${parentId}/${element.name}`,
                            width: (parentId === 'widgets' || parentId === 'notes') ? 0 : width,
                            height: (parentId === 'widgets' || parentId === 'notes') ? 0 : height
                        }
                    });

                    if (parentId !== 'widgets') {
                        await WebHomeShopPageItemModel.findOrCreate({
                            where: {
                                itemId: `${parentId}_${nameWithoutExt}`
                            },
                            defaults: {
                                id: randomUUID(),
                                credits: Math.random() < 1/20 ? 0 : Math.floor(Math.random() * 10) + 1,
                                duckets: Math.random() < 1/3 ? Math.floor(Math.random() * 10) + 1 : 0,
                                diamonds: Math.random() < 1/10 ? Math.floor(Math.random() * 10) + 1 : 0,
                                itemId: `${parentId}_${nameWithoutExt}`,
                                shopPageId: parentId
                            }
                        })
                    }
                }
                catch (err) {
                    throw err;
                }
            }
        }

    } catch (err: unknown) {
        if (err instanceof Error) {
            throw err;
        }

        throw new Error(String(err));
    }
}

async function readJson(path: string): Promise<any> {
    try {
        const data = await readFile(path, 'utf-8');
        return JSON.parse(data);

    } catch (err: any) {
        if (err.code === 'ENOENT') {
            throw new Error('File not found');
        } else {
            throw new Error(`Error reading JSON: ${err.message}`);
        }
    }
}

async function homeInitialize() {
    const basePath = path.resolve(__dirname, '../../../../../../assets/home');

    let rootData: PageItem[] = [];
    try {
        rootData = await readJson(path.join(basePath, 'data.json'));
    } catch {
    }

    const elements = await readdir(basePath, { withFileTypes: true });

    for (const element of elements) {
        if (!element.isDirectory()) continue;

        if (!categories.includes(element.name)) continue;

        const fullPath = path.join(basePath, element.name);

        const pageData = rootData.find(item => item.id === element.name);

        await WebHomeShopPageModel.findOrCreate({
            where: { id: element.name },
            defaults: {
                id: element.name,
                parentId: null,
                title: pageData ? pageData.name : element.name,
                description: pageData?.description ?? null
            }
        });

        await scanDir(fullPath, element.name);
    }
}

export default homeInitialize;