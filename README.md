[![Supported Foundry Versions](https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https://github.com/paulo-roger/flying-tokens/releases/latest/download/module.json)](https://foundryvtt.com/packages/flying-tokens) [![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fflying-tokens&colorB=0374b5)](https://forge-vtt.com/bazaar#sort=updated&package=flying-tokens)  
[![Latest Downloads](https://img.shields.io/github/downloads/paulo-roger/flying-tokens/latest/module.zip?color=blue&label=latest%20downloads)](https://github.com/paulo-roger/flying-tokens/releases/latest) [![Total Downloads](https://img.shields.io/github/downloads/paulo-roger/flying-tokens/module.zip?color=blue&label=total%20downloads)](https://github.com/paulo-roger/flying-tokens/releases)  
[![Discord](https://dcbadge.vercel.app/api/shield/219289132235489280?style=flat)](https://discord.gg) [![Ko-fi](https://img.shields.io/badge/Ko--fi-winterwulf-0374b5?logo=kofi)](https://ko-fi.com/winterwulf)

# Flying Tokens

Ever wanted your tokens to fly? I mean really look like they're flying, when they are supposed to, well you should try Flying Tokens.
Flying Tokens works with Token Magic FX API to add shadow and movement that simulates the flight.

## Functions

With the **Automatic Apply** enabled you just have to change the token elevation and it will do all the magic. The module first check if the character has flight movement, otherwise it won't apply the effect.  
When you change the elevation to 0 the token will land.

If you opt to disable the automatic effect and prefer to enable per token you just have to disable **Automatic Apply** in the settings and now all tokens with flying speed movement will have a dove icon in the token HUD, if you click on it, it activates ***Flying Tokens*** for that specific token and then when you change its elevation the effects will apply.

#### First click the dove icon to activate *Flying Tokens* for that token and then set a new elevation
![functions1](readme/functions1.png)

#### If you want to disable just click the dove slashed icon and it will remove the filter effects, then you can change the elevation and it won't apply effects anymore.
![functions2](readme/functions2.png)

### Effects included
Shadow projection, token scale up or down depending on the altitude, small movements to simulate flight, Token Magic FX filter to simulate wind. In the next release it will be configurable.

## Settings
**Automatic Apply**
*Default: active.*  
This setting if checked will apply ***Flying Tokens*** effects to all tokens that have flying speed movement and you change its elevation.

**Output to chat**
*Default: active.*  
Display a chat message with the token name and its new elevation.

![settings](readme/settings.png)

## Dependencies
- [Token Magic FX](https://foundryvtt.com/packages/tokenmagic)

## Known Issues
So far none.

## Feedback
If you have suggestions or want to report a problem, you can create an issue here: [Issues](../../issues)

## Changelog
### 1.0.0
- Intial release

## Special Thanks
`Peterson` and ``Zhell``

## Donations
The module is totally free and will remain this way.  
I am unemployed, though. So every little help counts.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/winterwulf)

## Attributions
--
