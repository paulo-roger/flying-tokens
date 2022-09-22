import { MODULE } from "./const.js"

export let enableFT = true;
export let chatOutput = true;
export let enableSound = false;
export let flightSound = 'modules/michaelghelfi/ambience/Snowing.ogg';
export let landingSound = 'modules/ivan-duch-music-packs/audio/rain-sfx.ogg';

export function registerSettings() {
    game.settings.register(MODULE, 'enableFT', {
        name: 'Automatic Apply',
        hint: `Check this option if you would like to have tokens with flight movement automatically fly when increasing their elevation. If this setting is disabled you can still have Flying Tokens to work on individual tokens.`,
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });

    game.settings.register(MODULE, 'chatOutput', {
        name: 'Output to chat',
        hint: `Display Flying Tokens messages in the game chat.`,
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });

    game.settings.register(MODULE, 'enableSound', {
        name: 'Enable sound',
        hint: `Play sound effects along with the visual weather effects (The default are sounds from the modules: Ivan Duch's Music Packs and Michael Ghelfi Studios Audio Pack, so you would need to install these modules as well or set your own custom sounds).`,
        scope: 'world',
        config: false,
        type: Boolean,
        default: false,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });

    game.settings.register(MODULE, 'flightSound', {
        name: 'Custom sounds effects: Blizzard',
        hint: 'Let you change the sounds effects for whatever you prefer.',
        scope: 'world',
        config: true,
        type: String,
        filePicker: 'audio',
        default: 'modules/michaelghelfi/ambience/Snowing.ogg',
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });

    game.settings.register(MODULE, 'landingSound', {
        name: 'Custom sounds effects: Rain',
        hint: 'Let you change the sounds effects for whatever you prefer.',
        scope: 'world',
        config: true,
        type: String,
        filePicker: 'audio',
        default: 'modules/ivan-duch-music-packs/audio/rain-sfx.ogg',
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });
}

// function that get the settings options and assign to the variables
export function cacheSettings() {
    enableFT = game.settings.get(MODULE, 'enableFT');
    chatOutput = game.settings.get(MODULE, 'chatOutput');
    enableSound = game.settings.get(MODULE, 'enableSound');
    flightSound = game.settings.get(MODULE, 'flightSound');
    landingSound = game.settings.get(MODULE, 'landingSound');
}