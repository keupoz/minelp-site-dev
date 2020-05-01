const { readFileSync } = require("fs");
const { join: joinPath, parse: parsePath } = require("path");

const chokidar = require("chokidar");
const glob = require("glob");
const MarkdownIt = require("markdown-it");
const touch = require("touch");
const { parse: parseYaml } = require("yaml");


const ICONS = {};

{
    const iconsPath = require.resolve("@fortawesome/fontawesome-free/metadata/icons.yml");
    const iconsYaml = readFileSync(iconsPath, { encoding: "utf-8" });
    const iconsParsed = parseYaml(iconsYaml);

    Object.keys(iconsParsed).forEach((name) => {
        if (Array.prototype.includes.call(iconsParsed[name].styles, "solid")) {
            ICONS[name] = `&#x${iconsParsed[name].unicode};`;
        }
    });
}

const DATA = {};

const DATA_CACHE = {};

/** @param {string} path */
function processJson(path) {
    const jsonFile = readFileSync(`./data/${path}`, { encoding: "utf-8" });
    const json = JSON.parse(jsonFile);
    const parsed = parsePath(path);

    const updated = { path: "DATA", object: null };

    joinPath(parsed.dir, parsed.name).split("/").reduce((prev, curr, index, arr) => {
        if (index == arr.length - 1) {
            if (DATA_CACHE[path]) {
                Object.keys(DATA_CACHE[path]).forEach((key) => {
                    delete prev[curr][key];
                });
            }

            prev[curr] = Object.assign(prev[curr] || {}, json);
            updated.object = prev[curr];
        } else {
            prev[curr] = prev[curr] || {};
        }

        updated.path += `.${curr}`;
        return prev[curr];
    }, DATA);

    DATA_CACHE[path] = json;

    return updated;
}

/** @param {string} path */
function deleteObject(path) {
    const parsed = parsePath(path);

    let objectPath = "DATA";

    joinPath(parsed.dir, parsed.name).split("/").reduce((prev, curr, index, arr) => {
        if (index == arr.length - 1) {
            if (DATA_CACHE[path]) {
                Object.keys(DATA_CACHE[path]).forEach((key) => {
                    delete prev[curr][key];
                });

                if (!Object.keys(prev[curr]).length) {
                    delete prev[curr];
                }
            }
        }

        objectPath += `.${curr}`;
        return prev[curr];
    }, DATA);

    delete DATA_CACHE[path];

    return objectPath;
}

glob.sync("**/*.json", { cwd: "data" }).forEach((path) => {
    processJson(path);
});

if (process.env.NODE_ENV !== "production") {
    /** @param {string} path */
    const update = (path) => {
        const updated = processJson(path);

        if (process.env.NODE_ENV == "debug") {
            console.log(`Updated object "${updated.path}":`, updated.object);
        }

        touch("./src/layout.pug", { nocreate: true });
    };

    const watcher = chokidar.watch("**/*.json", {
        cwd: "data",
        awaitWriteFinish: true,
        ignoreInitial: true
    });

    watcher
        .on("add", update)
        .on("change", update)
        .on("unlink", (path) => {
            const deletedPath = deleteObject(path);

            if (process.env.NODE_ENV == "debug") {
                console.log(`Deleted object "${deletedPath}"`);
                console.log("New DATA object:", DATA);
            }

            touch("./src/layout.pug", { nocreate: true });
        });
}

const SITE = DATA.site;
SITE.menu = DATA.menu;

const md = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true
});

md.use(require("markdown-it-attrs"));

md.use(require("markdown-it-anchor"), {
    permalink: true,
    permalinkBefore: true,
    permalinkSymbol: "§"
});

md.use(require("markdown-it-toc-done-right"), {
    listType: "ul"
});

/** @param {string} text */
function markdown(text) {
    return md.render(text);
}

module.exports = {
    locals: {
        markdown,

        dev: process.env.NODE_ENV !== "production",
        currentYear: new Date().getFullYear(),

        menuEntry: null,
        css: null,
        js: null,

        icons: ICONS,
        site: SITE,
        data: DATA
    },
    filters: {
        markdown
    }
};
