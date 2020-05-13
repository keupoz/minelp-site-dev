import BAT_EASTER_SRC from "url:~/src/assets/pages/home/bat_easter.svg";
import { konami } from "./utils/konami";
import { querySelector } from "./utils/utils";

try {
    const $intro = querySelector(".intro", HTMLDivElement);

    konami(() => {
        $intro.style.backgroundImage = `url(${BAT_EASTER_SRC})`;
    });
} catch (err) {
    console.warn("Couldn't initialize some features: ", err);
}
