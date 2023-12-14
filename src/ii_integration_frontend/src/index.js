import {
    createActor,
    ii_integration_backend,
} from "../../declarations/ii_integration_backend";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";

let actor = ii_integration_backend;
console.log(process.env.CANISTER_ID_INTERNET_IDENTITY);
const whoAmIButton = document.getElementById("whoAmI");
whoAmIButton.onclick = async (e) => {
    e.preventDefault();
    whoAmIButton.setAttribute("disabled", true);
    const principal = await actor.whoami();
    whoAmIButton.removeAttribute("disabled");
    document.getElementById("principal").innerText = principal.toString();
    return false;
};

const emptyRequest = {
    body: new Uint8Array(),
    headers: [],
    method: '',
    url: '',
  };

const daoButton = document.getElementById("daoButton");
daoButton.onclick = async (e) => {
    e.preventDefault();
    daoButton.setAttribute("disabled", true);
    const webpage = await actor.dao_webpage(emptyRequest);
    const webpageText = new TextDecoder().decode(webpage.body);
    const newTab = window.open('DAO');
    newTab.document.write(webpageText); 
    daoButton.removeAttribute("disabled");
    document.getElementById("dao").innerText = "<goto DAO tab>";
    return false;
};

const loginButton = document.getElementById("login");
loginButton.onclick = async (e) => {
    e.preventDefault();
    let authClient = await AuthClient.create();
    // start the login process and wait for it to finish
    await new Promise((resolve) => {
        authClient.login({
            identityProvider:
                process.env.DFX_NETWORK === "ic"
                    ? "https://identity.ic0.app"
                    : `http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai`,
            onSuccess: resolve,
        });
    });
    const identity = authClient.getIdentity();
    const agent = new HttpAgent({ identity });
    actor = createActor(process.env.CANISTER_ID_II_INTEGRATION_BACKEND, {
        agent,
    });
    return false;
}