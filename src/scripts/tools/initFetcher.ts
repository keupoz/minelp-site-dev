import { querySelector } from "../utils/utils";
import { ResponseDecoder } from "./fetchValidator";
import { loadConverter } from "./initConverter";
import { loadResizer } from "./initResizer";
import { getContext, readAsText, SKINS_PATH } from "./utils";

export function initFetcher() {
    const ctx = getContext();

    const $form = querySelector(".fetcher--form", HTMLFormElement),
        $submit = querySelector(".fetcher--submit", HTMLButtonElement),
        $input = querySelector(".fetcher--input", HTMLInputElement),
        $output = querySelector(".fetcher--output", HTMLImageElement),
        $progress = querySelector(".fetcher--progress", HTMLDivElement),
        $error = querySelector(".fetcher--error", HTMLParagraphElement);

    const $convert = querySelector(".fetcher--convert", HTMLAnchorElement),
        $resize = querySelector(".fetcher--resize", HTMLAnchorElement);

    let busy = false,
        blob: Blob | null = null,
        filename = "";

    $output.addEventListener("load", function () {
        busy = $submit.disabled = false;
        $progress.classList.remove("show");

        ctx.canvas.width = this.naturalWidth;
        ctx.canvas.height = this.naturalHeight;

        ctx.drawImage(this, 0, 0);

        $convert.removeAttribute("disabled");
        $resize.removeAttribute("disabled");
    });

    $output.addEventListener("click", () => {
        if (blob) saveAs(blob, filename);
    });

    function processResult(this: XMLHttpRequest) {
        if (this.status == 200) {
            blob = this.response;
            filename = `${this.getResponseHeader("X-Nickname") || Date.now()}.png`;
            URL.revokeObjectURL($output.src);
            $output.src = URL.createObjectURL(blob);
            $error.innerText = "";
        } else readAsText(this.response, (_, result) => {
            const response = ResponseDecoder.runWithException(JSON.parse(result));

            $error.innerText = response.error;
            busy = $submit.disabled = false;
            $progress.classList.remove("show");
        });
    }

    $form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (busy) return;

        const nickname = $input.value.trim();

        if (!nickname) {
            $error.innerText = "Nickname required";
            return;
        }

        busy = $submit.disabled = true;
        $progress.style.width = "0px";
        $progress.classList.add("show");

        $input.blur();

        const xhr = new XMLHttpRequest();

        xhr.open("GET", SKINS_PATH.replace("%s", nickname));
        xhr.responseType = "blob";

        xhr.onprogress = (e) => {
            $progress.style.width = `${e.loaded / e.total * 100}%`;
        };
        xhr.onload = xhr.onerror = processResult;
        xhr.send();
    });

    $convert.addEventListener("click", function () {
        loadConverter(ctx.canvas, filename);
    });

    $resize.addEventListener("click", function () {
        loadResizer(ctx.canvas, filename);
    });
}
