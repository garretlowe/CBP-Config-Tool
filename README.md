# FO4 CBP Config Tool

Hosted at: [garretlowe.github.io/cbp-config-tool](https://garretlowe.github.io/cbp-config-tool/index)

## About

This applet parses two CBP configuration files for Fallout 4 and creates an interpolated config file based on weighted input from the original files. The base configuration files for [CBP Physics for Fallout 4](https://www.nexusmods.com/fallout4/mods/39088) are far too extreme for my taste and I desired the ability to customize configuration without changing single values and re-launching the game to verify.

## Before Using

The tool makes the assumption that both configuration file inputs have matching headers/categories. This means that if one configuration file has:
```
[Attach]
LButtFat_skin=Butt
```
Then the second configuration file should have `LButtFat_skin` set to the same value, `Butt`. This was done to simplify the creation of the tool and may be changed in the future, but as of know, this is how it works.

I'll also warn you that the tool will not preserve any comments (lines starting with ";") from the input configuration files. This is again to simplify creation but will almost definitely not be changed in the future as preserving comment placement between two files sounds like a headache and you probably don't even want to do that.

## Instructions

Using the tool is fairly easy. Simply upload two configuration files, modify the inheritance ratio to your preference, click "Generate Config", then  "Download Interpolated Config". 

A `cbp.ini` file will be downloaded to your system which you can then move to the `/Fallout4/F4SE/Plugins/` folder on your machine. 

Alternatively, if you use a mod manager, you can create a folder called `Plugins` and place the `cbp.ini` file inside, then create a folder called `F4SE` and place the `Plugins` folder inside, then right click the `F4SE` folder and select `Send to > Compressed (zipped) folder` and manually import the newly created `F4SE.zip` into your mod manager of choice, rename accordingly.