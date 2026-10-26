# New Tab

A minimal Chrome new-tab page: a clock, Google search, bookmarks, notes, weather, and 67 wallpapers. Each wallpaper is a different color. The shuffle button picks one at random and will not repeat the wallpaper already on screen.

This is for local use. Clone the repo on any computer, load the folder in Chrome, and open a new tab.

## Screenshots

Night

![Night wallpaper with clock, search, and bookmarks](screenshots/night.png)

Day

![Cream day wallpaper](screenshots/day.png)

Soft violet

![Light violet wallpaper, pale in the center and deeper at the edges](screenshots/violet.png)

Grey

![Grey wallpaper, light in the center and darker at the edges](screenshots/grey.png)

## Install on another computer

1. Install [Git](https://git-scm.com/) and Google Chrome.
2. Clone this repo:

```bash
git clone https://github.com/GeeksAdarsh/ChromeExtension-WallpaperTheme.git
```

3. Open Chrome and go to `chrome://extensions`.
4. Turn on **Developer mode**.
5. Click **Load unpacked**.
6. Select the cloned `ChromeExtension-WallpaperTheme` folder. The folder you select must contain `manifest.json`.
7. Open a new tab.

Your name, notes, city, and bookmarks stay in that browser only. A new computer starts empty. The default name is Adarsh. Click the name to change it.

When the files change, open `chrome://extensions` and click the reload icon on **New Tab**.

## How to use it

- **Shuffle** sits at the bottom right. Click it for a random wallpaper. The circle shows only while the pointer is over it. One click never repeats the current color.
- **Search** uses Google. A web address such as `mail.google.com` opens that site.
- **Mail** is the first bookmark. **Add** creates another. **Hide** puts every bookmark away, including Add. **Bookmarks** brings them back.
- **City** is one line of weather. Type a city, then drag the chip. × hides it and keeps the city.
- **Note** is a list. Tick a point when it is done. **Hide** closes the card and keeps the list. × on a point deletes only that point.
- **Focus** leaves the clock, search, and shuffle, and hides the rest. **Exit** brings them back.
- Drag the city chip and the notes card. Near an edge, they snap into the corner.

There are 67 wallpapers: navy, cream, black, mint, rust, peach, teal, cyan, forest, green, orange, terracotta, moon, slate, grey, coffee, ivory, ice, sky, aurora, meadow, amber, gold, plum, lilac, steel, stone, rose, pink, lake, moss, lime, wine, silver, pearl, olive, yellow, indigo, violet, and 15 different greys, including Graphite, Storm, Concrete, and Soot.

## Files

| File | Purpose |
| --- | --- |
| `manifest.json` | Chrome extension manifest |
| `newtab.html` | New tab page |
| `app.js` | Clock, search, bookmarks, notes, weather, wallpapers |
| `style.css` | New tab styles |
| `background.js` | Opens the guide from the toolbar icon |
| `extension.html` | Short guide and version log |
| `icons/` | Extension icons |

Weather uses [Open-Meteo](https://open-meteo.com/). The city you type is sent there to fetch the temperature. Notes, bookmarks, and your name stay in the browser.
