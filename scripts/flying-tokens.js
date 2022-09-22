import { MODULE, MODULE_DIR } from "./const.js"; //import the const variables
import { chatMessage } from "./util.js"
import { registerSettings, cacheSettings, enableFT, chatOutput } from "./settings.js" //import settings
import { FlyingHud } from "./flying-hud.js"

//Compatibility with v9
let fvttVersion

// Hook that trigger once when the game is initiated. Register and cache settings.
Hooks.once("init", () => {
    // registerWrappers();
    registerSettings();
    cacheSettings();
});

Hooks.once('ready', async function () {
    fvttVersion = parseInt(game.version)
    console.log(" ====================================== 🐦 Flying Tokens  ======================================= ")
    console.log(" ==================================== FoundryVTT Version:", fvttVersion, " ==================================== ")
    //compatibility with v9
    if (fvttVersion < 10) {
        
    }
});

Hooks.on("preUpdateToken", async (token, updateData) => {
    // await token.setFlag(MODULE, "scale", token.texture.scaleX);
    let enableFlight = token.getFlag(MODULE, "enableFlight")
    if (enableFT || enableFlight) {
        let elevation = getProperty(updateData, "elevation");
        if (elevation !== undefined && isFlyer(token)) {
            await fly(token, elevation)
        }
    }
});

Hooks.on('renderTokenHUD', (app, html, data) => {
    if (!enableFT)
        FlyingHud.renderHud(app, html, data);
});

export function isFlyer(token) {
    let tokenFly = token.actor.data.data.attributes.movement.fly
    if (tokenFly <= 0 || tokenFly == null) {
        let errorMessage = "This creature can't fly."
        // ui.notifications.error(errorMessage);
        console.log("Flying Token error: ", errorMessage)
        return false;
    }
    else return true;
}

async function fly(token, elevation) {
    let scale = token.texture.scaleX;
    let isFlying = token.getFlag(MODULE, "flying")
    if (!isFlying) await token.setFlag(MODULE, "scale", scale);
    if (elevation == 0) {
        return land(token)
    } else {
        await token.setFlag(MODULE, "flying", true)
        await flyZoom(token, elevation)
        await flyingFX(token, elevation)
        ui.notifications.info(token.actor.name + ' is flying at <b>' + elevation + ' feet</b> high.')
        if (chatOutput)
            await chatMessage(`<img src='${token.actor.img}' width='32' style='border:none'> ${token.actor.name} is flying at <b>${elevation} feet</b> high.`)
    }
}

async function tokenScale(token, elevation) {
    if (elevation == 0) {
        let originalScale = token.getFlag(MODULE, "scale");
        await token.update({ scale: originalScale })
        return 0
    }
    let scale = Math.pow(elevation, 0.28)
    scale = Math.round((scale + Number.EPSILON) * 100) / 100 //rounding with 2 floats
    if (scale <= 1) scale += 1
    else if (scale > 10) scale = 10
    await token.update({ scale: scale })
    return scale
}

async function flyZoom(token, elevation, minZoom = 3) {
    let scale = await tokenScale(token, elevation)
    let zoom = Math.min(3 / (Math.max(scale / 1.5, 1)), minZoom)
    let x = token.x + game.scenes.viewed.data.size
    let y = token.y + game.scenes.viewed.data.size
    canvas.animatePan({ x: x, y: y, scale: zoom })
}

async function flyingFX(token, elevation) {
    let canvasToken = canvas.tokens.get(token.id)
    const flyingFXParams = [{
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
    }, {
        filterType: "zapshadow",
        filterId: MODULE,
        alphaTolerance: 0.5,
        rank: 2
    }, {
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
    }, {
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
                val2: 33 + (elevation * 0.05)
            }
        }
    }, {
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
    }]
    let isFlying = token.getFlag(MODULE, "flying")
    await canvasToken.TMFXdeleteFilters(MODULE)
    if (isFlying) {
        await TokenMagic.addUpdateFilters(canvasToken, flyingFXParams);
    }
}

export async function land(token) {
    await token.setFlag(MODULE, "flying", false);
    let scale = token.getFlag(MODULE, "scale");
    await token.update({ scale: scale })
    await flyingFX(token, 0);
    await flyZoom(token, 0, 2.5);
    ui.notifications.info(token.actor.name + ' <b> has landed</b>.')
    if (chatOutput)
        await chatMessage(`<img src='${token.actor.img}' width='32' style='border:none'> ${token.actor.name}  <b> has landed</b>.`)
}