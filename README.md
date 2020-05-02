# Official Mine Little Pony site source code
This is the source code of the site. The site is built with [Parcel 2](https://github.com/parcel-bundler/parcel) using [Pug](https://github.com/pugjs/pug), [Sass](https://github.com/sass/sass) and [TypeScript](https://github.com/microsoft/typescript).

## Recommendations
Recommended OS is Unix-based one (preferably latest Ubuntu release). Used NodeJS version while development is v13.9.x and NPM is v6.14.x (just always use updated software).

## Development
To make changes to the site you'll need [NodeJS](http://nodejs.org/) and NPM. Download the binaries, extract `node` executive to wherever you want and add it to your `PATH` environment variable. Then run `npm i -g npm` using NPM binary shipped with NodeJS to install latest NPM version globally.

Open terminal, go to your projects folder and clone this repo with `git clone https://github.com/keupoz/minelp-site-dev`. Go to the downloaded folder and type `npm i` to install dependencies.

Now you are ready to run the site! Type `npm run dev` to start dev server or `npm run build` to build the site to `dist` folder.

## Data files
Data files are written in JSON format. They are usually used in Pug templates. You can change the files while dev server is running and after a change the site will be automatically rebuilt.

The data is accessed via `data` Pug local. The `data` object respects ierarchy structure of files. Some files have their own global definition.

Also there can be files and folders with the same name (e.g. `cards.json` and `cards/` folder). They are just merged in one object (e.g. `data.cards` will have properties of `cards.json` and files from `cards/` folder).

### Site information
Accessed via `site` Pug local.

```jsonc
{
    // Title pattern for pages. Can be seen in tab name
    "title": "%s - Mine Little Pony",
    // Site name. Can be seen in preview embeds like those ones when you share a link in Discord
    "name": "Mine Little Pony Official site",
    // Canonical URL. For OpenGraph
    "url": "https://minelittlepony-mod.com",
    // Site description. Used for embeds if a page doesn't provide it's own description
    "description": "Official site of Minecraft mod Mine Little Pony that turns player into a pony",
    // Links to use in templates globally
    "links": {
        // Mega.nz archive of old versions of the mod and some historical files
        "megaArchive": "https://mega.nz/#F!NYJQGILa!X70azQPM_psKwpBPW2EleQ",
        // The Discord invite
        "discordInvite": "https://discord.gg/zKSZ8Mg"
    }
}
```

### Site menu
Accessed via `site.menu`.

```jsonc
{
    // Paths must end with /
    "Home": "/",
    "Page 1": "/path/to/page/1/",
    "Page 2": "/path/to/page/2/"
}
```

### FAQ
Accessed via `data.faq`. Properties of FAQ entry are passed to markdown parser, so they do support markdown syntax.

```jsonc
[
    {
        "question": "The question",
        "answer": "The answer"
    }
]
```

### Cards
Cards are accessed via `data.cards`.

#### Icon cards
Pass these cards to `icon-card` Pug mixin:
```pug
+icon-card(data.cards.features[0])
```

```jsonc
[
    {
        "title": "Title of the card",
        "description": "Description of the card",
        // Icon background color
        "color": "red",
        // Image of the card. Images are stored in src/assets/cards/${path}.png
        "image": "type/name",
        // FontAwesome 5 Free icon. Search for icons here: https://fontawesome.com/icons?d=gallery&s=brands,solid&m=free
        // Only solid and brands icons are currently enabled
        "icon": "share-alt"
    }
]
```

#### Link cards
Pass these cards to `link-card` Pug mixin:
```pug
+link-card(data.cards.links[0])
```

```jsonc
[
    {
        // This property was implemented for home page loop of
        // generating link cards to hide a hidden card from very original
        // site source code. Just don't even specifify it until you want
        // to hide a link card on home page
        "hidden": true,
        // Image of the card. Images are stored in src/assets/cards/${path}.png
        "image": "type/name",
        // If you want to create a link card which should download the url,
        // specify this
        "download": true,
        "url": "https://example.com",
        // Color of the title
        "color": "seagreen",
        "title": "Title of the card",
        "description": "Description of the card"
    }
]
```

#### Team cards
Pass these cards to `team-card` Pug mixin:
```pug
+team-card(data.cards.team[0])
```

```jsonc
[
    {
        "name": "Member name",
        "description": "Member role",
        // Optional
        "nickname": "Member Minecraft nickname",
        // src/assets/cards/${path}
        "avatar": "team/avatar.ext",
        // Social links. Optional
        "social": {
            "github": "username",
            "twitter": "username",
            "vk": "username"
        }
    },
]
```

## Pug templates
TODO Complete README
