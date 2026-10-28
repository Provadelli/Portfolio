/* Página inicial */
import { initI18n } from "../i18n.js";
import common from "../../i18n/common.en.js";
import home from "../../i18n/home.en.js";
import { initLoader } from "../loader.js";
import { initHeader, initMenu } from "../header.js";
import { initReveal } from "../reveal.js";
import { initFounder } from "../founder.js";
import { initCarousel } from "../carousel.js";
import { initForm } from "../form.js";

initI18n({ ...common, ...home });
initLoader();
initHeader();
initMenu();
initReveal();
initFounder();
initCarousel();
initForm();
