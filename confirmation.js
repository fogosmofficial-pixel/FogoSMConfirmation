
const SUPABASE_URL = "https://glomwjsfdamgjlhqgath.supabase.co";

const SUPABASE_KEY =
    "sb_publishable__imIAViEF22J5UFz_uquWg_d9HpvGq9";

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

async function confirmAccount() {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(
        window.location.hash.substring(1)
    );

    const tokenHash = params.get("token_hash");
    const type = params.get("type");

    // Supabase may also return an access token in the URL fragment.
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    const errorDescription =
        hashParams.get("error_description") ||
        params.get("error_description");

    if (errorDescription) {
        showResult(
            "⚠️",
            "Enlace no válido",
            "El enlace ha caducado o no es válido. Vuelve a solicitar un correo de confirmación.",
            "Ir a FogoSM",
            "../FogoSM/login.html"
        );
        return;
    }

    try {
        if (tokenHash && type === "email") {
            const { error } = await supabaseClient.auth.verifyOtp({
                token_hash: tokenHash,
                type: "email"
            });

            if (error) throw error;
        } else if (accessToken && refreshToken) {
            const { error } = await supabaseClient.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
            });

            if (error) throw error;
        } else {
            throw new Error("Missing confirmation token");
        }

        showResult(
            "✅",
            "¡Cuenta confirmada!",
            "Tu correo se ha verificado. Ya puedes continuar a FogoSM.",
            "Iniciar sesión",
            "../FogoSM/login.html"
        );
    } catch (error) {
        console.error("Confirmation error:", error);

        showResult(
            "⚠️",
            "No se pudo confirmar",
            "El enlace puede haber caducado o haberse utilizado. Solicita un nuevo correo de confirmación.",
            "Ir a FogoSM",
            "../FogoSM/login.html"
        );
    }
}

confirmAccount();
