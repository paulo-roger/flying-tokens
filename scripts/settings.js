import { MODULE } from "./const.js"

export let enableFT = true;
export let enableForAll = false;
export let chatOutput = true;
export let notificationOutput = false;
export let scaleFT = true;
export let enableZoom = false;
export let optMovement = true;
export let optNoShadow = true;
export let optWind = true;
export let customScale = null;

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

    game.settings.register(MODULE, 'customScale', {
        name: 'Custom Scale',
        hint: `Customize the escalation increment variable. The formula is: scale = originalScale + customScale * elevation `,
        scope: 'world',
        config: true,
        type: Number,
        range: {
            min: 0.001,
            max: 0.02,
            step: 0.005
          },
        default: 0.01,
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

    game.settings.register(MODULE, 'optMovement', {
        name: 'Enable Movement Effect.',
        hint: `This setting will only affect tokens flying after the change, to apply to a token already flying you must land and fly again.`,
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });

    game.settings.register(MODULE, 'optNoShadow', {
        name: 'Enable Shadow Remove',
        hint: `Flying Tokens auto remove the shadow drawing from the token, uncheck this option if you want to disable this behavior. This setting will only affect tokens flying after the change, to apply to a token already flying you must land and fly again.`,
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
        restricted: true,
        onChange: () => {
            cacheSettings();
        },
    });

    game.settings.register(MODULE, 'optWind', {
        name: 'Enable wind Effect',
        hint: `Uncheck this to remove the small twist effect from the center of the token while it is flying. This setting will only affect tokens flying after the change, to apply to a token already flying you must land and fly again.`,
        scope: 'world',
        config: true,
        type: Boolean,
        default: true,
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
    customScale = game.settings.get(MODULE, 'customScale');
    enableZoom = game.settings.get(MODULE, 'enableZoom');
    optMovement = game.settings.get(MODULE, 'optMovement');
    optNoShadow = game.settings.get(MODULE, 'optNoShadow');
    optWind = game.settings.get(MODULE, 'optWind');
}
