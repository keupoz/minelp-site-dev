import { querySelector } from "../utils/utils";
import { getContext, initInput, LOG2, pixelate, save } from "./utils";

export let loadResizer: (image: CanvasImageSource, name: string) => void = () => { };

function getExponent(n: number) {
    n >>= 6;
    return n ? Math.floor(Math.log(n + 0.5) / LOG2) : 0;
}

export function initResizer() {
    const ctx = getContext(querySelector(".resizer--output", HTMLCanvasElement)),
        original = getContext(),
        pixels = getContext();

    const $size = querySelector(".resizer--size", HTMLInputElement),
        $size_current = querySelector(".resizer--size__current", HTMLSpanElement),
        $download = querySelector(".resizer--download", HTMLButtonElement);

    let filename = "";

    pixels.canvas.width = 4;
    pixels.canvas.width = 2;

    function loadImage(img: CanvasImageSource) {
        if (img instanceof SVGImageElement) throw new TypeError("SVG is not accepted");

        ctx.canvas.width = original.canvas.width = img.width;
        ctx.canvas.height = original.canvas.height = img.height;

        $size.value = getExponent(ctx.canvas.width).toString();
        $size_current.innerText = `${ctx.canvas.width} x ${ctx.canvas.height}`;

        ctx.drawImage(img, 0, 0);
        original.drawImage(img, 0, 0);

        original.clearRect(0, 0, 4, 2);
        pixels.clearRect(0, 0, 4, 2);
        pixels.drawImage(img, 0, 0, 4, 2, 0, 0, 4, 2);

        ctx.canvas.classList.remove("empty");
        $size.disabled = $download.disabled = false;
    }

    initInput(".resizer--input", loadImage, (name) => filename = name);

    $size.addEventListener("input", function () {
        const value = +this.value;

        ctx.canvas.width = 64 << value;

        if (original.canvas.width == original.canvas.height) ctx.canvas.height = ctx.canvas.width;
        else ctx.canvas.height = 32 << value;

        $size_current.innerText = `${ctx.canvas.width} x ${ctx.canvas.height}`;

        pixelate(ctx);

        ctx.drawImage(original.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(pixels.canvas, 0, 0);
    });

    $download.addEventListener("click", function () {
        save(ctx.canvas, filename, `x${ctx.canvas.width}`);
    });

    loadResizer = (image, name) => {
        loadImage(image);
        filename = name;
    };
}
