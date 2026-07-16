import {
    login,
    logout,
    observeAuthState
} from "../authService.js";

function getLoginErrorMessage(errorCode) {
    switch (errorCode) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
            return "The email address or password is incorrect.";

        case "auth/invalid-email":
            return "Enter a valid email address.";

        case "auth/user-disabled":
            return "This administrator account has been disabled.";

        case "auth/too-many-requests":
            return (
                "Too many unsuccessful attempts. " +
                "Please wait before trying again."
            );

        case "auth/network-request-failed":
            return (
                "The sign-in request could not reach Firebase. " +
                "Check your internet connection."
            );

        default:
            return "Unable to sign in. Please try again.";
    }
}

export function initializeAuthentication({
    loginPanel,
    loginForm,
    loginEmail,
    loginPassword,
    loginButton,
    loginMessage,
    userPanel,
    userEmail,
    logoutButton,
    addBuildingButton,
    onAuthStateChanged
}) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        loginMessage.textContent = "";
        loginMessage.className = "form-message";
        loginButton.disabled = true;
        loginButton.textContent = "Signing In...";

        try {
            await login(
                loginEmail.value.trim(),
                loginPassword.value
            );

            loginForm.reset();
        } catch (error) {
            console.error("Administrator sign-in failed:", error);
            loginMessage.textContent =
                getLoginErrorMessage(error.code);
            loginMessage.className = "form-message error";
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = "Sign In";
        }
    });

    logoutButton.addEventListener("click", async () => {
        logoutButton.disabled = true;
        logoutButton.textContent = "Signing Out...";

        try {
            await logout();
        } catch (error) {
            console.error("Administrator sign-out failed:", error);
        } finally {
            logoutButton.disabled = false;
            logoutButton.textContent = "Sign Out";
        }
    });

    return observeAuthState((user) => {
        if (user) {
            loginPanel.classList.add("hidden");
            userPanel.classList.remove("hidden");
            addBuildingButton.classList.remove("hidden");
            userEmail.textContent = user.email || "Administrator";
        } else {
            loginPanel.classList.remove("hidden");
            userPanel.classList.add("hidden");
            addBuildingButton.classList.add("hidden");
            userEmail.textContent = "";
        }

        onAuthStateChanged(user);
    });
}
