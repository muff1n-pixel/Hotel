import { Jimp, intToRGBA, rgbaToInt, type JimpInstance } from "jimp";
import { existsSync } from "fs";
import path from "path";

type RGBA = [number, number, number, number];

type JimpImage = Awaited<ReturnType<typeof Jimp.read>> | JimpInstance;

function getRGBA(img: JimpImage, x: number, y: number): RGBA {
    const { r, g, b, a } = intToRGBA(img.getPixelColor(x, y));
    return [r, g, b, a];
}

function setRGBA(img: JimpImage, x: number, y: number, pixel: RGBA) {
    img.setPixelColor(rgbaToInt(...pixel), x, y);
}

function pixelKey(p: RGBA): string {
    return `${p[0]},${p[1]},${p[2]},${p[3]}`;
}

function mostCommon(pixels: RGBA[]): RGBA {
    const counts = new Map<string, { pixel: RGBA; count: number }>();
    for (const p of pixels) {
        const key = pixelKey(p);
        const entry = counts.get(key);
        if (entry) {
            entry.count++;
        } else {
            counts.set(key, { pixel: p, count: 1 });
        }
    }

    let best: { pixel: RGBA; count: number } | undefined;
    for (const entry of counts.values()) {
        if (!best || entry.count > best.count) {
            best = entry;
        }
    }

    return best!.pixel;
}

function trimTransparentEdges(img: JimpImage): JimpImage {
    img.autocrop();
    return img;
}

function padEven(img: JimpImage): JimpImage {
    const w = img.width;
    const h = img.height;

    const newW = w + (w % 2);
    const newH = h + (h % 2);

    if (newW === w && newH === h) return img;
    const padded = new Jimp({
        width: newW,
        height: newH,
        color: 0x00000000,
    });

    padded.composite(img, 0, 0);
    return padded;
}

function getOutlineColorFromEdges(img: JimpImage): RGBA | null {
    const w = img.width;
    const h = img.height;
    const edgePixels: RGBA[] = [];

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const p = getRGBA(img, x, y);
            if (p[3] === 0) continue;

            const borderEdges: [number, number][] = [
                [x - 1, y],
                [x + 1, y],
                [x, y - 1],
                [x, y + 1],
            ];

            const bordersTransparent = borderEdges.some(([nx, ny]) => {
                if (nx < 0 || nx >= w || ny < 0 || ny >= h) return true;
                return getRGBA(img, nx, ny)[3] === 0;
            });

            if (bordersTransparent) {
                edgePixels.push(p);
            }
        }
    }

    return edgePixels.length > 0 ? mostCommon(edgePixels) : null;
}

function getDarkColors(
    img: JimpImage,
    mainThreshold = 100,
    innerThreshold = 175
): [RGBA | null, RGBA | null] {
    const w = img.width;
    const h = img.height;
    const darkPixels: RGBA[] = [];
    const lightDarkPixels: RGBA[] = [];

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const p = getRGBA(img, x, y);
            if (p[3] === 0) continue;

            const lum = p[0] + p[1] + p[2];
            if (lum < mainThreshold) darkPixels.push(p);
            else if (lum < innerThreshold) lightDarkPixels.push(p);
        }
    }

    return [
        darkPixels.length > 0 ? mostCommon(darkPixels) : null,
        lightDarkPixels.length > 0 ? mostCommon(lightDarkPixels) : null,
    ];
}

export async function downscalePixelArt(
    inputPath: string,
    outputPath: string
): Promise<void> {
    let img: JimpImage = await Jimp.read(inputPath);

    img = trimTransparentEdges(img);
    img = padEven(img);

    const w = img.width;
    const h = img.height;

    const outlineColor = getOutlineColorFromEdges(img);
    const [mainOutline, innerOutline] = getDarkColors(img);

    const outlineKey = outlineColor ? pixelKey(outlineColor) : null;
    const mainKey = mainOutline ? pixelKey(mainOutline) : null;
    const innerKey = innerOutline ? pixelKey(innerOutline) : null;

    const result = new Jimp({
        width: w / 2,
        height: h / 2,
        color: 0x00000000,
    });

    for (let y = 0; y < h; y += 2) {
        for (let x = 0; x < w; x += 2) {
            const block: RGBA[] = [
                getRGBA(img, x, y),
                getRGBA(img, x + 1, y),
                getRGBA(img, x, y + 1),
                getRGBA(img, x + 1, y + 1),
            ];

            const nonTransparent = block.filter((p) => p[3] !== 0);

            let chosen: RGBA;

            if (nonTransparent.length === 0) {
                chosen = [0, 0, 0, 0];
            } else if (outlineKey && nonTransparent.filter(p => pixelKey(p) === outlineKey).length >= 2) {
                chosen = outlineColor!;
            } else if (mainKey && nonTransparent.filter(p => pixelKey(p) === mainKey).length >= 2) {
                chosen = mainOutline!;
            } else if (innerKey && nonTransparent.filter(p => pixelKey(p) === innerKey).length >= 2) {
                chosen = innerOutline!;
            } else {
                chosen = mostCommon(nonTransparent);
            }

            setRGBA(result, x / 2, y / 2, chosen);
        }
    }

    await result.write(outputPath as `${string}.${string}`);
}

export async function downscaleIfNeeded(imgPath: string): Promise<string> {
    const basename = path.basename(imgPath, ".png");

    if (!basename.includes("_64")) {
        return imgPath;
    }

    const dir = path.dirname(imgPath);
    const downscaledBasename = basename.replace("_64", "_32");
    const downscaledPath = path.join(dir, `${downscaledBasename}.png`);

    if (existsSync(downscaledPath)) {
        return downscaledPath;
    }

    try {
        await downscalePixelArt(imgPath, downscaledPath);
        return downscaledPath;
    } catch (err) {
        console.error(`Failed to downscale ${imgPath}:`, err);
        console.warn(`Falling back to original high-res image: ${imgPath}`);
        return imgPath;
    }
}