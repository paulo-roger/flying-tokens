import { MODULE, MODULE_DIR } from "./const.js"; //import the const variables
import { elevation } from "./flying-tokens.js"

export const movement = {
    filterType: "images",
    filterId: MODULE,
    time: 100,
    nbImage: 1,
    alphaImg: 1,
    alphaChr: 0.0,
    blend: 4,
    ampX: 0.005,
    ampY: 0.005,
    animated: {
        time:
        {
            active: true,
            speed: 0.0010,
            animType: "move"
        }
    }
}
export const noShadow = {
    filterType: "zapshadow",
    filterId: MODULE,
    alphaTolerance: 0.5,
    rank: 2
}
export const wind = {
    filterType: "transform",
    filterId: MODULE,
    twRadiusPercent: 10,
    padding: 150,
    animated:
    {
        twRotation:
        {
            animType: "sinOscillation",
            val1: -(0.05 * elevation),
            val2: +(0.05 * elevation),
            loopDuration: 5000,
        }
    }
}
export const shadow = {
    filterType: "shadow",
    filterId: MODULE,
    rotation: 35,
    blur: 2,
    quality: 5,
    distance: elevation / 0.7,
    alpha: Math.min(1 / ((elevation) / 50), 0.8),
    padding: elevation * 2,
    shadowOnly: false,
    color: 0x000000,
    zOrder: 6000,
    animated:
    {
        blur:
        {
            active: true,
            loopDuration: 5000,
            animType: "syncCosOscillation",
            val1: 2,
            val2: 4
        },
        rotation:
        {
            active: true,
            loopDuration: 5000,
            animType: "syncSinOscillation",
            val1: 33,
            val2: 33 + (elevation * 0.1)
        }
    }
}
export const bounce = {
    filterType: "transform",
    filterId: MODULE,
    padding: 50,
    animated:
    {
        translationX:
        {
            animType: "sinOscillation",
            val1: -0.005,
            val2: +0.005,
            loopDuration: 9600,
        },
        translationY:
        {
            animType: "cosOscillation",
            val1: -0.005,
            val2: +0.005,
            loopDuration: 1400,
        }
    }
}