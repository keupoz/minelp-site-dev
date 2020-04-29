const { readFileSync } = require("fs");
const { join: joinPath, parse: parsePath } = require("path");

const glob = require("glob");
const MarkdownIt = require("markdown-it");
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

glob.sync("**/*.json", { cwd: "data" }).forEach((path) => {
    const json = require(`./data/${path}`);
    const parsed = parsePath(path);

    joinPath(parsed.dir, parsed.name).split("/").reduce((prev, curr) => {
        prev[curr] = Object.assign(prev[curr] || {}, json);
        return prev[curr];
    }, DATA);
});

const SITE = DATA.site;
SITE.menu = DATA.menu;

delete DATA.site;
delete DATA.menu;

const md = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true
});

md.use(require("markdown-it-attrs"));
md.use(require("markdown-it-anchor"));
md.use(require("markdown-it-toc-done-right"));

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
