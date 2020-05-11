import { konami } from "./utils/konami";
import { querySelector } from "./utils/utils";

try {
    const img = querySelector(".bat-secret", HTMLImageElement);
    const BAT_EASTER_SRC = img.src;
    const $intro = querySelector(".intro", HTMLDivElement);

    img.remove();

    konami(() => {
        $intro.style.backgroundImage = `url(${BAT_EASTER_SRC})`;
    });
} catch (err) {
    console.warn("Couldn't initialize some features: ", err);
}
