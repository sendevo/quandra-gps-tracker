import About from "./About";
import Records from "./Records";
import Settings from "./Settings";

const views = [
    {
        path: "/about",
        component: <About />
    },
    {
        path: "/settings",
        component: <Settings />
    },
    {
        path: "/records",
        component: <Records />
    }
];

export default views;