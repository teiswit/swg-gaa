// GAA-compatible Google Sign-in Button for 3P Authentication Service.

/** Stamp for post messages. */
const POST_MESSAGE_STAMP = "swg-gaa-post-message-stamp";

/** User command for post messages. */
const POST_MESSAGE_COMMAND_USER = "user";

/** Error command for post messages. */
const POST_MESSAGE_COMMAND_ERROR = "error";

/** ID for the Google Sign-In iframe element. */
const GOOGLE_SIGN_IN_IFRAME_ID = "swg-google-sign-in-iframe";

/** ID for the Google Sign-In button element. */
const GOOGLE_SIGN_IN_BUTTON_ID = "swg-google-sign-in-button";

/** Localized strings */
const I18N_STRINGS = {
  SHOWCASE_REGWALL_GOOGLE_SIGN_IN_BUTTON: {
    cs: "Přihlásit se přes Google",
    de: "Über Google anmelden",
    en: "Sign in with Google",
    es: "Iniciar sesión con Google",
    "es-ar": "Acceder con Google",
    fr: "Se connecter avec Google",
    hi: "Google से साइन इन करें",
    it: "Accedi con Google",
    ja: "Google でログイン",
    kn: "Google ಖಾತೆ ಬಳಸಿಕೊಂಡು ಸೈನ್ ಇನ್ ಮಾಡಿ",
    ml: "Google ഉപയോഗിച്ച് സൈൻ ഇൻ ചെയ്യുക",
    mr: "Google वापरून साइन इन करा",
    nl: "Inloggen met Google",
    "pt-br": "Fazer login com o Google",
    ta: "Google மூலம் உள்நுழைக",
    te: "Googleతో సైన్ ఇన్ చేయండి"
  }
};

/** Styles for the Google Sign-In button iframe. */

const GOOGLE_SIGN_IN_IFRAME_STYLES = `
body {
  margin: 0;
  overflow: hidden;
}
#${GOOGLE_SIGN_IN_BUTTON_ID} {
  margin: 0 auto;
}
#${GOOGLE_SIGN_IN_BUTTON_ID} > div {
  animation: fadeIn 0.32s;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
#${GOOGLE_SIGN_IN_BUTTON_ID} .abcRioButton.abcRioButtonBlue {
  background-color: #1A73E8;
  box-shadow: none;
  -webkit-box-shadow: none;
  border-radius: 4px;
  width: 100% !important;
}
#${GOOGLE_SIGN_IN_BUTTON_ID} .abcRioButton.abcRioButtonBlue .abcRioButtonIcon {
  display: none;
}
/** Hides default "Sign in with Google" text. */
#${GOOGLE_SIGN_IN_BUTTON_ID} .abcRioButton.abcRioButtonBlue .abcRioButtonContents span[id^=not_signed_] {
  font-size: 0 !important;
}
/** Renders localized "Sign in with Google" text instead. */
#${GOOGLE_SIGN_IN_BUTTON_ID} .abcRioButton.abcRioButtonBlue .abcRioButtonContents span[id^=not_signed_]::before {
  content: '$SHOWCASE_REGWALL_GOOGLE_SIGN_IN_BUTTON$';
  font-size: 15px;
}
#swg-google-sign-in-button .abcRioButton.abcRioButtonBlue {
  background-color: #1A73E8;
  box-shadow: none;
  -webkit-box-shadow: none;
  border-radius: 4px;
  width: 100% !important;
}  
.abcRioButtonContents {
  font-family: Roboto,arial,sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: .21px;
  margin-left: 6px;
  margin-right: 6px;
  vertical-align: top;
}
.abcRioButton {
  border-radius: 1px;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 25%);
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transition: background-color .218s,border-color .218s,box-shadow .218s;
  transition: background-color .218s,border-color .218s,box-shadow .218s;
  -webkit-user-select: none;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  color: #262626;
  cursor: pointer;
  outline: none;
  overflow: hidden;
  position: relative;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  width: auto;
}
.abcRioButtonBlue {
  border: none;
  color: #fff;
}
`;

const GOOGLE_SIGN_IN_BUTTON_HTML = `
<div style="height:36px;width:180px;" class="abcRioButton abcRioButtonBlue">
  <span style="font-size:15px;line-height:34px;" class="abcRioButtonContents">
    <span id="not_signed_innghwd5ggelyr">Sign in with Google</span>
  </span>
</div>
`;

class GaaExternalGoogleSignInButton {
  /**
   * Renders the Google Sign-In button for external authentication.
   * @nocollapse
   * @param {{ allowedOrigins: !Array<string>, authorizationUrl: string }} params
   */
  static show({ allowedOrigins, authorizationUrl, languageCode }) {
    console.log("Show ext GSI button");
    if (!languageCode) {
      languageCode = "en";
    }

    // Apply iframe styles.
    const styleEl = self.document.createElement("style");
    styleEl./*OK*/ innerText = GOOGLE_SIGN_IN_IFRAME_STYLES.replace(
      "$SHOWCASE_REGWALL_GOOGLE_SIGN_IN_BUTTON$",
      I18N_STRINGS["SHOWCASE_REGWALL_GOOGLE_SIGN_IN_BUTTON"][languageCode]
    );
    self.document.head.appendChild(styleEl);

    // Render the Google Sign-In button.
    const buttonEl = self.document.createElement("div");
    buttonEl.id = GOOGLE_SIGN_IN_BUTTON_ID;
    buttonEl.tabIndex = 0;
    buttonEl.innerHTML = GOOGLE_SIGN_IN_BUTTON_HTML;
    buttonEl.onclick = () => {
      window.open(authorizationUrl);
    };
    self.document.body.appendChild(buttonEl);

    // Relay message to the parent frame (GAA Intervention)
    window.addEventListener("message", e => {
      if (
        allowedOrigins.indexOf(e.origin) !== -1 &&
        e.data.stamp === POST_MESSAGE_STAMP &&
        e.data.command === POST_MESSAGE_COMMAND_USER
      ) {
        window.parent.postMessage(e.data, e.origin);
      }
    });
  }
}

/**
 * Notify Google Intervention of a complete sign-in event
* @param {{ gaaUser: <?GaaUserDef>}} params
 */
function notifySignIn({ gaaUser }) {
  window.opener.postMessage({
    stamp: POST_MESSAGE_STAMP,
    command: POST_MESSAGE_COMMAND_USER,
    gaaUser
  });
}
