import { querySelector } from "../utils/utils";
import { convert2new } from "./converters";
import { loadResizer } from "./initResizer";
import { getContext, initInput, save } from "./utils";

export let loadConverter: (image: CanvasImageSource, name: string) => void = () => { };

function isBasic(ctx: CanvasRenderingContext2D) {
    const s = ctx.canvas.width / 64;

    for (let x = 4 * s; x < 8 * s; x++) {
        for (let y = 0; y < 8 * s; y++) {
            if (ctx.getImageData(x, y, 1, 1).data.slice(0, 3).join(",") != "0,0,0") return false;
        }
    }

    return true;
}

export function initConverter() {
    const holder = getContext(),
        ctx = getContext(querySelector(".converter--output", HTMLCanvasElement)),
        original = getContext();

    const $mirror = querySelector(".converter--mirror", HTMLInputElement),
        $download = querySelector(".converter--download", HTMLButtonElement),
        $resize = querySelector(".converter--resize", HTMLAnchorElement);

    let filename = "",
        basic = false;

    function loadImage(img: CanvasImageSource) {
        if (img instanceof SVGImageElement) throw new TypeError("SVG is not accepted");

        ctx.canvas.width = original.canvas.width = img.width;
        ctx.canvas.height = original.canvas.height = img.height;

        ctx.drawImage(img, 0, 0);
        original.drawImage(img, 0, 0);

        basic = isBasic(ctx);

        ctx.canvas.classList.remove("empty");
        $resize.removeAttribute("disabled");
        $mirror.disabled = $download.disabled = false;
        $mirror.checked = true;

        convert2new(holder, original, ctx, $mirror.disabled, basic);
    }

    initInput(".converter--input", loadImage, (name) => filename = name);

    $mirror.addEventListener("change", function () {
        convert2new(holder, original, ctx, this.checked, basic);
    });

    $download.addEventListener("click", () => {
        save(ctx.canvas, filename, "mirror");
    });

    $resize.addEventListener("click", () => {
        loadResizer(ctx.canvas, filename);
    });

    loadConverter = (image, name) => {
        loadImage(image);
        filename = name;
    };
}
