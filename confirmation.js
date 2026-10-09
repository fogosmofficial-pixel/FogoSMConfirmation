const SUPABASE_URL = "https://glomwjsfdamgjlhqgath.supabase.co";
const SUPABASE_KEY = "sb_publishable__imIAViEF22J5UFz_uquWg_d9HpvGq9";

const supabaseClient = window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

const title = document.getElementById("title");
const message = document.getElementById("message");
const statusIcon = document.getElementById("statusIcon");
const loader = document.getElementById("loader");
const actionButton = document.getElementById("actionButton");

function showResult(icon, heading, description, buttonText, buttonUrl) {
statusIcon.textContent = icon;
title.textContent = heading;
message.textContent = description;

```
loader.classList.add("hidden");

actionButton.textContent = buttonText;
actionButton.href = buttonUrl;
actionButton.classList.remove("hidden");
```

}

async function confirmAccount() {
const params = new URLSearchParams(window.location.search);
const hashParams = new URLSearchParams(
window.location.hash.substring(1)
);

```
const tokenHash = params.get("token_hash");
const type = params.get("type");

const accessToken = hashParams.get("access_token");
const refreshToken = hashParams.get("refresh_token");

const errorDescription =
    hashParams.get("error_description") ||
    params.get("error_description");

if (errorDescription) {
    showResult(
        "⚠️",
        "Enlace no válido",
        "El enlace ha caducado o no es válido. Espera un poco y solicita uno nuevo.",
        "Ir a FogoSM",
        "https://fogosmofficial-pixel.github.io/FogoSMConfirmation/"
    );
    return;
}

try {
    if (tokenHash && ["signup", "email"].includes(type)) {
        const { error } = await supabaseClient.auth.verifyOtp({
            token_hash: tokenHash,
            type: type
        });

        if (error) {
            throw error;
        }
    } else if (accessToken && refreshToken) {
        const { error } = await supabaseClient.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
        });

        if (error) {
            throw error;
        }
    } else {
        throw new Error("No se encontró un token de confirmación.");
    }

    showResult(
        "✅",
        "¡Cuenta confirmada!",
        "Tu correo se ha verificado. Ya puedes continuar a FogoSM.",
        "Iniciar sesión",
        "http://127.0.0.1:5500/login.html"
    );
} catch (error) {
    console.error("Confirmation error:", error);

    showResult(
        "⚠️",
        "No se pudo confirmar",
        "El enlace puede haber caducado o haberse utilizado. Cuando puedas, solicita un correo nuevo.",
        "Volver a la página",
        "https://fogosmofficial-pixel.github.io/FogoSMConfirmation/"
    );
}
```

}

confirmAccount();
