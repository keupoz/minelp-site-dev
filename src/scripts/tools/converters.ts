import { clear, drawImage, translate } from "./utils";

export function convert2pre18(original: CanvasRenderingContext2D, output: CanvasRenderingContext2D) {
    const s = original.canvas.width / 64;

    // Clear areas
    clear(output, s, 1, 3, 2, 1);    // horn top & bottom
    clear(output, s, 0, 4, 4, 4);    // horn others
    clear(output, s, 4, 0, 4, 8);    // cutiemark
    clear(output, s, 56, 0, 8, 8);   // stomach
    clear(output, s, 0, 16, 12, 4);  // neck and legs top & bottom
    clear(output, s, 0, 20, 16, 12); // legs others
    clear(output, s, 36, 16, 8, 4);  // butt
    clear(output, s, 32, 20, 8, 12); // back


    // Horn
    drawImage(output, original.canvas, s, 57, 0, 2, 1, 1, 3, 2, 1); // top & bottom
    drawImage(output, original.canvas, s, 56, 1, 4, 4, 0, 4, 4, 4); // others

    // Cutiemark
    drawImage(output, original.canvas, s, 0, 20, 4, 8, 4, 0, 4, 8);

    // Neck
    drawImage(output, original.canvas, s, 24, 0, 4, 4, 0, 16, 4, 4);

    // Hind legs
    drawImage(output, original.canvas, s, 44, 16, 8, 4, 4, 16, 8, 4); // top & bottom
    drawImage(output, original.canvas, s, 40, 20, 16, 12, 0, 20, 16, 12); // others

    // Stomach and butt
    output.save();
    translate(output, s, 56, 8);
    output.scale(1, -1);
    drawImage(output, original.canvas, s, 24, 0, 8, 8, 0, 0, 8, 8);
    drawImage(output, original.canvas, s, 24, 0, 8, 4, -20, -12, 8, 4);
    output.restore();

    // Back
    output.save();
    translate(output, s, 40, 32);
    output.rotate(Math.PI);
    drawImage(output, original.canvas, s, 24, 0, 8, 4, 0, 0, 8, 4);
    drawImage(output, original.canvas, s, 24, 0, 8, 8, 0, 4, 8, 8);
    output.restore();
}

export function convert2new(holder: CanvasRenderingContext2D, original: CanvasRenderingContext2D, output: CanvasRenderingContext2D, mirror: boolean, basic: boolean) {
    if (basic) {
        convert2pre18(original, output);

        holder.canvas.width = holder.canvas.height = original.canvas.width;
        holder.drawImage(output.canvas, 0, 0);
        original = holder;
    }

    const s = output.canvas.width / 64;

    output.canvas.width = output.canvas.height = original.canvas.width;

    output.drawImage(original.canvas, 0, 0);

    // Clear areas
    // Left hind leg
    clear(output, s, 20, 48, 8, 4); // top & bottom
    clear(output, s, 16, 52, 16, 12); // other sides

    // Left foreleg
    clear(output, s, 36, 48, 8, 4); // top & bottom
    clear(output, s, 32, 52, 16, 12); // outside

    // Left wing
    clear(output, s, 58, 32, 4, 2); // top & bottom
    clear(output, s, 56, 34, 8, 14); // others

    if (mirror) {
        output.save();
        output.scale(-1, 1);
        // Left hind leg
        drawImage(output, original.canvas, s, 4, 16, 4, 4, -20, 48, -4, 4); // top
        drawImage(output, original.canvas, s, 8, 16, 4, 4, -24, 48, -4, 4); // bottom
        drawImage(output, original.canvas, s, 0, 20, 4, 12, -24, 52, -4, 12); // outside
        drawImage(output, original.canvas, s, 4, 20, 4, 12, -20, 52, -4, 12); // front
        drawImage(output, original.canvas, s, 8, 20, 4, 12, -16, 52, -4, 12); // inside
        drawImage(output, original.canvas, s, 12, 20, 4, 12, -28, 52, -4, 12); // back

        // Left foreleg
        drawImage(output, original.canvas, s, 44, 16, 4, 4, -36, 48, -4, 4); // top
        drawImage(output, original.canvas, s, 48, 16, 4, 4, -40, 48, -4, 4); // bottom
        drawImage(output, original.canvas, s, 40, 20, 4, 12, -40, 52, -4, 12); // outside
        drawImage(output, original.canvas, s, 44, 20, 4, 12, -36, 52, -4, 12); // front
        drawImage(output, original.canvas, s, 48, 20, 4, 12, -32, 52, -4, 12); // inside
        drawImage(output, original.canvas, s, 52, 20, 4, 12, -44, 52, -4, 12); // back

        // Left wing
        drawImage(output, original.canvas, s, 58, 16, 2, 2, -58, 32, -2, 2); // top
        drawImage(output, original.canvas, s, 60, 16, 2, 2, -60, 32, -2, 2); // bottom
        drawImage(output, original.canvas, s, 56, 18, 2, 14, -60, 34, -2, 14); // outside
        drawImage(output, original.canvas, s, 58, 18, 2, 14, -58, 34, -2, 14); // front
        drawImage(output, original.canvas, s, 60, 18, 2, 14, -56, 34, -2, 14); // inside
        drawImage(output, original.canvas, s, 62, 18, 2, 14, -62, 34, -2, 14); // back
        output.restore();
    } else {
        // Left hind leg
        drawImage(output, original.canvas, s, 4, 16, 8, 4, 20, 48, 8, 4); // top & bottom
        drawImage(output, original.canvas, s, 0, 20, 16, 12, 16, 52, 16, 12); // other sides

        // Left foreleg
        drawImage(output, original.canvas, s, 44, 16, 8, 4, 36, 48, 8, 4); // top & bottom
        drawImage(output, original.canvas, s, 40, 20, 16, 12, 32, 52, 16, 12); // outside

        // Left wing
        drawImage(output, original.canvas, s, 58, 16, 4, 2, 58, 32, 4, 2); // top & bottom
        drawImage(output, original.canvas, s, 56, 18, 8, 14, 56, 34, 8, 14); // others
    }
}
