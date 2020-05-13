enum KEYS {
    LEFT = 37,
    UP = 38,
    RIGHT = 39,
    DOWN = 40,
    A = 65,
    B = 66
}

const KONAMI_CODE: KEYS[] = [
    KEYS.UP, KEYS.UP,
    KEYS.DOWN, KEYS.DOWN,
    KEYS.LEFT, KEYS.RIGHT,
    KEYS.LEFT, KEYS.RIGHT,
    KEYS.B, KEYS.A
];

export function konami(callback: () => void) {
    let codePosition = 0;

    document.addEventListener("keydown", (e) => {
        if (e.keyCode !== KONAMI_CODE[codePosition]) codePosition = 0;
        else {
            codePosition++;

            if (codePosition == KONAMI_CODE.length) {
                callback();
                codePosition = 0;
            }
        }
    });
}
