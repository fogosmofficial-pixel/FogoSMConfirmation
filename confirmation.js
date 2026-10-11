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

    loader.classList.add("hidden");

    actionButton.textContent = buttonText;
    actionButton.href = buttonUrl;
    actionButton.classList.remove("hidden");
}

function showError(description) {
    showResult(
        "⚠️",
        "No se pudo confirmar",
        description,
        "Volver a FogoSM",
        "https://fogosmofficial-pixel.github.io/FogoSMConfirmation/"
    );
}

async function confirmAccount() {
    try {
        const params = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(
            window.location.hash.substring(1)
        );

        const errorDescription =
            hashParams.get("error_description") ||
            params.get("error_description");

        if (errorDescription) {
            showError(
                "El enlace ha caducado o no es válido. Cuando puedas, solicita un nuevo correo de confirmación."
            );
            return;
        }

        const tokenHash = params.get("token_hash");
        const type = params.get("type");
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (tokenHash && (type === "signup" || type === "email")) {
            const result = await Promise.race([
                supabaseClient.auth.verifyOtp({
                    token_hash: tokenHash,
                    type: type
                }),
                new Promise((_, reject) =>
                    setTimeout(
                        () => reject(new Error("TIMEOUT")),
                        15000
                    )
                )
            ]);

            if (result.error) {
                throw result.error;
            }
        } else if (accessToken && refreshToken) {
            const result = await Promise.race([
                supabaseClient.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken
                }),
                new Promise((_, reject) =>
                    setTimeout(
                        () => reject(new Error("TIMEOUT")),
                        15000
                    )
                )
            ]);

            if (result.error) {
                throw result.error;
            }
        } else {
            throw new Error("MISSING_TOKEN");
        }

        showResult(
            "✅",
            "¡Cuenta confirmada!",
            "Tu correo se ha verificado correctamente.",
            "Iniciar sesión",
            "http://127.0.0.1:5500/login.html"
        );
    } catch (error) {
        console.error("Confirmation error:", error);

        if (error.message === "TIMEOUT") {
            showError(
                "La confirmación está tardando demasiado. Comprueba tu conexión e inténtalo más tarde."
            );
        } else if (error.message === "MISSING_TOKEN") {
            showError(
                "No se encontraron los datos de confirmación en el enlace. Puede haber caducado o haberse utilizado."
            );
        } else {
            showError(
                "No se pudo verificar el correo. El enlace puede haber caducado o haberse utilizado."
            );
        }
    }
}

confirmAccount();
