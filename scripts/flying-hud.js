import { MODULE, MODULE_DIR } from "./const.js"; //import the const variables
// import { getCanvas } from "./util.js";
import { isFlyer, land, fly } from "./flying-tokens.js";

/**
 * Functinality class for managing the token HUD
 */
export class FlyingHud {

    /**
     * Called when a token is right clicked on to display the HUD.
     * Adds a button with an icon, and adds a slash on top if it is disabled.
     * @param {Object} app - the application data
     * @param {Object} html - the html data
     * @param {Object} hudData - The HUD Data
     */
    static async renderHud(app, html, hudData) {
        let token = canvas.tokens.get(hudData._id)
        let enableFlight = token.document.getFlag(MODULE, "enableFlight")
        if (isFlyer(token)) {
            if (enableFlight) {
                this.addDisableButton(html, hudData)
            } else {
                this.addEnableButton(html, hudData);
            }
        }
    }
    static async addEnableButton(html, hudData) {
        // let token = canvas.tokens.controlled.filter(token => token.id == hudData._id).map(token => { return token; });
        let token = canvas.tokens.get(hudData._id)
        const button = this.buildButton(html, `Enable flight`);
        button.find('i').on("click", async (ev) => {
            await token.document.setFlag(MODULE, "enableFlight", true)
            await fly(token.document, token.document.elevation)
            canvas.hud.token.render();
        });
    }
    static async addDisableButton(html, hudData) {
        let token = canvas.tokens.get(hudData._id)
        let button = this.buildButton(html, `Disable flight`);
        button = this.addSlash(button);

        button.find('i').on("click", async (ev) => {
            land(token.document)
            await token.document.setFlag(MODULE, "enableFlight", false)
            canvas.hud.token.render();
        });
    }

    static buildButton(html, tooltip) {
        let button = $(`<div class="control-icon mount-up" title="${tooltip}"><i class="fas fa-dove"></i></div>`);
        let col = html.find('.col.left');
        col.prepend(button);
        return button;
    }
    /**
     * Adds a slash icon on top of the horse icon to signify "dismount"
     * @param {Object} button - The HUD button to add a slash on top of
     */
    static addSlash(button) {
        let slash = $(`<i class="fas fa-slash" style="position: absolute; color: grey"></i>`);
        button.addClass("fa-stack");
        button.find('i').addClass('fa-stack-1x');
        slash.addClass('fa-stack-1x');
        button.append(slash);
        return button;
    }
}

