import { MODULE } from "./const.js"

export let enableFT = true;
export let enableForAll = false;
export let chatOutput = true;
export let notificationOutput = false;
export let scaleFT = true;
export let enableZoom = false;


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

    game.settings.register(MODULE, 'enableForAll', {
        name: 'All Tokens Can Fly',
        hint: `Any token can fly, enable this if you want to make any token be able to fly.`,
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });

    game.settings.register(MODULE, 'chatOutput', {
        name: 'Output To Chat',
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

    game.settings.register(MODULE, 'notificationOutput', {
        name: 'Notifications',
        hint: `Display Flying Tokens notifications.`,
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });

    game.settings.register(MODULE, 'scaleFT', {
        name: 'Scale Token Based On Elevation',
        hint: `Change the token scale to be larger as it goes higher in elevation`,
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });

    game.settings.register(MODULE, 'enableZoom', {
        name: 'Auto Zoom',
        hint: `Change the zoom level based on the token scale, will only have effect if 'Scale Token Base On Elevation' is enabled.`,
        scope: 'world',
        config: true,
        type: Boolean,
        default: false,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });
}

// function that get the settings options and assign to the variables
export function cacheSettings() {
    enableFT = game.settings.get(MODULE, 'enableFT');
    enableForAll = game.settings.get(MODULE, 'enableForAll');
    chatOutput = game.settings.get(MODULE, 'chatOutput');
    notificationOutput = game.settings.get(MODULE, 'notificationOutput');
    scaleFT = game.settings.get(MODULE, 'scaleFT');
    enableZoom = game.settings.get(MODULE, 'enableZoom');

}
