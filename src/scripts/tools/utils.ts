import { saveAs } from "file-saver";
import { querySelector } from "../utils/utils";

export const LOG2 = Math.log(2);
export const SKINS_PATH = "https://keupoz.herokuapp.com/ponyskins/valhalla/%s";

export function getContext(canvas = document.createElement("canvas")) {
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Could'nt get canvas context");

    return ctx;
}

export function initInput(selector: string, loadImage: (img: CanvasImageSource) => void, setFileName: (name: string) => void) {
    const input = querySelector(selector, HTMLInputElement);

    input.addEventListener("change", function () {
        const files = this.files;

        if (!files) throw new Error("No file list");

        const file = files[0];

        if (!file) throw new Error("No file");

        setFileName(file.name);

        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(img.src);
            loadImage(img);
        };
        img.src = URL.createObjectURL(file);
    });
}

export function pixelate(ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = false;
}

export function clear(ctx: CanvasRenderingContext2D, s: number, x: number, y: number, w: number, h: number) {
    ctx.clearRect(x * s, y * s, w * s, h * s);
}

export function translate(ctx: CanvasRenderingContext2D, s: number, x: number, y: number) {
    ctx.translate(x * s, y * s);
}

export function drawImage(ctx: CanvasRenderingContext2D, img: CanvasImageSource, s: number, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number) {
    ctx.drawImage(img, sx * s, sy * s, sw * s, sh * s, dx * s, dy * s, dw * s, dh * s);
}

export function readAsText(blob: Blob, callback: (reader: FileReader, result: string) => void) {
    const F = new FileReader();
    F.onload = () => {
        callback(F, F.result as string);
    };
    F.readAsText(blob);
}

export function save(canvas: HTMLCanvasElement, filename: string, suffix: string) {
    canvas.toBlob((blob) => {
        if (!blob) throw new Error("No blob from canvas");
        saveAs(blob, filename.replace(/\.png$/, `_${suffix}.png`));
    });
}
