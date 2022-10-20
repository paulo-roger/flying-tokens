import { MODULE, MODULE_DIR } from "./const.js"; //import the const variables
import { chatMessage } from "./util.js"
import { registerSettings, cacheSettings, enableFT, enableForAll, scaleFT, enableZoom, chatOutput, notificationOutput, optMovement, optNoShadow, optWind, customScale } from "./settings.js" //import settings
import { FlyingHud } from "./flying-hud.js"
// import { movement, noShadow, wind, shadow, bounce } from "./filters.js"

//Compatibility with v9
let fvttVersion
//Compatibility with PF2E
let system

// Hook that trigger once when the game is initiated. Register and cache settings.
Hooks.once("init", () => {
    // registerWrappers();
    registerSettings();
    cacheSettings();
});

Hooks.once('ready', async function () {
    fvttVersion = parseInt(game.version)
    system = game.system.id
    console.log(" ====================================== 🐦 Flying Tokens  ======================================= ")
    console.log(" ==================================== FoundryVTT Version:", fvttVersion, " ==================================== ")
    pf2eAutoScaleCheck();
});

function pf2eAutoScaleCheck(token, perma = true) {
    let check;
    if (system == 'pf2e' && scaleFT) {
        if (token) check = token.getFlag("pf2e", "linkToActorSize")
        else check = game.settings.get('pf2e', 'tokens.autoscale')
        if (check) ui.notifications.warn('If you want Flying Tokens to autoscale you must disable PF2E setting "<b>Scale tokens according to size</b>" or individually disable this in the token config.', {permanent:perma})
    }
}

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

Hooks.on("renderTokenConfig", (app, html, data) => {
    if (isFlyer(app.token)) {
        let altToken = app.token.getFlag(MODULE, "altToken") || "";
        let newHtml = `<div class="form-group">
                    <label>Flying Image Path</label>
                    <div class="form-fields">
                      <button type="button" class="file-picker" data-type="imagevideo" data-target="flags.${MODULE}.altToken" title="Browse Files" tabindex="-1">
                        <i class="fas fa-file-import fa-fw"></i>
                      </button>
                      <input class="image" type="text" name="flags.${MODULE}.altToken" placeholder="path/image.png" value="${altToken}">
                    </div>
                  </div>`
        const tinthtml = html.find('input[name="texture.src"]');
        const formGroup = tinthtml.closest(".form-group");
        formGroup.after(newHtml);
        // altToken = html.find('input[name="flags.flyingTokens.alt"]').value;
        app.setPosition({ height: "auto" });
        html.find(`button[data-target="flags.${MODULE}.altToken"]`).on('click', async () => {
            new FilePicker({
                current: altToken,
                type: "imagevideo",
                displayMode: "tiles",
                button: "file-picker",
                callback: async (path) => {
                    html.find(`input[name="flags.${MODULE}.altToken"]`).val(path);
                    // console.log(app.token)
                    // await app.token.setFlag(MODULE, "altToken", path)
                }
            }).render()
        });
    }
});

export function isFlyer(token) {
    if (enableForAll) return true;
    let tokenFly = token.actor.data.data.attributes.movement.fly
    if (tokenFly <= 0 || tokenFly == null) {
        let errorMessage = "This creature can't fly."
        // ui.notifications.error(errorMessage);
        console.log("Flying Token error: ", errorMessage)
        return false;
    }
    else return true;
}

export async function fly(token, elevation) {
    let scale
    if (fvttVersion >= 10)
        scale = token.texture.scaleX;
    if (fvttVersion < 10)
        scale = token.data.scale
    let isFlying = token.getFlag(MODULE, "flying")
    if (!isFlying) {
        await token.setFlag(MODULE, "scale", scale);
        await token.setFlag(MODULE, "originalToken", token.texture.src);
    }
    if (elevation == 0) {
        return land(token)
    } else if (elevation < 0) {
        return;
    } else {
        await token.setFlag(MODULE, "flying", true)
        await flyZoom(token, elevation)
        await flyingFX(token, elevation)
        if (notificationOutput)
            ui.notifications.info(token.name + ' is flying at <b>' + elevation + ' feet</b> high.')
        if (chatOutput)
            await chatMessage(`<img src='${token.texture.src}' width='32' style='border:none'> ${token.name} is flying at <b>${elevation} feet</b> high.`)
    }
}

async function tokenScale(token, elevation) {
    pf2eAutoScaleCheck(token, false);
    let originalScale = token.getFlag(MODULE, "scale");
    let altToken = token.getFlag(MODULE, "altToken") || token.getFlag(MODULE, "originalToken");
    if (elevation == 0) return 0
    let scale = originalScale + customScale * elevation
    scale = Math.round((scale + Number.EPSILON) * 100) / 100 //rounding with 2 floats
    if (scale < 0.2) scale = 0.2
    else if (scale > 10) scale = 10
    await token.update({ texture: { src: altToken } })
    await new Promise(resolve => setTimeout(resolve, 800));//give time to the scale animation to play
    await token.update({ texture: { scaleX: scale, scaleY: scale } })//this is in a different line so the animation plays AFTER the token is changed.
    return scale
}

async function flyZoom(token, elevation, minZoom = 3) {
    if (scaleFT) {
        let scale = await tokenScale(token, elevation)
        if (enableZoom) {
            let x = token.x + game.scenes.viewed.data.size
            let y = token.y + game.scenes.viewed.data.size
            let zoom = Math.min(3 / (Math.max(scale / 1.5, 1)), minZoom)
            await canvas.animatePan({ x: x, y: y, scale: zoom })
        }
    }
}

async function flyingFX(token, elevation) {
    let canvasToken = canvas.tokens.get(token.id)
    const movement = {
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
    const noShadow = {
        filterType: "zapshadow",
        filterId: MODULE,
        alphaTolerance: 0.5,
        rank: 2
    }
    const wind = {
        filterType: "transform",
        filterId: MODULE,
        twRadiusPercent: 10,
        padding: 150,
        animated:
        {
            twRotation:
            {
                animType: "sinOscillation",
                val1: -(2 * Math.pow(elevation, 0.28)),
                val2: +(2 * Math.pow(elevation, 0.28)),
                loopDuration: 5000,
            }
        }
    }
    const shadow = {
        filterType: "shadow",
        filterId: MODULE,
        rotation: 35,
        blur: 2,
        quality: 5,
        distance: elevation / 0.7,
        alpha: Math.min(1 / ((elevation) / 60), 0.8),
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
                val2: 33 + (3 * Math.pow(elevation, 0.28))
            }
        }
    }
    const bounce = {
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
    let flyingFXParams = []

    if (optNoShadow)
        flyingFXParams.push(noShadow, shadow)
    if (optWind)
        flyingFXParams.push(wind)
    if (optMovement)
        flyingFXParams.push(bounce, movement)

    let isFlying = token.getFlag(MODULE, "flying")
    await canvasToken.TMFXdeleteFilters(MODULE)
    if (isFlying)
        await TokenMagic.addUpdateFilters(canvasToken, flyingFXParams);
}

export async function land(token) {
    await token.setFlag(MODULE, "flying", false);
    let originalToken = token.getFlag(MODULE, "originalToken");
    let scale = token.getFlag(MODULE, "scale");
    await token.update({ texture: { scaleX: scale, scaleY: scale } })
    await flyZoom(token, 0, 2.5);
    await new Promise(resolve => setTimeout(resolve, 800));//give time to the scale animation to play
    await flyingFX(token, 0);
    await token.update({ texture: { src: originalToken } }) //this is in a different line so the animation plays BEFORE the token is changed.
    if (notificationOutput)
        ui.notifications.info(token.name + ' <b> has landed</b>.')
    if (chatOutput)
        await chatMessage(`<img src='${token.texture.src}' width='32' style='border:none'> ${token.name}  <b> has landed</b>.`)
}
