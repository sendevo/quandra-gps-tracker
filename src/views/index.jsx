import About from "./About";
import Records from "./Records";
import Settings from "./Settings";
import Travel from "./Travel";

const views = [
    {
        path: "/about",
        component: <About />
    },
    {
        path: "/records",
        component: <Records />
    },
    {
        path: "/settings",
        component: <Settings />
    },
    {
        path: "/travel",
        component: <Travel />
    }
];

export default views;